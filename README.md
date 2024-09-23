# 🥪 Supersub 

## What are Supersubs?  🥪

**Supersubs** is a decentralized subscription model that enhances the traditional subscription experience by allowing payments to flow continuously (per second) and grow in value over time. Users subscribe to **Substations**, which are content feeds categorized into tiers, and as they pay more, they unlock more exclusive content. The longer a user subscribes, the more valuable their **Supersub** becomes, and since Supersubs are ERC-721 tokens (NFTs), they can be traded on secondary markets like Opensea.

## Key Features

- **Continuous Payments**: Subscribers make gas-free, per-second payments instead of fixed monthly charges.
- **Tiered Access**: The more you pay, the higher the tier you reach, unlocking more exclusive content.
- **Tradable Subscriptions**: Supersubs are NFTs, meaning they can be traded or sold, with the value increasing as subscriptions mature.
- **Secure Content**: Content on the platform is encrypted and accessible only to those who meet on-chain conditions.
- **Decentralized Storage**: Content is stored using IPFS, providing decentralized, secure, and updatable content delivery.
- **Superfluid Protocol**: The backbone of the payment system, ensuring smooth flow of funds and tier tracking.

## Technologies Used

1. **Smart Contracts**:
   - Built on the **Superfluid Protocol**, the contracts handle real-time flow payments, tier management, and Supersub tracking.
   - Contracts are deployed on **Polygon** for scalability and low transaction fees.

2. **IPFS with web3.storage**:
   - Content is stored on IPFS using web3.storage, ensuring a decentralized and immutable data storage.
   - The Substations are linked to content via `w3name`, which enables updating content without modifying the contract.

3. **Lit Protocol**:
   - Used for encrypting and decrypting content based on on-chain conditions.
   - Manages key-based encryption to ensure only eligible users can access specific tiers and substations.

4. **Frontend**:
   - Built using **Next.js**, **Typescript**, and **React**.
   - Tailored with **TailwindCSS** and **Headless UI** for styling and UI/UX improvements.

## How it Works

1. **Create a Substation**: A substation is a content feed where the creator can post text, images, videos, or files. Each substation is categorized into tiers, offering different levels of access to content.

2. **Subscribing to a Substation**:
   - Users subscribe by issuing a **Supersub**, which tracks the amount paid and unlocks tier-based access.
   - Payment flows continuously, with higher payments unlocking more exclusive content.
   - Users can pause subscriptions anytime, and the tier level remains locked on their Supersub NFT.

3. **Accessing Content**:
   - Data is encrypted using Lit Protocol, with access only granted to users who meet specific on-chain conditions.
   - For example, users need a tier-2 Supersub to view tier-2 content.

4. **Trading Supersubs**:
   - Supersubs are ERC-721 tokens, meaning users can trade or sell their subscriptions on platforms like Opensea.
   - A highly valuable Supersub (e.g., with years of payment history) can be sold at a premium price.


### Usage

1. **Create a Substation**: Navigate to the “Create Substation” page, fill out the necessary fields, and deploy your Substation.

2. **Subscribe to a Substation**: Explore available Substations and choose one to subscribe to. As you pay, you'll progress through the content tiers.

3. **Access Tiered Content**: Once subscribed, visit the Substation feed and decrypt content based on your Supersub tier.

4. **Pause/Resume Subscription**: You can pause your subscription anytime. When resumed, you'll continue where you left off.

5. **Trade Supersubs**: Visit a marketplace like Opensea to list or trade your Supersub NFT.

## Additional Information

### Gasless Transactions

- Supersubs utilize **Superfluid** to offer continuous payments without gas fees, making them efficient and cost-effective.

### Content Security

- All data is encrypted using **Lit Protocol** and stored on IPFS, ensuring privacy and security. Only eligible users with active Supersubs can decrypt and view content.


## How to run the DEMO 🏃‍♀️

1. install your dependencies

   ```bash
   yarn install
   ```

2. Generate Contract Types 
   ```bash
   yarn generate
   yarn compile
   ```

3. run the app

   ```bash
   yarn start
   ```
