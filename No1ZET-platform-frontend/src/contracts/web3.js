import * as anchor from "@project-serum/anchor";
import {
  PROGRAM_ID,
  TREASURY,
  Z01ZET,
  Z01ZET_DECIMALS
} from './constants'
import { IDL } from "./staking";
import { toast } from "react-toastify";
import * as keys from "./keys";
import BN from "bn.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  PublicKey,
  Connection,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  Keypair,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
} from "@solana/web3.js";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  getAccount,
} from "@solana/spl-token";

export const SOLANA_HOST = "https://solana-devnet.g.alchemy.com/v2/qR88bjAxFf_021F7-qAP_Q74-v-KMcCZ";//clusterApiUrl("devnet");//clusterApiUrl("devnet");//

const connection = new Connection(SOLANA_HOST);

export const getProgram = (wallet) => {
  let provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(IDL, PROGRAM_ID, provider);
  return program;
};

export const createGlobalState = async (wallet) => {

  console.log("wallet.publicKey", wallet.publicKey);
  if (wallet.publicKey === null) throw new WalletNotConnectedError();

  const program = getProgram(wallet);
  const globalStateKey = await keys.getGlobalStateKey();

  console.log("createGlobalState globalState", globalStateKey.toString());
  console.log("methods", program.methods);

  const tx = new Transaction().add(
    await program.methods
      .createGlobalState()
      .accounts({
        authority: wallet.publicKey,
        globalState: globalStateKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
}

export const updateGlobalState = async (wallet, newAuthority) => {

  console.log("wallet.publicKey", wallet.publicKey);
  if (wallet.publicKey === null) throw new WalletNotConnectedError();

  const program = getProgram(wallet);
  const globalStateKey = await keys.getGlobalStateKey();
  const poolKey = await keys.getPoolKey(UFO);

  const tx = new Transaction().add(
    await program.methods
      .updateAuthority(new PublicKey(newAuthority))
      .accounts({
        authority: wallet.publicKey,
        globalState: globalStateKey,
        pool: poolKey,
        rent: SYSVAR_RENT_PUBKEY
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
}

export const createPoolState = async (wallet, tokenMint, stakingAPY, referralFee, withdrawFee) => {

  const program = getProgram(wallet);

  // Todo
  const stateKey = await keys.getGlobalStateKey();
  const pool = await keys.getPoolKey(tokenMint);
  const stakeVault = await keys.getAssociatedTokenAccount(pool, tokenMint);

  console.log("tokenMint", tokenMint.toString());
  console.log("stakingAPY", stakingAPY);
  console.log("referralFee", referralFee);
  console.log("withdrawFee", withdrawFee);

  const tx = new Transaction().add(
    await program.methods
      .createPool(new BN(stakingAPY), new BN(referralFee), new BN(withdrawFee))
      .accounts({
        authority: wallet.publicKey,
        pool: pool,
        globalState: stateKey,
        mint: tokenMint,
        vault: stakeVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .instruction()
  )
  return await send(connection, wallet, tx);
}

export const updatePoolState = async (wallet, tokenMint, stakingAPY, referralFee, withdrawFee) => {

  const program = getProgram(wallet);

  // Todo
  const stateKey = await keys.getGlobalStateKey();
  const pool = await keys.getPoolKey(tokenMint);
  const stakeVault = await keys.getAssociatedTokenAccount(pool, tokenMint);

  console.log("tokenMint", tokenMint.toString());
  console.log("stakingAPY", stakingAPY);
  console.log("referralFee", referralFee);
  console.log("withdrawFee", withdrawFee);

  const tx = new Transaction().add(
    await program.methods
      .updatePool(new BN(stakingAPY), new BN(referralFee), new BN(withdrawFee))
      .accounts({
        authority: wallet.publicKey,
        pool: pool,
        globalState: stateKey,
        mint: tokenMint,
        vault: stakeVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
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

  console.log("wallet: ", wallet.publicKey.toString());
  console.log("tokenMint: ", tokenMint.toString());
  console.log("referral: ", referral);
  console.log("amount: ", amount);

  const program = getProgram(wallet);
  const tx = new Transaction();

  const statekey = await keys.getGlobalStateKey();
  const poolKey = await keys.getPoolKey(tokenMint);
  const poolVault = await keys.getAssociatedTokenAccount(poolKey, tokenMint);
  const user = await keys.getUserKey(poolKey, wallet.publicKey);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, tokenMint);
  const stakingAmount = convertToDecimal(amount);

  
  let referralKey = new PublicKey(referral);
  let referralUser = await keys.getUserKey(poolKey, referralKey);

  if (referralKey.toString() === wallet.publicKey.toString()) {
    referralKey = TREASURY;
    console.log("referralKey", referralKey.toString());
    referralUser = await keys.getUserKey(poolKey, TREASURY);
  }
  

  // Check if user exists
  if (!(await connection.getAccountInfo(user))) {
    tx.add(
      await program.methods
        .createUser()
        .accounts({
          authority: wallet.publicKey,
          user: user,
          userKey: wallet.publicKey,
          globalState: statekey,
          pool: poolKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    )
  }

  if (!(await connection.getAccountInfo(referralUser))) {
    tx.add(
      await program.methods
        .createUser()
        .accounts({
          authority: wallet.publicKey,
          user: referralUser,
          userKey: referralKey,
          globalState: statekey,
          pool: poolKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    )
  }

  tx.add(
    await program.methods
      .stake(stakingAmount)
      .accounts({
        authority: wallet.publicKey,
        user: user,
        globalState: statekey,
        pool: poolKey,
        mint: tokenMint,
        poolVault: poolVault,
        userVault: userVault,
        referral: referralKey,
        treasury: TREASURY,
        referralUser: referralUser,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY
      })
      .instruction()
  );

  return await send(connection, wallet, tx);

}

export const unstake = async (wallet, tokenMint) => {

  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  console.log("wallet: ", wallet.publicKey.toString());
  console.log("tokenMint: ", tokenMint.toString());
  // console.log("referral: ", referral);
  // console.log("amount: ", amount);

  const program = getProgram(wallet);
  const tx = new Transaction();

  const statekey = await keys.getGlobalStateKey();
  const poolKey = await keys.getPoolKey(tokenMint);
  const poolVault = await keys.getAssociatedTokenAccount(poolKey, tokenMint);
  const user = await keys.getUserKey(poolKey, wallet.publicKey);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, tokenMint);
  const treasuryValut = await keys.getAssociatedTokenAccount(TREASURY, tokenMint);
  
  tx.add(
    await program.methods
      .unstake()
      .accounts({
        authority: wallet.publicKey,
        user: user,
        globalState: statekey,
        pool: poolKey,
        mint: tokenMint,
        poolVault: poolVault,
        userVault: userVault,
        treasury: treasuryValut,
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

  const stateKey = await keys.getGlobalStateKey();
  const poolKey = await keys.getPoolKey(tokenMint);
  const user = await keys.getUserKey(poolKey, wallet.publicKey);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, tokenMint);
  const rewardVault = await keys.getAssociatedTokenAccount(poolKey, tokenMint);
  const treasuryValut = await keys.getAssociatedTokenAccount(ADMINWALLET, tokenMint);

  const tx = new Transaction();

  tx.add(
    await program.methods
      .claim()
      .accounts({
        authority: wallet.publicKey,
        user: user,
        globalState: stateKey,
        pool: poolKey,
        mint: tokenMint,
        poolVault: rewardVault,
        treasury: treasuryValut,
        userVault: userVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}

export const claimToken = async (wallet, amount, tokenMint) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }
  console.log("amount: ", amount);
  console.log("tokenMint: ", tokenMint.toString());
  const program = getProgram(wallet);

  const stateKey = await keys.getGlobalStateKey();
  const poolKey = await keys.getPoolKey(tokenMint);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, tokenMint);
  const rewardVault = await keys.getAssociatedTokenAccount(poolKey, tokenMint);
  const claimAmount = convertToDecimal(amount)
  const tx = new Transaction();

  tx.add(
    await program.methods
      .claimRewardToken(claimAmount)
      .accounts({
        authority: wallet.publicKey,
        globalState: stateKey,
        pool: poolKey,
        mint: tokenMint,
        rewardVault: rewardVault,
        userVault: userVault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}

export const compound = async (wallet, tokenMint) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  const program = getProgram(wallet);

  const statekey = await keys.getGlobalStateKey();
  const poolKey = await keys.getPoolKey(tokenMint);
  const poolVault = await keys.getAssociatedTokenAccount(poolKey, tokenMint);
  const user = await keys.getUserKey(poolKey, wallet.publicKey);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, tokenMint);
  const treasuryValut = await keys.getAssociatedTokenAccount(ADMINWALLET, tokenMint);

  const tx = new Transaction().add(
    await program.methods
      .compound()
      .accounts({
        authority: wallet.publicKey,
        user: user,
        globalState: statekey,
        pool: poolKey,
        mint: tokenMint,
        poolVault: poolVault,
        userVault: userVault,
        treasury: treasuryValut,
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

  console.log("amount: ", amount);
  console.log("tokenMint: ", tokenMint.toString());

  const program = getProgram(wallet);

  const stateKey = await keys.getGlobalStateKey();
  const poolKey = await keys.getPoolKey(tokenMint);
  const userVault = await keys.getAssociatedTokenAccount(wallet.publicKey, tokenMint);
  const rewardVault = await keys.getAssociatedTokenAccount(poolKey, tokenMint);

  const fundAmount = convertToDecimal(amount)

  const tx = new Transaction().add(
    await program.methods
      .depositRewardToken(fundAmount)
      .accounts({
        authority: wallet.publicKey,
        globalState: stateKey,
        pool: poolKey,
        mint: tokenMint,
        rewardVault: rewardVault,
        userVault: userVault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction()
  )

  return await send(connection, wallet, tx);
}


export async function getTotalSuplyToken(tokenMint) {
  const total_supply_token = await connection.getTokenSupply(tokenMint);
  return total_supply_token.value.uiAmount;
}

export async function getTotalStaked(wallet, tokenMint) {
  const program = getProgram(wallet);
  const poolKey = await keys.getPoolKey(tokenMint);
  const poolInfo = await program.account.stakingPoolAccount.fetchNullable(poolKey);

  if( !poolInfo ){
    return "0";
  }
  console.log("poolInfo", convertFromDecimal(poolInfo.amount).toString());
  return convertFromDecimal(poolInfo.amount).toString();
}

export async function getMyStakedAndReward(wallet, tokenMint) {
  try {
    console.log("tokenMint: ", tokenMint.toString());
    const program = getProgram(wallet);
    const pool = await keys.getPoolKey(tokenMint);
    const user = await keys.getUserKey(pool, wallet.publicKey);
    const userAccount = await program.account.stakingPoolUserAccount.fetchNullable(user);
    console.log("userAccount.amount", userAccount.amount.toNumber());
    console.log("userAccount.authority", userAccount.authority.toBase58());
    console.log("userAccount.referalReward", userAccount.referalReward.toNumber());
    console.log("userAccount.lastStakeTime", userAccount.lastStakeTime.toString());
    console.log("userAccount.amount", userAccount.amount.toNumber());

    if( !userAccount ){
      console.log("user does not exist!!! ");
      return [0, 0, 0];
    }
    const amount = convertFromDecimal(userAccount.amount.toNumber());
    const referalReward = convertFromDecimal(userAccount.referalReward.toNumber());
    console.log("amount", amount);
    console.log("referalReward", referalReward);
    
    return [amount, referalReward, userAccount.lastStakeTime];

  } catch (e) {
    return [0, 0];
  }
}

export async function send(connection, wallet, transaction) {
  const txHash = await sendTransaction(connection, wallet, transaction);
  console.log("txHash: ", txHash);
  if (txHash != null) {
    let confirming_id = showToast("Confirming Transaction ...", -1, 2);
    try {
      let res = await connection.confirmTransaction(txHash, 'processed');
      toast.dismiss(confirming_id);
      if (res.value.err) showToast("Transaction Failed", 2000, 1);
      else showToast("Transaction Confirmed", 2000);
    } catch (e) {
      showToast("Transaction Failed", 2000, 1)
      console.log("send", e);
    }
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
    const txid = await connection.sendRawTransaction(
      rawTransaction,
      {
        skipPreflight: true,
        preflightCommitment: "processed",
      }
    );
    return txid;
  } catch (e) {
    console.log("sendTransaction", e);
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

export const getStateInitialized = async (wallet) => {
  try {
    const program = getProgram(wallet);
    const state = await keys.getGlobalStateKey();
    const accInfo = await program.account.globalState.all(state);

    if (accInfo) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export const getIsAdmin = async (wallet) => {
  try {
    const program = getProgram(wallet);
    const globalStateKey = await keys.getGlobalStateKey();
    const stateData = await program.account.globalState.all(globalStateKey);
    if (stateData === null) return false;
    if (wallet.publicKey.toString() === stateData.authority.toString()) {
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

export const getTokenFromType = () => {
  return Z01ZET;
}

export const getUfoPrice = async (tokenMint) => {
  return 0.0000002;
}

export const convertToDecimal = (amount) => {
  const integerStringValue = (parseFloat(amount) * 10 ** Z01ZET_DECIMALS).toFixed(0);
  const stakingAmount = new BN(integerStringValue);
  return stakingAmount;
}

export const convertFromDecimal = (amount) => {
  return amount / 10 ** Z01ZET_DECIMALS;
};


export const getStakingAPY = async (wallet) => {
  try {
    const program = getProgram(wallet);
    const poolKey = await keys.getPoolKey(Z01ZET);
    const stateData = await program.account.stakingPoolAccount.fetchNullable(poolKey);
    if (stateData === null) return 0;
    return stateData.apy;
  } catch (e) {
    return 0;
  }
}

export const getReferalFee = async (wallet) => {
  try {
    const program = getProgram(wallet);
    const poolKey = await keys.getPoolKey(Z01ZET);
    const stateData = await program.account.stakingPoolAccount.fetchNullable(poolKey);
    if (stateData === null) return 0;
    console.log("getReferalFee", stateData);
    return stateData.referalReward;
  } catch (e) {
    return 0;
  }
}

export const getWithdrawFee = async (wallet) => {
  try {
    const program = getProgram(wallet);
    const poolKey = await keys.getPoolKey(Z01ZET);
    const stateData = await program.account.stakingPoolAccount.fetchNullable(poolKey);
    console.log("getWithdrawFee", stateData.authority.toString());
    if (stateData === null) return 0;
    return stateData.fee;
  } catch (e) {
    return 0;
  }
}

export const createTokenAccount = async (wallet, mint) => {
  try {
    try {
      const associatedToken = getAssociatedTokenAddressSync(
        mint,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        )
      );

      return await send(connection, wallet, transaction);
    } catch (error) {
      // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
      // instruction error if the associated account exists already.
    }
  } catch (e) {
    return 0;
  }
}