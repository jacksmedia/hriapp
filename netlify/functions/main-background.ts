import axios from 'axios';
import Papa from 'papaparse';
import * as fs from 'fs';

interface HolderData {
  'Token identifier': string;
  Nonce: number;
  Rank: number;
  Owner: string;
}

interface RankData {
  NFTID: string;
  RANK: number;
}

const MAXPACKETSIZE = 100;

async function getHolderTable(collectionID: string, filename: string, rankDataFile: string) {
  const header = ['Token identifier', 'Nonce', 'Rank', 'Owner'];
  const holderData: HolderData[] = [];
  const rankData = Papa.parse(fs.readFileSync(rankDataFile, 'utf-8'), { header: true }).data as RankData[];

  try {
    const { data: collectionCount } = await axios.get(`https://api.multiversx.com/collections/${collectionID}/nfts/count`);
    console.log('Collection count:', collectionCount);

    let fromNFT = 0;
    let j = 0;
    let parsedCollection: any[]; // moving outside of try block

    for (let i = 0; i < collectionCount; i++) {
      if (j === MAXPACKETSIZE || i === 0) {
        if (i) {
          fromNFT += MAXPACKETSIZE;
        }
        j = 0;
        try {
          const { data } = await axios.get(
            `https://api.multiversx.com/collections/${collectionID}/nfts?from=${fromNFT}&size=${MAXPACKETSIZE}&withOwner=true`
          );
          parsedCollection = data as any[]; // assigns to higher scoped var now, rm ref error
          console.log(typeof parsedCollection);
        } catch (err) {
          console.error('Error:', err);
          break;
        }
      }

      // let parsedCollection = data as any[];

      if ('owner' in parsedCollection[j]) {
        ownerAddress = parsedCollection[j]['owner'];
      } else {
        ownerAddress = 'No Data';
      }

      const extractRowRank = rankData.find((row) => row.NFTID === parsedCollection[j]['identifier']);
      const rank = extractRowRank ? extractRowRank.RANK : 0;

      const row: HolderData = {
        'Token identifier': parsedCollection[j]['identifier'],
        Nonce: parsedCollection[j]['nonce'],
        Rank: rank,
        Owner: ownerAddress,
      };

      console.log(row);
      holderData.push(row);
      j++;
    }

    const csvData = Papa.unparse(holderData, { header: true });
    fs.writeFileSync(filename, csvData);
  } catch (error) {
    console.error('Error:', error);
  }
}

function getHRITable(combeyHolderFile: string, combotsHolderFile: string) {
  const header = ['Owner', 'HRI'];
  const holderHRITable: { Owner: string; HRI: number }[] = [];

  const combeys = Papa.parse(fs.readFileSync(combeyHolderFile, 'utf-8'), { header: true }).data as HolderData[];
  const combots = Papa.parse(fs.readFileSync(combotsHolderFile, 'utf-8'), { header: true }).data as HolderData[];

  const combeysOwner = combeys.map((item) => item.Owner);
  const combotsOwner = combots.map((item) => item.Owner);
  const owners = [...new Set([...combeysOwner, ...combotsOwner])]; // Combine both arrays and remove duplicates

  for (const owner of owners) {
    const combeysData = combeys.filter((item) => item.Owner === owner);
    const combotsData = combots.filter((item) => item.Owner === owner);
    const combeysSum = combeysData.length;
    const combotsSum = combotsData.length;
    const combeysRankMean = combeysData.reduce((sum, item) => sum + item.Rank, 0) / combeysSum;
    const combotsRankMean = combotsData.reduce((sum, item) => sum + item.Rank, 0) / combotsSum;

    let combeysHRI = 50;
    if (combeysSum > 0) {
      combeysHRI = combeysRankMean / (2 * combeysSum);
      if (combeysSum < 10) {
        combeysHRI += 10 - combeysSum;
      }
    }

    let combotsHRI = 50;
    if (combotsSum > 0) {
      combotsHRI = combotsRankMean / (2 * combotsSum);
      if (combotsSum < 10) {
        combotsHRI += 10 - combotsSum;
      }
    }

    const HRI = (combeysHRI + combotsHRI) / 2;
    if (owner !== 'No Data') {
      holderHRITable.push({ Owner: owner, HRI: HRI });
      //console.log(owner + ', ' + HRI);
    }
  }

  const csvData = Papa.unparse(holderHRITable, { header: true });
  fs.writeFileSync('HolderHRI.csv', csvData);
  console.log('Created Holder HRI document');

  const jsonData = JSON.stringify(holderHRITable);
  fs.writeFileSync('./src/components/ListJSON/data.json', jsonData);
  console.log('Created updated holder data in component');
}

getHolderTable('COMBEYS-bc640d', 'CombeyHolder.csv', 'CombeysRanking.csv');
getHolderTable('COMBOTS-aa4150', 'CombotsHolder.csv', 'CombotsRanking.csv');
getHRITable('CombeyHolder.csv', 'CombotsHolder.csv'); // , "CombiensHolder.csv")
