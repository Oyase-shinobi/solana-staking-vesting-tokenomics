use anchor_lang::prelude::*;

use crate::{constants::*, error::*, instructions::*, states::*, utils::*};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};
use mpl_token_metadata::{state::Metadata, ID as MetadataProgramID};

#[derive(Accounts)]
pub struct StakeNft<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump
    )]
    pub global_state: Box<Account<'info, GlobalState>>,

    #[account(
        mut,
        seeds = [USER_STATE_SEED, user.key().as_ref()],
        bump
    )]
    pub user_state: Account<'info, UserState>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = global_state,
    )]
    pub pool_nft_ata: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = user,
    )]
    pub user_nft_ata: Box<Account<'info, TokenAccount>>,

    pub nft_mint: Box<Account<'info, Mint>>,

    #[account(owner = MetadataProgramID)]
    /// CHECK:
    pub nft_metadata: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> StakeNft<'info> {
    fn validate(&self) -> Result<()> {
        // Verify Metadata Account Key
        let (metadata_key, _) = Pubkey::find_program_address(
            &[
                b"metadata".as_ref(),
                MetadataProgramID.as_ref(),
                self.nft_mint.key().as_ref(),
            ],
            &MetadataProgramID,
        );
        require_keys_eq!(
            metadata_key,
            self.nft_metadata.key(),
            StakingError::IncorrectMetadata
        );
        // Metadata of NFT
        let nft_meta: Metadata = Metadata::from_account_info(&self.nft_metadata)?;
        // Check mint key in metadata
        require_keys_eq!(
            nft_meta.mint,
            self.nft_mint.key(),
            StakingError::IncorrectMetadata
        );
        // check verified creator in creators list
        let creators = nft_meta.data.creators.unwrap();
        let verified_creator = creators.iter().find(|&c| c.verified == true);
        if verified_creator.is_none() {
            return Err(error!(StakingError::IncorrectMetadata));
        }
        require_keys_eq!(
            verified_creator.unwrap().address,
            self.global_state.nft_creator,
            StakingError::IncorrectMetadata
        );
        Ok(())
    }

    fn stake_nft_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.user_nft_ata.to_account_info(),
                to: self.pool_nft_ata.to_account_info(),
                authority: self.user.to_account_info(),
            },
        )
    }
}

#[access_control(ctx.accounts.validate())]
pub fn handler(ctx: Context<StakeNft>, hash_arr: [u8; 32], nft_type: u8) -> Result<()> {
    let accts = ctx.accounts;
    let nft_meta: Metadata = Metadata::from_account_info(&accts.nft_metadata)?;
    let nft_name = nft_meta.data.name[..].trim_end_matches('\0');
    verify_nft_type(nft_name, hash_arr, nft_type)?;

    let total_cnt: u8 = total_potion_cnt(&accts.user_state.potion_counts);
    accts.user_state.potion_nfts[total_cnt as usize] = accts.nft_mint.key();

    let current_time = Clock::get()?.unix_timestamp;

    accts.user_state.staked_time[total_cnt as usize] = current_time as u64;
    // save nft type
    accts.user_state.nft_types[total_cnt as usize] = nft_type;

    if accts.user_state.potion_counts[nft_type as usize] < MAX_COUNTS[nft_type as usize] {
        accts.user_state.potion_counts[nft_type as usize] += 1;
    } else {
        return Err(error!(StakingError::OverflowSameKindNft));
    }

    token::transfer(accts.stake_nft_context(), 1)?;

    Ok(())
}
