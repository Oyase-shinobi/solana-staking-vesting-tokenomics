import { PublicKey } from "@solana/web3.js";

import {
  VEST_PROGRAM_ID,
  RS_PREFIX,
  RS_VAULT_SEED,
  RS_VEST_SEED,
  RS_VESTINFO_SEED,
  SWRD_TOKEN_MINT,
} from "../contracts/constantsNFTVesting";

/** Get NFT Vesting Account Keys  */

export const getPoolKey = async () => {
  const [poolKey] = await asyncGetPda(
    [Buffer.from(RS_PREFIX)],
    VEST_PROGRAM_ID
  );
  return poolKey;
};

export const getRewardVaultKey = async () => {
  const [rewardVaultKey] = await asyncGetPda(
    [Buffer.from(RS_VAULT_SEED), SWRD_TOKEN_MINT.toBuffer()],
    VEST_PROGRAM_ID
  );
  return rewardVaultKey;
};

export const getVestedNFTKey = async (nftMintPk) => {
  const [vestedNftKey] = await asyncGetPda(
    [Buffer.from(RS_VEST_SEED), nftMintPk.toBuffer()],
    VEST_PROGRAM_ID
  );
  return vestedNftKey;
};

export const getVestInfoKey = async (nftMintPk) => {
  const [vestedNftKey] = await asyncGetPda(
    [Buffer.from(RS_VESTINFO_SEED), nftMintPk.toBuffer()],
    VEST_PROGRAM_ID
  );
  return vestedNftKey;
};

const asyncGetPda = async (seeds, programId) => {
  const [pubKey, bump] = await PublicKey.findProgramAddress(seeds, programId);
  return [pubKey, bump];
};
