import * as anchor from "@project-serum/anchor";
import * as Constants from "./constants";
import { NFT_STAKING_IDL } from "./nftstaking";
import { toast } from "react-toastify";
import * as keys from "./keys";
import BN from "bn.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { useState } from "react";
import {
  PublicKey,
  Connection,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  Keypair,
  SYSVAR_CLOCK_PUBKEY
} from "@solana/web3.js";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount
} from "@solana/spl-token"

const connection = new Connection(clusterApiUrl("devnet"));

export const getProgram = (wallet) => {
  let provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(NFT_STAKING_IDL, Constants.PROGRAM_ID, provider);
  return program;
};


export const createState = async (wallet, tokenMint) => {

  if (wallet.publicKey === null) throw new WalletNotConnectedError();

  const program = getProgram(wallet);

  const tokenPerSecond = 1;       // todo
  const state = await keys.getGlobalStateKey();
  

  let rewardVault = await keys.getAssociatedTokenAccount(state, tokenMint);
  
  const tx = new Transaction().add(
    await program.methods
      .createState(new BN(tokenPerSecond))
      .accounts({
        authority: wallet.publicKey,            // token owner
        state: state,  // 
        rewardVault: rewardVault,
        rewardMint: tokenMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .instruction()
  )
  return await send(connection, wallet, tx)
}

export const createPool = async (wallet, tokenMint) => {

  const program = getProgram(wallet);

  // Todo
  const point = new BN(1);
  const multipler = new BN(1);
  const state = await keys.getGlobalStateKey();
  const pool = await keys.getPoolKey(tokenMint);
  const stakeVault = await keys.getAssociatedTokenAccount(pool, tokenMint);

  const pools = await program.account.farmPoolAccount.all();

  const tx = new Transaction();

  tx.add(
    await program.methods
      .createPool(point, multipler)
      .accounts({
        pool: pool,
        state: state,
        mint: tokenMint,
        vault: stakeVault,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .remainingAccounts(pools.map(p => ({
        pubkey: p.publicKey,
        isWritable: true,
        isSigner: false
      })))
      .instruction()
  )
  return await send(connection, wallet, tx);
}

export const stake = async (wallet, amount, tokenMint, referral) => {

  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  if (parseFloat(amount) <= 0 || amount === '') {
    showToast("Enter Correct Amount!", 5000, 1);
    return null;
  }

  const program = getProgram(wallet);
  const tx = new Transaction();

  const state = await keys.getGlobalStateKey();
  const pool = await keys.getPoolKey(tokenMint);
  const poolVault = await keys.getAssociatedTokenAccount(pool, tokenMint);
  const user = await keys.getUserKey(pool, wallet.publicKey);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, tokenMint);

  const stakingAmount = convertToDecimal(amount)

  let referralKey = new PublicKey(referral);
  const referralUser = await keys.getUserKey(pool, referralKey);
  let r = await keys.getUserKey(pool, referralKey);
  if (referralUser == user.toBase58()) {
    referralKey = Constants.TREASURY;
    r = await keys.getUserKey(pool, Constants.TREASURY);
    console.log("referralKey: ", referralKey.toString());
  }

  // Check if user exists
  if (!(await connection.getAccountInfo(user))) {

    tx.add(
      await program.methods
        .createUser()
        .accounts({
          user: user,
          state: state,
          pool: pool,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction()
    )
  }

  tx.add(
    await program.methods
      .stake(stakingAmount)
      .accounts({
        user: user,
        state: state,
        pool: pool,
        authority: wallet.publicKey,
        mint: tokenMint,
        poolVault: poolVault,
        userVault: userVault,
        referral: referralKey,
        referralUser: r,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY
      })
      .instruction()
  );

  return await send(connection, wallet, tx);

}

export const unstake = async (wallet, amount, tokenMint, referral) => {

  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  if (parseFloat(amount) <= 0 || amount === '') {
    showToast("Enter Correct Amount!", 5000, 1);
    return null;
  }

  const program = getProgram(wallet);
  const tx = new Transaction();

  const state = await keys.getGlobalStateKey();
  const pool = await keys.getPoolKey(tokenMint);
  const poolVault = await keys.getAssociatedTokenAccount(pool, tokenMint);
  const user = await keys.getUserKey(pool, wallet.publicKey);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, tokenMint);
  const unstakingAmount = convertToDecimal(amount)

  let referralKey = new PublicKey(referral);
  const referralUser = await keys.getUserKey(pool, referralKey);
  let r = await keys.getUserKey(pool, referralKey);
  if (referralUser == user.toBase58()) {
    referralKey = Constants.TREASURY;
    r = await keys.getUserKey(pool, Constants.TREASURY);
  }

  tx.add(
    await program.methods
      .unstake(unstakingAmount)
      .accounts({
        user: user,
        state: state,
        pool: pool,
        authority: wallet.publicKey,
        mint: tokenMint,
        poolVault: poolVault,
        userVault: userVault,
        referral: referralKey,
        referralUser: r,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY
      })
      .instruction()
  );
  return await send(connection, wallet, tx);

}

export const claim = async (wallet, tokenMint) => {

  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  const program = getProgram(wallet);

  const state = await keys.getGlobalStateKey();
  const pool = await keys.getPoolKey(tokenMint);
  const user = await keys.getUserKey(pool, wallet.publicKey);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, tokenMint);
  const rewardVault = await keys.getAssociatedTokenAccount(state, tokenMint);

  const tx = new Transaction();

  tx.add(
    await program.methods
      .harvest()
      .accounts({
        user: user,
        state: state,
        pool: pool,
        authority: wallet.publicKey,
        mint: tokenMint,
        rewardVault: rewardVault,
        userVault: userVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}

export const fundReward = async (wallet, amount, tokenMint) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  if (parseFloat(amount) <= 0 || amount === '') {
    showToast("Enter Correct Amount!", 5000, 1);
    return null;
  }

  const program = getProgram(wallet);

  const state = await keys.getGlobalStateKey();
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, tokenMint);
  const rewardVault = await keys.getAssociatedTokenAccount(state, tokenMint);

  const fundAmount = convertToDecimal(amount)

  const tx = new Transaction().add(
    await program.methods
      .fundRewardToken(fundAmount)
      .accounts({
        state: state,
        authority: wallet.publicKey,
        rewardVault: rewardVault,
        userVault: userVault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}

export const getPoolPoint = async (wallet, tokenMint) => {

  try {
    const program = getProgram(wallet);
    const poolKey = await keys.getPoolKey(tokenMint);

    const pool = await program.account.farmPoolAccount.fetch(poolKey);
    return pool.point.toNumber();
  } catch (e) {
    return 0;
  }

}

async function getTokenBalanceWeb3(vault) {

  try {
    const info = await connection.getTokenAccountBalance(vault);

    if (!info.value.uiAmount) throw new Error('No balance found');
    return info.value.uiAmount;
  } catch (e) {
    // console.log(e);
    return 0;
  }
}

export async function getTotalSuplyToken(tokenMint) {
  const total_supply_token = await connection.getTokenSupply(tokenMint);
  return total_supply_token.value.uiAmount;
}

export async function getTotalStaked(tokenMint) {
  const pool = await keys.getPoolKey(tokenMint);

  const poolVault = await keys.getAssociatedTokenAccount(pool, tokenMint);
  return await getTokenBalanceWeb3(poolVault)
}

export async function getMyStakedAndReward(wallet, tokenMint) {

  try {
    const program = getProgram(wallet);
    const pool = await keys.getPoolKey(tokenMint);
    const user = await keys.getUserKey(pool, wallet.publicKey);
    const userAccount = await program.account.farmPoolUserAccount.fetch(user);

    const currentTime = new Date();
    const unixTimestamp = Math.floor(currentTime.getTime() / 1000);
    const reward_amount_t = userAccount.extraReward.toNumber() + userAccount.amount.toNumber() * (unixTimestamp - userAccount.lastStakeTime) / (365 * 24 * 3600) / 2; // 1/2 means 50%
    const amount = convertFromDecimal(userAccount.amount.toNumber())
    const reward_amount = convertFromDecimal(reward_amount_t);
    let fixedNumber = reward_amount.toFixed(9);
    return [amount, fixedNumber];
  } catch (e) {
    return [0, 0];
  }
}

export async function send(connection, wallet, transaction) {
  const txHash = await sendTransaction(connection, wallet, transaction);
  if (txHash != null) {
    let confirming_id = showToast("Confirming Transaction ...", -1, 2);
    let res = await connection.confirmTransaction(txHash);
    toast.dismiss(confirming_id);
    if (res.value.err) showToast("Transaction Failed", 2000, 1);
    else showToast("Transaction Confirmed", 2000);
  } else {
    showToast("Transaction Failed", 2000, 1);
  }
  return txHash;
}

export async function sendTransaction(
  connection,
  wallet,
  transaction
) {
  if (wallet.publicKey === null || wallet.signTransaction === undefined)
    return null;
  try {
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.feePayer = wallet.publicKey;
    const signedTransaction = await wallet.signTransaction(transaction);
    const rawTransaction = signedTransaction.serialize();

    showToast("Sending Transaction ...", 500);
    // notify({
    //   message: "Transaction",
    //   description: "Sending Transaction ...",
    //   duration: 0.5,
    // });

    const txid = await connection.sendRawTransaction(
      rawTransaction,
      {
        skipPreflight: true,
        preflightCommitment: "processed",
      }
    );
    return txid;
  } catch (e) {
    
    return null;
  }
}

export const showToast = (txt, duration = 5000, ty = 0) => {
  let type = toast.TYPE.SUCCESS;
  if (ty === 1) type = toast.TYPE.ERROR;
  if (ty === 2) type = toast.TYPE.INFO;

  let autoClose = duration;
  if (duration < 0) {
    autoClose = false;
  }
  return toast.error(txt, {
    position: "bottom-right",
    autoClose,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    type,
    theme: "colored",
  });
};

export const getStateInitialized = async () => {
  try {

    const state = await keys.getGlobalStateKey();
    const accInfo = await connection.getAccountInfo(state)

    if (accInfo) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
  return false;
}

export const getIsAdmin = async (wallet) => {
  try {
    const program = getProgram(wallet);
    const state = await program.account.stateAccount.all();
    const acc = state[0].account.authority;

    if (wallet.publicKey.toString() === acc.toString()) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false
}

export const getIsPoolInitialized = async (tokenMint) => {
  try {
    const pool = await keys.getPoolKey(tokenMint)
    if (await connection.getAccountInfo(pool)) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export const getTokenFromType = (heading) => {
  switch (heading) {
    case "FRENS":
      return Constants.FRENS;
    case "pFRENS":
      return Constants.pFRENS;
    case "FRENS-USDC":
      return Constants.FRENS_USDC;
    case "FRENS-USDT":
      return Constants.FRENS_USDT;
  }
}

export const convertToDecimal = (amount) => {
  const integerStringValue = (parseFloat(amount) * 10 ** Constants.FRENS_DECIMALS).toFixed(0);
  const stakingAmount = new BN(integerStringValue);
  return stakingAmount
}

export const convertFromDecimal = (amount) => {
  return amount / (10 ** Constants.FRENS_DECIMALS)
}
