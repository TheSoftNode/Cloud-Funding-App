# Crowd Funding Campaign

**Crowd Funding Campaign** is a decentralized platform built to help bring creative projects to life. Whether it's building a car from scratch, saving nature, creating a hope village, or starting a restaurant business, this platform enables people to launch their projects and receive funding in cryptocurrencies from supporters worldwide.

## Key Features
- **Campaign Creation**: Users can start a new campaign by clicking the "Create a Campaign" button.
- **Browse Campaigns**: A homepage lists all existing campaigns, displaying key details like funding progress, days left, and the number of contributors.
- **Profile Page**: Each user has a profile page displaying all their active campaigns.
- **Campaign Details**: Click on any campaign to see its description, the creator, the project story, and a list of donors. Contributors can also make donations in STX cryptocurrency through a funding field, with support for MetaMask notifications for payment.

## Tech Stack
- **Smart Contracts**: Written in Clarity (deployed on the Stacks blockchain).
- **Frontend**: Built using React and styled with Tailwind CSS.
- **Bundler**: Vite is used for fast builds and development.
- **Crypto Payments**: Contributions are made using STX tokens on the Stacks blockchain.

## Features Overview
- **Home Page**: Lists all campaigns with essential details.
- **Campaign Creation**: Allows users to set a title, description, funding target, deadline, and upload images.
- **Campaign Details**: View each campaign’s progress, number of supporters, and the project’s story. A “Fund Campaign” button enables users to donate STX.
- **Profile Page**: Displays all active campaigns created by the user.

## How to Run the Project

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the React Client**:
   ```bash
   npm run dev
   ```

3. **Deploy the Clarity Contract**:
   Use the Stacks CLI to deploy the Clarity contract.

4. **Build**:
   ```bash
   npm run build
   ```

## Smart Contract: Clarity Overview
### 1. Clone the Repository
```bash
git clone <repository-url>
cd crowd_funding_campaign
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the React Client
```bash
npm run dev
```

### 4. Build the Project
```bash
npm run build
```

## Guide to Get Clarity Running

### 1. Install Stacks CLI
To work with Clarity, install the Stacks CLI:
```bash
npm install -g @stacks/cli
```

### 2. Write Your Clarity Contract
Create a `.clar` file (e.g., `crowdfunding.clar`) for your Clarity contract in the root directory of your project.

### 3. Deploy the Clarity Contract
To deploy your contract, use the Stacks CLI:
```bash
stx contract deploy <contract-file> <contract-name> --network <network> --sender <private-key>
```
Replace `<contract-file>`, `<contract-name>`, `<network>`, and `<private-key>` with your own values.

### 4. Run Tests (Optional)
Before deploying, run tests on your Clarity contract using:
```bash
stacks test <contract-file>
```

For more detailed Clarity setup, visit the [Stacks Documentation](https://docs.stacks.co/).

The contract, written in Clarity, enables secure campaign creation and donations. Each campaign tracks the owner, title, description, funding goal, deadline, and donations. Users can donate STX tokens to support their favorite projects.

## Smart Contract Methods
- **create-campaign**: Allows users to start a campaign with parameters like title, description, target amount, and deadline.
- **donate**: Enables users to contribute STX tokens to campaigns.

## Contribution

Feel free to fork and submit pull requests. Any feedback or issue reports are welcome!