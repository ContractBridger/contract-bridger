import axios from 'axios';



const solc = require('solc');
const fs = require('fs');

require("dotenv").config();


export async function pullContractDetailFromSourceChain(contractAddress: string, etherscanAPIKey: string): Promise< {contractName: string, compilerVersion: any, optimizationUsed: any, runs: any,sourceCode: any}>{
  const res = await axios.get('https://api.etherscan.io/api?module=contract&action=getsourcecode&address='+contractAddress+'&apikey='+etherscanAPIKey);
 
  const dataResponse = res.data.result[0];
  const sourceCode : any = dataResponse.SourceCode
  const contractName : string = dataResponse.ContractName
  const compilerVersion : any= dataResponse.compilerVersion
  const optimizationUsed : any= dataResponse.OptimizationUsed 
  const runs: any = dataResponse.Runs


  return { contractName, compilerVersion, optimizationUsed, runs, sourceCode}

   
 };

 
export async function compileContract(contractName: string, sourceCode:any ): Promise<any>{
    await fs.writeFile(contractName+'.sol', sourceCode, async function (err:any) {
        if (err) throw err;
        console.log('File is created successfully.');
    
    
        // //create source file from solc to compile
         const source = await fs.readFileSync('./'+contractName+'.sol', 'UTF-8');
       
    
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
          }
    
        //   //compile contract
         const output = JSON.parse(solc.compile(JSON.stringify(input)))
         const byteCodeAfterCompilation = output.contracts['NADO.sol'].NADO.evm.bytecode.object

         return byteCodeAfterCompilation       
})}




