import BN from "bn.js";
import { toast } from "react-toastify";

import * as anchor from "@project-serum/anchor";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import {
  amountToUiAmount,
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

import * as Constants from "./constantsToknomics";
import * as keys from "./key_tokenomics";
import { IDL } from "./tokenomics.ts"

const connection = new Connection(clusterApiUrl("devnet"));

export const getProgram = (wallet) => {
  let provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL,
    Constants.PROGRAM_ID,
    provider
  );
  return program;
};

export const distributeTokens = async (wallet, PartnerShips, ShareHolders, Private, Public, Reserve, Advisors, amount) => {

  if (wallet.publicKey === null) throw new WalletNotConnectedError();

  const program = getProgram(wallet);
  const distributeAmount = convertToDecimal(amount);
  const adminVault = await keys.getAssociatedTokenAccount(
    wallet.publicKey,
    Constants.TOKEN_MINT
  );

  const partnership = new PublicKey(PartnerShips);
  const partnershipVault = await keys.getAssociatedTokenAccount(
    new PublicKey(PartnerShips),
    Constants.TOKEN_MINT
  );

  const shareholders = new PublicKey(ShareHolders);

  const shareholdersVault = await keys.getAssociatedTokenAccount(
    new PublicKey(ShareHolders),
    Constants.TOKEN_MINT
  );
  
  const advisors = new PublicKey(Advisors);
  const advisorsVault = await keys.getAssociatedTokenAccount(
    new PublicKey(Advisors),
    Constants.TOKEN_MINT
  );

  const private_member = new PublicKey(Private);
  const privateVault = await keys.getAssociatedTokenAccount(
    new PublicKey(Private),
    Constants.TOKEN_MINT
  );

  const public_member = new PublicKey(Public);
  const publicVault = await keys.getAssociatedTokenAccount(
    new PublicKey(Public),
    Constants.TOKEN_MINT
  );

  const reserve = new PublicKey(Reserve);
  const reserveVault = await keys.getAssociatedTokenAccount(
    new PublicKey(Reserve),
    Constants.TOKEN_MINT
  );
  
  const tx = new Transaction().add(
    await program.methods
      .distributeTokens(
        distributeAmount,
        )
      .accounts({
        authority: wallet.publicKey,
        adminVault: adminVault,
        partnershipVault: partnershipVault, 
        shareholdersVault: shareholdersVault, 
        advisorsVault: advisorsVault,
        privateVault: privateVault,
        publicVault: publicVault,
        reserveVault: reserveVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
};


export async function send(connection, wallet, transaction) {
  const txHash = await sendTransaction(connection, wallet, transaction);
  console.log("txHash: ", txHash);
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

export const convertToDecimal = (amount) => {
  const integerStringValue = (
    parseFloat(amount) *
    10 ** Constants.TOKEN_DECIMALS
  ).toFixed(0);
  const stakingAmount = new BN(integerStringValue);
  return stakingAmount;
};

export const convertFromDecimal = (amount) => {
  return amount / 10 ** Constants.TOKEN_DECIMALS;
};
