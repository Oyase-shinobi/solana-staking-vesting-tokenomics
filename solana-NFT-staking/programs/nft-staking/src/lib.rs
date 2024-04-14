use anchor_lang::prelude::*;

declare_id!("89ChBjYeC4sM7GWRzvSoEZkDapFBiDNrxxT5PkM6uevN");

/// constant
pub mod constants;
/// error
pub mod error;
/// instructions
pub mod instructions;
/// states
pub mod states;
/// utilities
pub mod utils;

use crate::instructions::*;

#[program]
pub mod nft_staking {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        new_authority: Pubkey,
        nft_creator: Pubkey,
    ) -> Result<()> {
        initialize::handler(ctx, new_authority, nft_creator)
    }

    pub fn init_user_state(ctx: Context<InitUserState>, user_key: Pubkey) -> Result<()> {
        init_user_state::handler(ctx, user_key)
    }

    pub fn stake_nft(ctx: Context<StakeNft>, hash_arr: [u8; 32], nft_type: u8) -> Result<()> {
        stake_nft::handler(ctx, hash_arr, nft_type)
    }

    pub fn unstake_nft(ctx: Context<UnstakeNft>) -> Result<()> {
        unstake_nft::handler(ctx)
    }
}
