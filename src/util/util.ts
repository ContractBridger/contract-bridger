import axios from 'axios';
import fs from 'fs';
const solc = require('solc');

require("dotenv").config();


async function pullContractDetailFromSourceChain(contractAddress: string, etherscanAPIKey: string){
  const res = await axios.get('https://api.etherscan.io/api?module=contract&action=getsourcecode&address='+contractAddress+'&apikey='+etherscanAPIKey);
  console.log(JSON.stringify(res), "res")
  const sourceCode = res.data.result[0].SourceCode
  const contractName = res.data.result[0].ContractName

//   console.log(res.data.result[0], "checking")

    // writeFile function with filename, content and callback function
fs.writeFile(contractName+'.sol', sourceCode, async function (err:any) {
    if (err) throw err;
    console.log('File is created successfully.');


    //create source file from solc to compile
     const source = fs.readFileSync('./'+contractName+'.sol', 'UTF-8');


     const res = solc.compile(source, 1).contracts;
     console.log(res, "res")

     const input = {
        language: 'Solidity',
        sources: {
          [contractName+'.sol']: {
            content: source,
          },
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };

      //compile contract
     const output = JSON.parse(solc.compile(JSON.stringify(input)));
    // console.log(output.contracts, "output")
    // console.log('deleting file after use')
    fs.unlinkSync('./contract.sol');

    //TODO: define return params
   
  });

 

    
}

pullContractDetailFromSourceChain('0xbba6a5ed8cEEEeD88cC1Ce9ad80faE28659F9085', process.env.ETHERSCAN_API_KEY as string)


