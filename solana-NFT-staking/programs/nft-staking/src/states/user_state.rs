use crate::{constants::*, error::*};
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserState {
    pub user: Pubkey,
    pub potion_nfts: [Pubkey; 10],
    pub staked_time: [u64; 10],
    pub nft_types: [u8; 10],
    pub potion_counts: [u8; 4],
}
