const axios = require('axios');
const solc = require('solc');
const fs = require('fs');
require("dotenv").config();

async function pullContractDetailFromSourceChain(contractAddress, etherscanAPIKey) {
  const res = await axios.get(`https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${etherscanAPIKey}`);
  
  const dataResponse = res.data.result[0];
  const sourceCode = dataResponse.SourceCode;
  const contractName = dataResponse.ContractName;
  const compilerVersion = dataResponse.compilerVersion;
  const optimizationUsed = dataResponse.OptimizationUsed;
  const runs = dataResponse.Runs;

  return { contractName, compilerVersion, optimizationUsed, runs, sourceCode };
}

async function compileContract(contractName, sourceCode) {
  let byteCodeAfterCompilation;
  await fs.promises.writeFile(`${contractName}.sol`, sourceCode);
  console.log('File is created successfully.');  

  const source = await fs.promises.readFile(`./${contractName}.sol`, 'UTF-8');

  const input = {
    language: 'Solidity',
    sources: {
      [`${contractName}.sol`]: {
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

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  byteCodeAfterCompilation = output.contracts['NADO.sol'].NADO.evm.bytecode.object;
  console.log(byteCodeAfterCompilation, "testing again");
  
  return byteCodeAfterCompilation;
}

module.exports = {
  pullContractDetailFromSourceChain,
  compileContract
};
