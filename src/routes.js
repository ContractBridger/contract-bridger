import express from 'express';
import { pullContractDetailFromSourceChain, compileContract } from './utils/index';
const routes = express.Router();

// Dummy data for demonstration purposes.
const smartContracts = [
  { name: 'Contract1', address: '0x123456789' },
  { name: 'Contract2', address: '0x987654321' },
];

routes.get('/smart-contracts', async (req, res) => {
  try {
    const contractAddress = req.query.contractAddress;

    if (!contractAddress) {
      return res.status(400).json({ success: false, message: 'Contract address is required' });
    }

    const etherscanAPIKey = process.env.ETHERSCAN_API_KEY;
    const contractDetails = await pullContractDetailFromSourceChain(contractAddress, etherscanAPIKey);

    res.json({ success: true, contractDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Endpoint to compile bytecode
routes.post('/compile-bytecode', async (req, res) => {
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