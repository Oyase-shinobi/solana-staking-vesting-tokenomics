use crate::{constants::*, error::*, states::*};
use anchor_lang::prelude::*;
use std::mem::size_of;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [GLOBAL_STATE_SEED],
        bump,
        payer = authority,
        space = 8 + size_of::<GlobalState>()
    )]
    pub global_state: Box<Account<'info, GlobalState>>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> Initialize<'info> {
    pub fn validate(&self) -> Result<()> {
        if self.global_state.is_initialized == 1 {
            require_keys_eq!(
                self.global_state.authority,
                self.authority.key(),
                StakingError::NotAllowedAuthority
            )
        }
        Ok(())
    }
}

/// Initialize Staking Program for the first time
/// to init global state with some data for validation
///
#[access_control(ctx.accounts.validate())]
pub fn handler(ctx: Context<Initialize>, new_authority: Pubkey, nft_creator: Pubkey) -> Result<()> {
    let accts = ctx.accounts;
    accts.global_state.is_initialized = 1;
    accts.global_state.authority = new_authority;
    accts.global_state.nft_creator = nft_creator;
    Ok(())
}
