"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileContract = exports.pullContractDetailFromSourceChain = void 0;
const axios_1 = __importDefault(require("axios"));
const solc = require("solc");
const fs = require("fs");
require("dotenv").config();
function pullContractDetailFromSourceChain(contractAddress, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        let chainExplorerString = "";
        let apikey = "";
        //mainnet
        if (chainId == 1) {
            chainExplorerString = "api.etherscan.io";
            apikey = process.env.ETHERSCAN_API_KEY;
            //bsc
        }
        else if (chainId == 56) {
            chainExplorerString = "api.bscscan.com";
            apikey = process.env.BSC_API_KEY;
        }
        else if (chainId == 137) {
            //polygon
            chainExplorerString = "api.polygonscan.com";
            apikey = process.env.POLYGON_API_KEY;
        }
        const res = yield axios_1.default.get("https://" +
            chainExplorerString +
            "/api?module=contract&action=getsourcecode&address=" +
            contractAddress +
            "&apikey=" +
            apikey);
        // console.log(res, "res in func", apikey);
        const dataResponse = res.data.result[0];
        console.log(dataResponse);
        const sourceCode = dataResponse.SourceCode;
        const contractName = dataResponse.ContractName;
        const compilerVersion = dataResponse.compilerVersion;
        const optimizationUsed = dataResponse.OptimizationUsed;
        const runs = dataResponse.Runs;
        return {
            contractName,
            compilerVersion,
            optimizationUsed,
            runs,
            sourceCode,
        };
    });
}
exports.pullContractDetailFromSourceChain = pullContractDetailFromSourceChain;
function compileContract(contractName, sourceCode) {
    return __awaiter(this, void 0, void 0, function* () {
        let byteCodeAfterCompilation;
        const hasLicenseIdentifier = sourceCode.search("SPDX-License-Identifier");
        let fixedCode;
        console.log("hasLicenseIdentifier: ", hasLicenseIdentifier);
        if (hasLicenseIdentifier === -1) {
            fixedCode = "// SPDX-License-Identifier: MIT\n".concat(sourceCode);
        }
        else {
            fixedCode = sourceCode;
        }
        yield fs.writeFile(contractName + ".sol", fixedCode, function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err)
                    throw err;
                console.log("File is created successfully.");
                // //create source file from solc to compile
                const source = yield fs.readFileSync("./" + contractName + ".sol", "UTF-8");
                const input = {
                    language: "Solidity",
                    sources: {
                        [contractName + ".sol"]: {
                            content: source,
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
                console.log(output);
                byteCodeAfterCompilation =
                    output.contracts["NADO.sol"].NADO.evm.bytecode.object;
                console.log(byteCodeAfterCompilation, "testing again");
            });
        });
        return byteCodeAfterCompilation;
    });
}
exports.compileContract = compileContract;
