# contract-bridger
## Introduction

Contract-Brigder Tool is a developer utility that simplifies the process of migrating a smart contract from one blockchain to another. This tool allows you to "seamlessly transfer" a deployed contract from one chain to another, saving you time and effort of searching for contract repo, dependencies and compilation issues


## How It works:

 The tool uses the contract address and chainId of source chain(where the contract is currently deployed on) to retrieve needed smart contract info, which is then re-compiled for new deployment to destination chain

 ## Run server locally

To get started, follow these installation steps:

### Prerequisites

- Node.js and npm installed on your system


```bash
git clone git@github.com:ContractBridger/contract-bridger.git

cd contract-bridger

git checkout develop

npm install 'to install dependencies'

npm run dev 'to run server locally'
```

## License

This tool is open-source

