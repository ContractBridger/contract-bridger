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
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils"); // Import your utility functions
const routes = express_1.default.Router();
// Endpoint to pull smart contracts
routes.post("/pull-contract", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, networkId } = req.body;
    try {
        // Fetch smart contract details using the utility function
        // const etherscanAPIKey = process.env.ETHERSCAN_API_KEY;
        const contractDetails = yield (0, utils_1.pullContractDetailFromSourceChain)(address, Number(networkId));
        res.status(200).json(contractDetails);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: (error === null || error === void 0 ? void 0 : error.message) || "error fetching contract",
        });
    }
}));
// Endpoint to compile bytecode
routes.post("/compile-contract", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractName, sourceCode } = req.body;
        // Compile the contract using the utility function
        const bytecode = yield (0, utils_1.compileContract)(contractName, sourceCode);
        res.json({ success: true, bytecode });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || "error compiling contract",
        });
    }
}));
exports.default = routes;
