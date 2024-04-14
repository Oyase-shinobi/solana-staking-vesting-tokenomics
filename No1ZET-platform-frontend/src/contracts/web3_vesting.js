import BN from "bn.js";
import { toast } from "react-toastify";

import * as anchor from "@project-serum/anchor";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from "@solana/web3.js";

import * as Constants from "./constants";
import * as constantsVesting from "./constantsVesting";
import * as keys_vesting from "./keys_vesting";
import { VESTING_IDL } from "./vesting";

// const [startTime, setStartTime] = useState(0);
// const [endTime, setEndTime] = useState(0);
// const [buyAmount, setBuyAmount] = useState(0);
// const [totalBuyAmount, setTotalBuyAmount] = useState(0);

const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/qR88bjAxFf_021F7-qAP_Q74-v-KMcCZ");//clusterApiUrl("devnet")

export const getVestingProgram = (wallet) => {
  let provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    VESTING_IDL,
    constantsVesting.PROGRAM_ID,
    provider
  );
  return program;
};

export const createVestingState = async (wallet, tokenMint) => {
  if (wallet.publicKey === null) throw new WalletNotConnectedError();

  const program = getVestingProgram(wallet);

  const tokenPerSecond = 1; // todo
  const state = await keys_vesting.getGlobalStateKey();

  let rewardVault = await keys_vesting.getAssociatedTokenAccount(
    state,
    tokenMint
  );

  const tx = new Transaction().add(
    await program.methods
      .createState(new BN(tokenPerSecond))
      .accounts({
        authority: wallet.publicKey, // token owner
        state: state, //
        rewardVault: rewardVault,
        rewardMint: tokenMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
};

export const createVestingPool = async (wallet, tokenMint) => {
  const program = getVestingProgram(wallet);

  // Todo
  const point = new BN(1);
  const multipler = new BN(1);
  const state = await keys_vesting.getGlobalStateKey();
  const pool = await keys_vesting.getPoolKey(tokenMint);
  const stakeVault = await keys_vesting.getAssociatedTokenAccount(
    pool,
    tokenMint
  );

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
      .remainingAccounts(
        pools.map((p) => ({
          pubkey: p.publicKey,
          isWritable: true,
          isSigner: false,
        }))
      )
      .instruction()
  );
  return await send(connection, wallet, tx);
};

export const vest = async (wallet, amount, tokenMint, referral) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  if (parseFloat(amount) <= 0 || amount === "") {
    showToast("Enter Correct Amount!", 5000, 1);
    return null;
  }

  // getIsAdmin(wallet)

  const program = getVestingProgram(wallet);
  const tx = new Transaction();

  const state = await keys_vesting.getGlobalStateKey();
  const pool = await keys_vesting.getPoolKey(tokenMint);
  const poolVault = await keys_vesting.getAssociatedTokenAccount(
    pool,
    tokenMint
  );
  const user = await keys_vesting.getUserKey(pool, wallet.publicKey);
  const userVault = await keys_vesting.getAssociatedTokenAccount(
    wallet.publicKey,
    tokenMint
  );

  const rewardVault = await keys_vesting.getAssociatedTokenAccount(
    state,
    tokenMint
  );

  const vestingAmount = convertToDecimal(amount);

  let referralKey = new PublicKey(referral);
  const referralUser = await keys_vesting.getUserKey(pool, referralKey);
  let r = await keys_vesting.getUserKey(pool, referralKey);
  if (referralUser == user.toBase58()) {
    referralKey = constantsVesting.TREASURY;
    r = await keys_vesting.getUserKey(pool, constantsVesting.TREASURY);
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

          // referral: referralKey,
          // referralUser: r,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction()
    );
  }

  tx.add(
    await program.methods
      .vest(vestingAmount)
      .accounts({
        user: user,
        state: state,
        pool: pool,
        authority: wallet.publicKey,
        mint: tokenMint,
        poolVault: poolVault,
        userVault: userVault,
        rewardVault: rewardVault,
        referral: referralKey,
        referralUser: r,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .instruction()
  );

  return await send(connection, wallet, tx);
};

export const unvest = async (wallet, amount, tokenMint, referral) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  if (parseFloat(amount) <= 0 || amount === "") {
    showToast("Enter Correct Amount!", 5000, 1);
    return null;
  }

  const program = getVestingProgram(wallet);
  const tx = new Transaction();

  const state = await keys_vesting.getGlobalStateKey();
  const pool = await keys_vesting.getPoolKey(tokenMint);
  const poolVault = await keys_vesting.getAssociatedTokenAccount(
    pool,
    tokenMint
  );
  const user = await keys_vesting.getUserKey(pool, wallet.publicKey);
  const userVault = await keys_vesting.getAssociatedTokenAccount(
    wallet.publicKey,
    tokenMint
  );

  const rewardVault = await keys_vesting.getAssociatedTokenAccount(
    state,
    tokenMint
  );

  const unvestingAmount = convertToDecimal(amount);

  let referralKey = new PublicKey(referral);
  const referralUser = await keys_vesting.getUserKey(pool, referralKey);
  let r = await keys_vesting.getUserKey(pool, referralKey);
  if (referralUser == user.toBase58()) {
    referralKey = constantsVesting.TREASURY;
    r = await keys_vesting.getUserKey(pool, constantsVesting.TREASURY);
  }

  tx.add(
    await program.methods
      .unvest()
      .accounts({
        user: user,
        state: state,
        pool: pool,
        authority: wallet.publicKey,
        mint: tokenMint,
        poolVault: poolVault,
        userVault: userVault,
        rewardVault: rewardVault,
        referral: referralKey,
        referralUser: r,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
};

export const claim_vesting = async (wallet, tokenMint) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  const program = getVestingProgram(wallet);

  const state = await keys_vesting.getGlobalStateKey();
  const pool = await keys_vesting.getPoolKey(tokenMint);
  const user = await keys_vesting.getUserKey(pool, wallet.publicKey);
  const userVault = await keys_vesting.getAssociatedTokenAccount(
    wallet.publicKey,
    tokenMint
  );
  const rewardVault = await keys_vesting.getAssociatedTokenAccount(
    state,
    tokenMint
  );

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
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .instruction()
  );

  return await send(connection, wallet, tx);
};

export const fundVestingReward = async (wallet, amount, tokenMint) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    showToast("Connect Wallet!", 5000, 1);
    return null;
  }

  if (parseFloat(amount) <= 0 || amount === "") {
    showToast("Enter Correct Amount!", 5000, 1);
    return null;
  }

  const program = getVestingProgram(wallet);

  const state = await keys_vesting.getGlobalStateKey();
  const userVault = await keys_vesting.getAssociatedTokenAccount(
    wallet.publicKey,
    tokenMint
  );
  const rewardVault = await keys_vesting.getAssociatedTokenAccount(
    state,
    tokenMint
  );

  const fundAmount = convertToDecimal(amount);

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
  );

  return await send(connection, wallet, tx);
};

export const getPoolPoint = async (wallet, tokenMint) => {
  try {
    const program = getProgram(wallet);
    const poolKey = await keys.getPoolKey(tokenMint);

    const pool = await program.account.farmPoolAccount.fetch(poolKey);
    return pool.point.toNumber();
  } catch (e) {
    return 0;
  }
};

async function getTokenBalanceWeb3(vault) {
  try {
    const info = await connection.getTokenAccountBalance(vault);

    if (!info.value.uiAmount) throw new Error("No balance found");
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
  return await getTokenBalanceWeb3(poolVault);
}

export async function getMyVestedAndReward(wallet, tokenMint) {
  try {
    const program = getVestingProgram(wallet);
    const pool = await keys_vesting.getPoolKey(tokenMint);
    const user = await keys_vesting.getUserKey(pool, wallet.publicKey);
    const userAccount = await program.account.farmPoolUserAccount.fetch(user);

    const currentTime = new Date();
    const unixTimestamp = Math.floor(currentTime.getTime() / 1000);
    const reward_amount_t =
      userAccount.extraReward.toNumber() +
      (userAccount.amount.toNumber() *
        (unixTimestamp - userAccount.lastVestTime)) /
        (365 * 24 * 3600) /
        2; // 1/2 means 50%
    const amount = convertFromDecimal(userAccount.amount.toNumber());
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
    if (res.value.err) showToast("Transaction Failed", 2000, 0);
    else showToast("Transaction Confirmed", 2000);
  } else {
    showToast("Transaction Failed", 2000, 0);
  }
  return txHash;
}

export async function sendTransaction(connection, wallet, transaction) {
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

    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      preflightCommitment: "processed",
    });
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
    const accInfo = await connection.getAccountInfo(state);

    if (accInfo) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
  return false;
};

export const getIsAdmin = async (wallet) => {
  try {
    const program = getVestingProgram(wallet);
    const state = await program.account.stateAccount.all();
    const acc = state[0].account.authority;

    if (wallet.publicKey.toString() === acc.toString()) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
};

export const getIsPoolInitialized = async (tokenMint) => {
  try {
    const pool = await keys.getPoolKey(tokenMint);
    if (await connection.getAccountInfo(pool)) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const getTokenFromType = (heading) => {
  switch (heading) {
    case "FRENS":
      return Constants.Z01ZET;
    case "pFRENS":
      return Constants.pFRENS;
    case "FRENS-USDC":
      return Constants.FRENS_USDC;
    case "FRENS-USDT":
      return Constants.FRENS_USDT;
  }
};

export const convertToDecimal = (amount) => {
  const integerStringValue = (
    parseFloat(amount) *
    10 ** Constants.Z01ZET_DECIMALS
  ).toFixed(0);
  const stakingAmount = new BN(integerStringValue);
  return stakingAmount;
};

export const convertFromDecimal = (amount) => {
  return amount / 10 ** Constants.Z01ZET_DECIMALS;
};
