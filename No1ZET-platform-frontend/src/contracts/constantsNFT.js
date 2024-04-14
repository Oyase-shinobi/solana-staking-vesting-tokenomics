import { PublicKey } from "@solana/web3.js";

/** GLOBAL CONSTANT */

export const Networks = {
  MAINNET: 101,
  DEVNET: 102,
};
// export const DEFAULT_NETWORK = Networks.MAINNET;
export const DEFAULT_NETWORK = Networks.DEVNET;
export const IS_MAINNET = DEFAULT_NETWORK == Networks.MAINNET;
export const NETWORK = IS_MAINNET ? "mainnet-beta" : "devnet";
// export const MAINNET_RPC = "https://api.metaplex.solana.com";
// rpc: "https://api.metaplex.solana.com", "https://api.mainnet-beta.solana.com", "https://solana-api.projectserum.com"
export const MAINNET_RPC = "https://api.metaplex.solana.com";

export const SECONDS_PER_DAY = 24 * 60 * 60;

export const RS_PREFIX = "rs-nft-staking";
export const RS_STAKEINFO_SEED = "rs-stake-info";
export const RS_STAKE_SEED = "rs-nft-staking";
export const RS_VAULT_SEED = "rs-vault";

// export const CLASS_TYPES = [65, 50, 43, 35, 27, 14, 9, 7, 4];
export const CLASS_TYPES = [195, 150, 129, 105, 81, 42, 27, 21, 12];

export const LOCK_DAY = 20;
export const TOKEN_DECIMALS = 9;

/** NFT Staking Constant */

export const SWRD_TOKEN_MINT = new PublicKey(
  IS_MAINNET
    ? "HfjcaeUcHWAvXQMeu3siSz2BL93u1LEvCTNRzHqxFrSx"
    : "HfjcaeUcHWAvXQMeu3siSz2BL93u1LEvCTNRzHqxFrSx"
);

export const NFT_CREATOR = new PublicKey(
  IS_MAINNET
    ? "65svGd174ZdoYpTzJRwoKrfuPR7oBNTT5PmkRmTphp2P"
    : "65svGd174ZdoYpTzJRwoKrfuPR7oBNTT5PmkRmTphp2P"
);

export const PROGRAM_ID = new PublicKey(
  IS_MAINNET
    ? "JDzbHczWqyyxu5cxx3XDJ5TuwFEjAQsUdVa41uJoiFXC"
    : "JDzbHczWqyyxu5cxx3XDJ5TuwFEjAQsUdVa41uJoiFXC"
);

export const INITIALIZER = new PublicKey(
  IS_MAINNET
    ? "65svGd174ZdoYpTzJRwoKrfuPR7oBNTT5PmkRmTphp2P"
    : "65svGd174ZdoYpTzJRwoKrfuPR7oBNTT5PmkRmTphp2P"
);

