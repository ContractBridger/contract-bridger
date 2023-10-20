import express from "express";
import axios from "axios";
import {
  pullContractDetailFromSourceChain,
  compileContract,
} from "./util/util"; // Import your utility functions
const routes = express.Router();

// Dummy data for demonstration purposes.
const smartContracts = [
  { name: "Contract1", address: "0x123456789" },
  { name: "Contract2", address: "0x987654321" },
];

// Endpoint to pull smart contracts
routes.post("/smart-contracts", async (req, res) => {
  try {
    // Fetch smart contract details using the utility function
    const etherscanAPIKey = process.env.ETHERSCAN_API_KEY;
    const contractDetails = await Promise.all(
      smartContracts.map(async (contract) => {
        return pullContractDetailFromSourceChain(
          contract.address,
          etherscanAPIKey,
        );
      }),
    );

    res.json({ success: true, smartContracts: contractDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to compile bytecode
routes.post("/compile-bytecode", async (req, res) => {
  try {
    const { contractName, sourceCode } = req.body;

    // Compile the contract using the utility function
    const bytecode = await compileContract(contractName, sourceCode);

    res.json({ success: true, bytecode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default routes;
