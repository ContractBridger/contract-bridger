/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox")


module.exports = {
  solidity: "0.8.19",
  etherscan: {
    //TODO: make this dynamic
    apiKey: process.env.ETHERSCAN_API_KEY,
}
};
