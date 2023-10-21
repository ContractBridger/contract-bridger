import express from "express";
import { pullContractDetailFromSourceChain, compileContract } from "./utils"; // Import your utility functions
const routes = express.Router();

// Endpoint to pull smart contracts
routes.post("/pull-contract", async (req, res) => {
  const { address, networkId } = req.body;
  try {
    // Fetch smart contract details using the utility function
    // const etherscanAPIKey = process.env.ETHERSCAN_API_KEY;
    const contractDetails = await pullContractDetailFromSourceChain(
      address,
      Number(networkId),
    );

    res.status(200).json(contractDetails);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "error fetching contract",
    });
  }
});

// Endpoint to compile bytecode
routes.post("/compile-contract", async (req, res) => {
  try {
    const { contractName, sourceCode } = req.body;

    // Compile the contract using the utility function
    const { bytecode, ABI } = await compileContract(contractName, sourceCode);

    res.status(200).json({ bytecode, ABI });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "error compiling contract",
    });
  }
});

export default routes;
