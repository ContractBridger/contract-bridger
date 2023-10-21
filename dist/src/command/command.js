"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const program = new commander_1.Command();
program
    .command("pull_deploy_to_another_chain")
    .alias("pull-deploy")
    .action(function () {
    inquirer_1.default
        .prompt([
        {
            name: "contractAddress",
            message: "contract address from source chain?",
        },
        {
            name: "constructorArgs",
            message: "constructor Args, if any else just press enter?",
            default: "",
        },
        {
            name: "sourceNetworkRpc",
            message: "rpc of source network?",
        },
        {
            name: "destinationNetworkRpc",
            message: "rpc of destination network?",
        },
        {
            name: "pKey",
            message: "private key of signer?",
        },
    ])
        .then((answers) => {
        //TODO- function call from index.js
    });
});
program.parse(process.argv);
