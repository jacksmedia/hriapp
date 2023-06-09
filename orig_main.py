# Kyeto & xJ4cks
# Reads MultiversX blockchain & writes calculations
# based upon owership of the following collections:
# COMBEYS-bc640d 
# COMBOTS-aa4150 
# soon -- COMBIENS-xxxxxx
# 2023Q2 MIT License

import requests
import pandas as pd
import time
import json

def tryAgain():
    exitLoop = False
    choice = True
    while not (exitLoop):
        choice = input('Retry y/n?:')
        exitLoop = (choice == 'y' or choice == 'n')

    if choice == 'y':
        return True
    else:
        return False

def getHolderTable(collectionID, filename, rankDataFile):

    MAXPACKETSIZE = 100
    header = ["Token identifier", "Nonce", "Rank", "Owner"]
    holderData = pd.DataFrame(columns=header)
    rankData = pd.read_csv(rankDataFile)

    data = requests.get('https://api.multiversx.com/collections/' + collectionID + '/nfts/count')
    if data.status_code == 200:
        collectionCount = int(data.content)
        print("Collection count:" + str(collectionCount))
        fromNFT = 0
        j = 0
        for i in range(0, collectionCount):
            if (j == MAXPACKETSIZE or i ==0):
                if i:
                    fromNFT = fromNFT + MAXPACKETSIZE
                j = 0
                try:
                    data = requests.get('https://api.multiversx.com/collections/' + collectionID + '/nfts?from=' + str(fromNFT) +'&size=' + str(MAXPACKETSIZE) + '&withOwner=true')
                    data.raise_for_status()
                    parsedCollection = data.json()
                    print(type(parsedCollection))
                except requests.exceptions.HTTPError as errh:
                    print("Http Error:", errh)
                    if tryAgain():
                        i -= 1
                        j -= 1
                        continue
                    else:
                        break
                except requests.exceptions.ConnectionError as errc:
                    print("Error Connecting:", errc)
                    if tryAgain():
                        i -= 1
                        j -= 1
                        continue
                    else:
                        break
                except requests.exceptions.Timeout as errt:
                    print("Timeout Error:", errt)
                    if tryAgain():
                        i -= 1
                        j -= 1
                        continue
                    else:
                        break
                except requests.exceptions.RequestException as err:
                    print("Exception error, break", err)
                    break

            if 'owner' in parsedCollection[j]:
                ownerAddress = parsedCollection[j]['owner']
            else:
                ownerAddress = 'No Data'
            extractRowRank = rankData[rankData['NFTID'] == parsedCollection[j]['identifier']]["RANK"].tolist()
            rank = extractRowRank[0]
            row = [parsedCollection[j]['identifier'], parsedCollection[j]['nonce'], rank, ownerAddress]
            print(row)
            holderData.loc[len(holderData)] = row
            j = j + 1

    else:
        print("HTTP error :"+ str(data.status_code))
        print(data.text)

    holderData.to_csv(filename, index=False)

def getHRITable(combeyHolderFile, combotsHolderFile):

    header = ["Owner", "HRI"]
    holderHRITable = pd.DataFrame(columns=header)

    combeys = pd.read_csv(combeyHolderFile)
    combots = pd.read_csv(combotsHolderFile)

    combeysOwner = list(combeys["Owner"])
    combotsOwner = list(combots["Owner"])
    owners = list(dict.fromkeys(combeysOwner + combotsOwner)) #Sum both owner and remove duplicate

    for owner in owners:
        combeysData = combeys.loc[combeys["Owner"] == owner]
        combotsData = combots.loc[combots["Owner"] == owner]
        combeysSum = len(combeysData.index)
        combotsSum = len(combotsData.index)
        combeysRankMean = combeysData["Rank"].mean()
        combotsRankMean = combotsData["Rank"].mean()

        if combeysSum > 0:
            combeysHRI = combeysRankMean/(2*combeysSum)
        else:
            combeysHRI = 0
        if combeysSum < 10:
            combeysHRI += 10 - combeysSum

        if combotsSum > 0:
            combotsHRI = combotsRankMean/(2*combotsSum)
        else:
            combotsHRI = 0.0
        if combotsSum < 10:
            combotsHRI += 10 - combotsSum

        HRI = (combeysHRI + combotsHRI)/2
        if owner != "No Data":
            holderHRITable.loc[len(holderHRITable)] = [str(owner), float(HRI)]
            print(str(owner) + ", " + str(HRI)) # sets data as comma-seprarated (csv)
    # writes calculations to spreadsheet, name on line 132
    holderHRITable.to_csv('HolderHRI.csv', index=False)
    # writes calculation to object file, name on line 135
    jsonTable = holderHRITable.to_json(orient='records')
    file = open('./src/components/ListJSON/data.json', 'w')
    file.write(jsonTable)
    file.close()

    # timestamp is taken and then injected into the React app in component dir (WIP)
    # seconds = time.time()
    # local_time = time.ctime(seconds)
    # # local_time = '{"timestamp":'+local_time+'}'
    # jsonTimestamp = json.loads(local_time)
    # jsonTimestamp = json.dumps(jsonTimestamp)
    # text_file = open("./src/components/Timestamp/timestamp.json", "wt")
    # text_file.write(jsonTimestamp)
    # text_file.close()

if __name__ == '__main__':

    getHolderTable("COMBEYS-bc640d", "CombeyHolder.csv", "CombeysRanking.csv")
    getHolderTable("COMBOTS-aa4150", "CombotsHolder.csv", "CombotsRanking.csv")
    #getHolderTable("COMBIENS-", "CombiensHolder.csv", "CombiensRanking.csv")
    getHRITable("CombeyHolder.csv", "CombotsHolder.csv")
    #getHRITable("CombeyHolder.csv", "CombotsHolder.csv", "CombiensHolder.csv")

