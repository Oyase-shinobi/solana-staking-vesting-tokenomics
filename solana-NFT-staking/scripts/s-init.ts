import * as anchor from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import {
  PublicKey,
  Keypair,
  Connection, 
  clusterApiUrl,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from "@solana/web3.js";

import bs58 from 'bs58';
import { IDL } from "../target/types/nft_staking";

const connection = new Connection(clusterApiUrl("devnet"));

const PROGRAM_ID = new PublicKey("89ChBjYeC4sM7GWRzvSoEZkDapFBiDNrxxT5PkM6uevN")
const VERIFIED_NFT_CREATOR = new PublicKey("HwnHVTCHJG4R1uc8HZodiYJzru5C5foqqVipdVoDuv7o");

// 36gJMRpN2dTyYegNBtTa5RvndhWr7vPL91E7hV5zcQKA
const admin = anchor.web3.Keypair.fromSecretKey(bs58.decode("3EFsWUQQuU32XaTrvhQGaYqUhWJiPayWA64CrU7f6cU7Jdbbm77tJE2y89DfByuFavp8X3jwAxuG4oxbDhYXcHJG"));
let provider = new anchor.Provider(connection, new NodeWallet(admin), anchor.Provider.defaultOptions())
const program = new anchor.Program(IDL, PROGRAM_ID, provider);

export const getGlobalStateKey = async () => {
  const [globalStateKey] = await PublicKey.findProgramAddress(
    [Buffer.from("GLOBAL_STATE_SEED")],
    PROGRAM_ID
  );
  return globalStateKey;
};

const init = async () => {
  
  const globalStateKey = await getGlobalStateKey();

  const txHash = await program.methods
    .initialize(admin.publicKey, VERIFIED_NFT_CREATOR)
    .accounts({
      authority: admin.publicKey,
      globalState: globalStateKey,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .signers([admin])
    .rpc();
  console.log(txHash);
}

init();