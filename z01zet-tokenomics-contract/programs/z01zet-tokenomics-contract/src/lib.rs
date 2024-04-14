use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use std::convert::TryFrom;
use std::convert::TryInto;
use std::mem::size_of;


declare_id!("CowT5MpH7psdHLzNjkGFXNY3QVFAKSxsyHpxbo7TFjWG");

const PARTNERSHIPS: u64 = 5;
const SHAREHOLDERS: u64 = 10;
const ADVISORS: u64 = 5;
const PRIVATE: u64 = 5;
const PUBLIC: u64 = 70;
const RESERVE: u64 = 5;

#[program]
pub mod z01zet_tokenomics_contract {
    use super::*;

    pub fn distribute_tokens(ctx: Context<Tokenomics>, amount: u64) -> Result<()> {
        msg!("distribute start");
        let amount_partnerships = amount.checked_mul(PARTNERSHIPS).unwrap().checked_div(100).unwrap();
        let amount_shareholders = amount.checked_mul(SHAREHOLDERS).unwrap().checked_div(100).unwrap();
        let amount_advisors = amount.checked_mul(ADVISORS).unwrap().checked_div(100).unwrap();
        let amount_private = amount.checked_mul(PRIVATE).unwrap().checked_div(100).unwrap();
        let amount_public = amount.checked_mul(PUBLIC).unwrap().checked_div(100).unwrap();
        let amount_reserve = amount.checked_mul(RESERVE).unwrap().checked_div(100).unwrap();
        
        let cpi_accounts_partnerships = Transfer {
            from: ctx.accounts.admin_vault.to_account_info(),
            to: ctx.accounts.partnership_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program_partnerships = ctx.accounts.token_program.to_account_info();
        let cpi_ctx_partnerships = CpiContext::new(cpi_program_partnerships, cpi_accounts_partnerships);
        token::transfer(cpi_ctx_partnerships, amount_partnerships)?;

        let cpi_accounts_shareholders = Transfer {
            from: ctx.accounts.admin_vault.to_account_info(),
            to: ctx.accounts.shareholders_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program_shareholders = ctx.accounts.token_program.to_account_info();
        let cpi_ctx_shareholders = CpiContext::new(cpi_program_shareholders, cpi_accounts_shareholders);
        token::transfer(cpi_ctx_shareholders, amount_shareholders)?;

        let cpi_accounts_advisors = Transfer {
            from: ctx.accounts.admin_vault.to_account_info(),
            to: ctx.accounts.advisors_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program_advisors = ctx.accounts.token_program.to_account_info();
        let cpi_ctx_advisors = CpiContext::new(cpi_program_advisors, cpi_accounts_advisors);
        token::transfer(cpi_ctx_advisors, amount_advisors)?;

        let cpi_accounts_private = Transfer {
            from: ctx.accounts.admin_vault.to_account_info(),
            to: ctx.accounts.private_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program_private = ctx.accounts.token_program.to_account_info();
        let cpi_ctx_private = CpiContext::new(cpi_program_private, cpi_accounts_private);
        token::transfer(cpi_ctx_private, amount_private)?;

        let cpi_accounts_public = Transfer {
            from: ctx.accounts.admin_vault.to_account_info(),
            to: ctx.accounts.public_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program_public = ctx.accounts.token_program.to_account_info();
        let cpi_ctx_public = CpiContext::new(cpi_program_public, cpi_accounts_public);
        token::transfer(cpi_ctx_public, amount_public)?;

        let cpi_accounts_reserve = Transfer {
            from: ctx.accounts.admin_vault.to_account_info(),
            to: ctx.accounts.reserve_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program_reserve = ctx.accounts.token_program.to_account_info();
        let cpi_ctx_reserve = CpiContext::new(cpi_program_reserve, cpi_accounts_reserve);
        token::transfer(cpi_ctx_reserve, amount_reserve)?;

        Ok(())
    }

}


#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Tokenomics<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub admin_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub partnership_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub shareholders_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub advisors_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub private_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub public_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub reserve_vault: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
