![Cover](/Cover.png)

# ❓ Answer 2 Earn

Answer fan questions, earn LYX rewards — a LUKSO Mini-App with AI verification.

## ✨ Background

In the past, personal question and answer apps have been popular and viral. The largest one, ask.fm, had 50 million monthly active users. With the capabilities of Lukso and AI, this idea can be improved and achieve greater performance.

## 🛠️ How it works

The Mini-App facilitates a question-and-answer interaction between users (Askers and Answerers) on the LUKSO Testnet, leveraging Universal Profiles and smart contracts.

- **Setup (Answerer)**

  - The Answerer obtains the Mini-App link and integrates it into their Universal Profile grid.

- **Asking a Question (Asker)**

  - The Asker navigates to the Answerer's profile on Universal Everything.
  - Connects their Universal Profile to the Mini-App using `@up-provider`.
  - Submits a question including text and a selected reward amount (0.01, 0.05, or 0.1 LYX).
  - The backend generates LSP8 token metadata for the question using `erc725.js` and uploads it to Pinata IPFS.
  - An LSP8 token representing the question is minted via the `Question` smart contract on the LUKSO Testnet.

- **Answering a Question (Answerer)**

  - The Answerer accesses the Mini-App through their Universal Profile.
  - Connects their Universal Profile using `@up-provider`.
  - Views a list of unanswered questions, sortable by reward amount.
  - Selects and submits an answer to a chosen question.
  - An AI service (Gemini 2.5 Flash) verifies if the answer is relevant to the question.
  - If the answer is valid, the `Question` smart contract transfers the specified LYX reward to the Answerer's Universal Profile.

## 🔗 Artifacts

- Application - https://answer-2-earn.vercel.app/
- Demo - https://universaleverything.io/0xfcC5eC941E2C26FF618A8a975D9262Cd887d9c15?network=testnet
- Contracts (LUKSO Testnet):
  - Question - `0xf81abf7d2d09369cda771f4b432ef01e75576759`

## 🛠️ Technologies

- LSP8 standard is used for a contract that stores questions and sends rewards for answers.
- LUKSO Testnet is used as a blockchain for development and beta testing.
- Universal Profiles is used to make the app more social by displaying profile pictures and usernames.
- @up-provider is used as a tool to integrate the app with the LUKSO grid.
- erc725.js library is used to encode and decode profile and question metadata.
- Pinata IPFS is used to store metadata with questions and answers.
- Gemini AI is used to verify that answers match questions.

## 🔮 Plans

- Integrate oracle to use AI to verify answers in a more decentralized way.
- Add LUKSO UI components to make the app appearance more native.
- Implement anonymous questions.
- Add a referral program to engage users to share the app and attract their friends.
- Release on the mainnet.
- Collaborate with influencers to reach a big audience.

## 🏗️ Architecture

![Architecture](/Architecture.png)
