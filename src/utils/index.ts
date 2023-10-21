import axios from "axios";

const solc = require("solc");
const fs = require("fs");

require("dotenv").config();

export async function pullContractDetailFromSourceChain(
    contractAddress: string,
    chainId: number
): Promise<{
    contractName: string;
    compilerVersion: any;
    optimizationUsed: any;
    runs: any;
    sourceCode: any;
}> {
    let chainExplorerString: string = "";
    let apikey: any = "";

    //mainnet
    if (chainId == 1) {
        chainExplorerString = "api.etherscan.io";
        apikey = process.env.ETHERSCAN_API_KEY;

        //bsc
    } else if (chainId == 56) {
        chainExplorerString = "api.bscscan.com";
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
            apikey
    );
    // console.log(res, "res in func", apikey);
    const dataResponse = res.data.result[0];
    console.log(dataResponse);

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
    sourceCode: any
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

    console.log("aaaaa: ", output.contracts);
    console.log(
        "zzzzz: ",
        output.contracts[contractName + ".sol"][contractName]
    );

    byteCodeAfterCompilation =
        output.contracts[contractName + ".sol"][contractName].evm.bytecode
            .object;

    const ABI = output.contracts[contractName + ".sol"][contractName].abi;

    return { bytecode: byteCodeAfterCompilation, ABI };
}
