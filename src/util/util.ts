import axios from 'axios';



const solc = require('solc');
const fs = require('fs');

require("dotenv").config();


async function pullContractDetailFromSourceChain(contractAddress: string, etherscanAPIKey: string){
  const res = await axios.get('https://api.etherscan.io/api?module=contract&action=getsourcecode&address='+contractAddress+'&apikey='+etherscanAPIKey);
 
  const dataResponse = res.data.result[0];
  const sourceCode = dataResponse.SourceCode
  const contractName = dataResponse.ContractName
  const compilerVersion= dataResponse.compilerVersion
  const optimizationUsed= dataResponse.OptimizationUsed 
  const runs = dataResponse.Runs
  

   // writeFile function with filename, content and callback function
fs.writeFile(contractName+'.sol', sourceCode, async function (err:any) {
    if (err) throw err;
    console.log('File is created successfully.');


    // //create source file from solc to compile
     const source = fs.readFileSync('./'+contractName+'.sol', 'UTF-8');
   

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

    //   //compile contract
     const output = JSON.parse(solc.compile(JSON.stringify(input)));
     const byteCodeAfterCompilation = output.contracts['NADO.sol'].NADO.evm.bytecode.object
    // // console.log('deleting file after use')
    // fs.unlinkSync('./contract.sol');

   // TODO: define return params
   
 });

 

    
}

pullContractDetailFromSourceChain('0xbba6a5ed8cEEEeD88cC1Ce9ad80faE28659F9085', process.env.ETHERSCAN_API_KEY as string)


