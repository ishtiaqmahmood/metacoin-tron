# MetaCoin TronBox Project

This is a TRON-based implementation of the classic MetaCoin example, updated for modern Solidity and TronBox.

## Overview

MetaCoin is a simple example of a custom token on the TRON network. It includes:
- `MetaCoin.sol`: The main contract for managing token balances and transfers.
- `ConvertLib.sol`: A library used by MetaCoin to convert token balances to an equivalent "ETH" value (multiplied by 2 for demonstration).
- A simple web frontend to interact with the contract.

## Prerequisites

- [Node.js](https://nodejs.org/) (v12 or later recommended)
- [TronBox](https://www.tronbox.io/) (`npm install -g tronbox`)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd metacoin-box
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The project is configured to work with the **Shasta Testnet** by default.

1. Create a `.env` file based on `sample-env`:
   ```bash
   cp sample-env .env
   ```
2. Update the `PRIVATE_KEY_SHASTA` in `.env` with your Shasta testnet private key.

## Deployment

To compile and deploy the contracts to the Shasta network:

```bash
npm run migrate
```

This command will:
1. Compile the Solidity contracts.
2. Deploy them to the Shasta testnet.
3. Update the frontend configuration in `src/js/metacoin-config.js`.

## Running the Web App

After deployment, you can start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Testing

To run the automated tests:

```bash
npm test
```

*Note: Tests may require a local Tron Quickstart node or specific account setup in `test/metacoin.js`.*

## Project Structure

- `contracts/`: Solidity smart contracts.
- `migrations/`: Deployment scripts.
- `src/`: Frontend web application.
- `test/`: JavaScript tests for the contracts.
- `tronbox.js`: TronBox configuration file.

## License

This project is licensed under the MIT License.
