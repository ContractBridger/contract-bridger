import axios from "axios";
const solc = require("solc");
const fs = require("fs");

require("dotenv").config();

export async function pullContractDetailFromSourceChain(
  contractAddress: string,
  chainId: number,
): Promise<
  | {
      contractName: string;
      compilerVersion: any;
      optimizationUsed: any;
      runs: any;
      sourceCode: any;
    }
  | "SOURCE_CODE_NOT_FOUND"
> {
  let chainExplorerString: string = "";
  let apikey: any = "";

  //mainnet
  if (chainId == 1) {
    chainExplorerString = "api.etherscan.io";
    apikey = process.env.ETHERSCAN_API_KEY;
  }
  // sepolia
  else if (chainId == 11155111) {
    chainExplorerString = "api-sepolia.etherscan.io";
    apikey = process.env.ETHERSCAN_API_KEY;
  }

  // goerli
  else if (chainId == 5) {
    chainExplorerString = "api-goerli.etherscan.io";
    apikey = process.env.ETHERSCAN_API_KEY;
  }

  // bsc
  else if (chainId == 56) {
    chainExplorerString = "api.bscscan.com";
    apikey = process.env.BSC_API_KEY;
  }

  // bsc testnet
  else if (chainId == 97) {
    chainExplorerString = "api-testnet.bscscan.com";
    apikey = process.env.BSC_API_KEY;
  } else if (chainId == 137) {
    //polygon
    chainExplorerString = "api.polygonscan.com";
    apikey = process.env.POLYGON_API_KEY;
  }

  const res = await axios.get(
    "https://" +
      chainExplorerString +
      "/api?module=contract&action=getsourcecode&address=" +
      contractAddress +
      "&apikey=" +
      apikey,
  );

  const dataResponse = res.data.result[0];

  if (dataResponse.ABI === "Contract source code not verified") {
    return "SOURCE_CODE_NOT_FOUND";
  }

  const sourceCode: any = dataResponse.SourceCode;
  const contractName: string = dataResponse.ContractName;
  const compilerVersion: any = dataResponse.compilerVersion;
  const optimizationUsed: any = dataResponse.OptimizationUsed;
  const runs: any = dataResponse.Runs;

  return {
    contractName,
    compilerVersion,
    optimizationUsed,
    runs,
    sourceCode,
  };
}

export async function compileContract(
  contractName: string,
  sourceCode: any,
): Promise<any> {
  let byteCodeAfterCompilation;
  const hasLicenseIdentifier = sourceCode.search("SPDX-License-Identifier");
  let fixedCode;

  if (hasLicenseIdentifier === -1) {
    fixedCode = "// SPDX-License-Identifier: MIT\n".concat(sourceCode);
  } else {
    fixedCode = sourceCode;
  }

  const input = {
    language: "Solidity",
    sources: {
      [contractName + ".sol"]: {
        content: fixedCode,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  //   //compile contract
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  console.log("res: ", output);

  byteCodeAfterCompilation =
    output.contracts[contractName + ".sol"][contractName].evm.bytecode.object;

  const ABI = output.contracts[contractName + ".sol"][contractName].abi;

  return { bytecode: byteCodeAfterCompilation, ABI };
}

export async function verifyContract(
  contractAddress: string,
  contractName: string,
  chainId: number,
  optimizationUsed: string,
  sourceCode: any,
  compilerVersion: any,
  codeformat: any,
) {
  let chainExplorerString: string = "";
  let apikey: any = "";

  //mainnet
  if (chainId == 1) {
    chainExplorerString = "api.etherscan.io";
    apikey = process.env.ETHERSCAN_API_KEY;
  }
  // sepolia
  else if (chainId == 11155111) {
    chainExplorerString = "api-sepolia.etherscan.io";
    apikey = process.env.ETHERSCAN_API_KEY;
  }

  // goerli
  else if (chainId == 5) {
    chainExplorerString = "api-goerli.etherscan.io";
    apikey = process.env.ETHERSCAN_API_KEY;
  }

  // bsc
  else if (chainId == 56) {
    chainExplorerString = "api.bscscan.com";
    apikey = process.env.BSC_API_KEY;
  }

  // bsc testnet
  else if (chainId == 97) {
    chainExplorerString = "api-testnet.bscscan.com";
    apikey = process.env.BSC_API_KEY;
  } else if (chainId == 137) {
    //polygon
    chainExplorerString = "api.polygonscan.com";
    apikey = process.env.POLYGON_API_KEY;
  }

  console.log("Attempting to verify contracts");

  const url = "https://" + chainExplorerString + "/api";
  const data = new URLSearchParams();
  data.append("module", "contract");
  data.append("action", "verifysourcecode");
  data.append("address", contractAddress);
  data.append("contractname", contractName);

  // use 0 for no optimization, and 1 if optimization was used
  data.append("optimizationUsed", optimizationUsed);
  data.append("apikey", apikey);
  data.append("sourceCode", sourceCode);
  data.append("compilerversion", compilerVersion);
  // solidity-single-file by default, or solidity-standard-json-input
  data.append("codeformat", codeformat);

  try {
    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Handle the response here.
    console.log("Verification Response:", res.data);
  } catch (error) {
    console.error("Error while verifying contract:", error);
  }
}
