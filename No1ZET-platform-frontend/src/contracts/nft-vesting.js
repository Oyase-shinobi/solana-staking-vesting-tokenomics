import { isValidSolanaAddress } from "@nfteyez/sol-rayz";
import * as anchor from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";

import {
  CLASS_TYPES,
  LOCK_DAY,
  VEST_PROGRAM_ID,
  SECONDS_PER_DAY,
  SWRD_TOKEN_MINT,
} from "../contracts/constantsNFTVesting";
import {
  getPoolKey,
  getRewardVaultKey,
  getVestedNFTKey,
  getVestInfoKey,
} from "../contracts/keys_nftvesting";
import {
  getAssociatedTokenAccount,
  getMultipleTransactions,
  getNFTTokenAccount,
  getProvider,
  getTokenAccount,
  getVestingProgram,
  sendMultiTransactions,
} from "../contracts/utils";

export const vestingInitProject = async (wallet, connection) => {
  const program = getVestingProgram(wallet, connection);
  const poolkey = await getPoolKey();
  const RewordVaultKey = await getRewardVaultKey();

  const res = await program.methods
    .initializeVestingPool(CLASS_TYPES, LOCK_DAY)
    .accounts({
      admin: wallet.publicKey,
      poolAccount: poolkey,
      rewardMint: SWRD_TOKEN_MINT,
      rewardVault: RewordVaultKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();
};

export const vestNft = async (wallet, connection, selectedNftMint) => {
  const program = getVestingProgram(wallet, connection);
  const provider = await getProvider(wallet, connection);

  let instructions = [];
  for (let i = 0; i < selectedNftMint.length; i++) {
    const nftMintPk = new PublicKey(selectedNftMint[i]);
    let nftClass = 1;
    if (nftClass < 0) return;

    const poolkey = await getPoolKey();

    const ix = await program.methods
      .vestNft(nftClass)
      .accounts({
        owner: wallet.publicKey,
        poolAccount: await getPoolKey(),
        nftMint: nftMintPk,
        userNftTokenAccount: await getNFTTokenAccount(
          wallet,
          connection,
          nftMintPk
        ),
        destNftTokenAccount: await getVestedNFTKey(nftMintPk),
        nftVestInfoAccount: await getVestInfoKey(nftMintPk),
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();
    instructions.push(ix);
  }

  let instructionSet = await getMultipleTransactions(
    provider.connection,
    provider.wallet,
    instructions
  );
  let res = await sendMultiTransactions(
    provider.connection,
    provider.wallet,
    instructionSet
  );
  console.log("txHash =", res);
  return res;
};

export const unvestNft = async (wallet, connection, selectedNftMint) => {
  const program = getVestingProgram(wallet, connection);

  let instructions = [];
  for (let i = 0; i < selectedNftMint.length; i++) {
    const nftMintPk = new PublicKey(selectedNftMint[i]);

    let destAddr = await getTokenAccount(wallet, connection, nftMintPk);
    if (!destAddr) {
      destAddr = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        VEST_PROGRAM_ID,
        nftMintPk,
        wallet.publicKey
      );

      let txCreateSrc = Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        VEST_PROGRAM_ID,
        nftMintPk,
        destAddr,
        wallet.publicKey,
        wallet.publicKey
      );

      instructions.push(txCreateSrc);
    }

    const ix = await program.methods
      .withdrawNft()
      .accounts({
        owner: wallet.publicKey,
        poolAccount: await getPoolKey(),
        nftMint: nftMintPk,
        userNftTokenAccount: destAddr, // await getTokenAccount(wallet, connection, nftMintPk),
        vestedNftTokenAccount: await getVestedNFTKey(nftMintPk),
        nftVestInfoAccount: await getVestInfoKey(nftMintPk),
        rewardToAccount: await getAssociatedTokenAccount(
          wallet.publicKey,
          SWRD_TOKEN_MINT
        ),
        rewardVault: await getRewardVaultKey(),
        rewardMint: SWRD_TOKEN_MINT,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();
    instructions.push(ix);
  }

  let instructionSet = await getMultipleTransactions(
    connection,
    wallet,
    instructions
  );
  let res = await sendMultiTransactions(connection, wallet, instructionSet);
  console.log("txHash =", res);
  return res;
};

export const claimReward = async (wallet, connection, params) => {
  const program = getVestingProgram(wallet, connection);

  let instructions = [];
  for (let i = 0; i < params.length; i++) {
    const nftMintPk = new PublicKey(params[i].id);
    const ix = await program.methods
      .claimReward()
      .accounts({
        owner: wallet.publicKey,
        poolAccount: await getPoolKey(),
        nftVestInfoAccount: await getVestInfoKey(nftMintPk),
        rewardMint: SWRD_TOKEN_MINT,
        rewardVault: await getRewardVaultKey(),
        rewardToAccount: await getAssociatedTokenAccount(
          wallet.publicKey,
          SWRD_TOKEN_MINT
        ),
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        nftMint: nftMintPk,
      })
      .instruction();
    instructions.push(ix);
  }
  let instructionSet = await getMultipleTransactions(
    connection,
    wallet,
    instructions
  );
  let res = await sendMultiTransactions(connection, wallet, instructionSet);
  
  return res;
};

export const getClaimableReward = (params) => {
  let currentTimeStamp = new Date().getTime() / 1000;

  let reward = 0;
  params.map((item) => {
    reward +=
      (CLASS_TYPES[item.classId] * (currentTimeStamp - item.lastUpdateTime)) /
      SECONDS_PER_DAY /
      10;
  });
  if (reward < 0) reward = 0;

  return reward.toFixed(2);
};

export const getVestedInfo = async (wallet, connection) => {
  if (!isValidSolanaAddress(wallet.publicKey)) return [];
  const program = getVestingProgram(wallet, connection);

  const res = await program.account.vestInfo.all([
    {
      memcmp: {
        offset: 12,
        bytes: wallet.publicKey,
      },
    },
  ]);
  return res;
};

const getNftTokenId = async (tokenURI) => {
  return tokenURI?.properties?.edition || tokenURI?.edition;
};

const getNftClass = (tokenId) => {
  if (tokenId > 0 && tokenId <= 9) return 0;
  else if (tokenId > 9 && tokenId <= 150) return 1;
  else if (tokenId > 150 && tokenId <= 400) return 2;
  else if (tokenId > 400 && tokenId <= 700) return 3;
  else if (tokenId > 700 && tokenId <= 1100) return 4;
  else if (tokenId > 1100 && tokenId <= 1650) return 5;
  else if (tokenId > 1650 && tokenId <= 2350) return 6;
  else if (tokenId > 2350 && tokenId <= 3200) return 7;
  else if (tokenId > 3200) return 8;
  else return -1;
};

export const vestingDepositReWard = async (wallet, connection, amount) => {
  const program = getVestingProgram(wallet, connection);
  const poolkey = await getPoolKey();
  const RewordVaultKey = await getRewardVaultKey();
  const funder_vault_account = await getAssociatedTokenAccount(
    wallet.publicKey,
    SWRD_TOKEN_MINT
  );

  const res = await program.methods
    .depositSwrd(new anchor.BN(amount))
    .accounts({
      funder: wallet.publicKey,
      rewardVault: RewordVaultKey,
      funderAccount: funder_vault_account,
      poolAccount: poolkey,
      rewardMint: SWRD_TOKEN_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
};

