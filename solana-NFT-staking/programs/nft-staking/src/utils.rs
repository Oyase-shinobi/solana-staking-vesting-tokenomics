use anchor_lang::{prelude::*, solana_program::hash::hash};
use crate::error::*;

pub fn total_potion_cnt(arr: &[u8]) -> u8 {
    let mut sum: u8 = 0;
    for i in 0..4 {
        sum += arr[i];
    }
    return sum;
}

pub fn verify_nft_type(nft_name: &str, expected_hash_key: [u8; 32], nft_type: u8) -> Result<()> {

  let hash_make_str = [
    "pr1mitv",
    "RVR3",
    "ZP1C",
    "LE9ndrC"
  ];
  if nft_type > 3 {
    return Err(StakingError::InvalidType.into());
  }
  
  let suffix_str = hash_make_str[nft_type as usize];

  let hash_str = nft_name.to_owned() + suffix_str;
  let type_hash = hash(&hash_str.as_bytes());
  if type_hash.to_bytes() != expected_hash_key {
      return Err(StakingError::InvalidType.into());
  }
  Ok(())
}