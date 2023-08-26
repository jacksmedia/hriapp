# Kyeto & xJ4cks
# Reads MultiversX blockchain & writes calculations
# based upon owership of the following collections:
# COMBEYS-bc640d 
# COMBOTS-aa4150 
# soon -- COMBIENS-xxxxxx
# 2023Q2 MIT License

import requests
import pandas as pd
import json

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
                    break
                except requests.exceptions.ConnectionError as errc:
                    print("Error Connecting:", errc)
                    break
                except requests.exceptions.Timeout as errt:
                    print("Timeout Error:", errt)
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

        holderData.to_csv(filename, index=False)

    else:
        print("HTTP error :"+ str(data.status_code))
        print(data.text)


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
            if combeysSum < 10:
                combeysHRI += 10 - combeysSum
        else:
            combeysHRI = 50

        if combotsSum > 0:
            combotsHRI = combotsRankMean/(2*combotsSum)
            if combotsSum < 10:
                combotsHRI += 10 - combotsSum
        else:
            combotsHRI = 50

        HRI = (combeysHRI + combotsHRI)/2
        if owner != "No Data":
            holderHRITable.loc[len(holderHRITable)] = [str(owner), float(HRI)]
            #print(str(owner) + ", " + str(HRI))


    # writes calculations to spreadsheet in this dir
    holderHRITable.to_csv('HolderHRI.csv', index=False)
    # writes calculations to the component that builds the list on the website
    jsonTable = holderHRITable.to_json(orient='records')
    file = open('./src/components/ListJSON/data.json', 'w')
    file.write(jsonTable)
    file.close()
    file = open('./netlify/functions/data.json', 'w')
    file.write(jsonTable)
    file.close()

if __name__ == '__main__':

    getHolderTable("COMBEYS-bc640d", "~/hriapp/CombeyHolder.csv", "~/hriapp/CombeysRanking.csv")
    getHolderTable("COMBOTS-aa4150", "~/hriapp/CombotsHolder.csv", "~/hriapp/CombotsRanking.csv")
    #getHolderTable("COMBIENS-fa4177", "CombiensHolder.csv", "CombiensRanking.csv")
    getHRITable("~/hriapp/CombeyHolder.csv", "~/hriapp/CombotsHolder.csv") # , "CombiensHolder.csv")
