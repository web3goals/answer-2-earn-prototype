import { ERC725 } from "@erc725/erc725.js";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { Hex, parseEther } from "viem";

describe("Question", function () {
  async function initFixture() {
    // Get public client
    const publicClient = await hre.viem.getPublicClient();

    // Get signers
    const [deployer, userOne, userTwo] = await hre.viem.getWalletClients();

    // Deploy contracts
    const questionContract = await hre.viem.deployContract("Question", []);

    return {
      publicClient,
      deployer,
      userOne,
      userTwo,
      questionContract,
    };
  }

  it("Should ask and answer a question", async function () {
    const { publicClient, userOne, userTwo, questionContract } =
      await loadFixture(initFixture);

    // Create a metadata object
    const metadata = {
      asker: "0x4018737e0D777b3d4C72B411a3BeEC286Ec5F5eF",
      question: "What’s your dream?",
      questionDate: 1746028080,
      answerer: "0x2EC3af24fB102909f31535Ef0d825c8BFb873aB2",
      answer: "",
      answerDate: 0,
    };
    const metadataUrl = "ipfs://empty";
    const schema = [
      {
        name: "LSP4Metadata",
        key: "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
        keyType: "Singleton",
        valueType: "bytes",
        valueContent: "VerifiableURI",
      },
    ];
    const erc725 = new ERC725(schema);
    const encodedMetadata = erc725.encodeData([
      {
        keyName: "LSP4Metadata",
        value: {
          json: metadata,
          url: metadataUrl,
        },
      },
    ]);
    const encodedMetadataValue = encodedMetadata.values[0] as Hex;

    // Ask question by user two
    await questionContract.write.ask(
      [userOne.account.address, encodedMetadataValue],
      {
        account: userTwo.account,
        value: parseEther("1"),
      }
    );

    // Get question token
    const tokens = await questionContract.read.tokenIdsOf([
      userOne.account.address,
    ]);
    const token = tokens[0];

    // Get question token metadata
    const tokenMetadataValue = await questionContract.read.getDataForTokenId([
      token,
      "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
    ]);
    const decodedTokenMetadata = erc725.decodeData([
      {
        keyName: "LSP4Metadata",
        value: tokenMetadataValue,
      },
    ]);

    // Check user balance before answering
    const userOneBalanceBefore = await publicClient.getBalance({
      address: userOne.account.address,
    });

    // Check reward before answering
    const rewardBefore = await questionContract.read.getReward([token]);
    expect(rewardBefore.value).to.equal(parseEther("1"));
    expect(rewardBefore.sent).to.equal(false);

    // Answer question
    await questionContract.write.answer([token, "0x0"], {
      account: userOne.account,
    });

    // Check reward after answering
    const rewardAfter = await questionContract.read.getReward([token]);
    expect(rewardAfter.value).to.equal(parseEther("1"));
    expect(rewardAfter.sent).to.equal(true);

    // Check user balance after answering
    const userOneBalanceAfter = await publicClient.getBalance({
      address: userOne.account.address,
    });

    // Check that the user's balance increased by the reward amount (minus gas costs)
    const balanceIncrease = userOneBalanceAfter - userOneBalanceBefore;
    const rewardAmount = parseEther("1");
    const allowableDifference = parseEther("0.01");
    expect(
      balanceIncrease >= rewardAmount - allowableDifference &&
        balanceIncrease <= rewardAmount + allowableDifference
    ).to.be.true;
  });
});
