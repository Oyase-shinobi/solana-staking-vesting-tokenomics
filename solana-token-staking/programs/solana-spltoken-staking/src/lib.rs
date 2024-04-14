use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use std::mem::size_of;

const YEAR_DURATION: u64 = 365 * 24 * 3600;

pub fn calculate_reward(user: &StakingPoolUserAccount, pool: &StakingPoolAccount, clock: &Clock) -> Result<u64> {
    let seconds = (clock
        .unix_timestamp as u64)
        .checked_sub(user.last_stake_time)
        .unwrap();
    let until_new_reward_amount = user.amount
        .checked_mul(pool.apy)
        .unwrap()
        .checked_div(100)
        .unwrap()
        .checked_mul(seconds)
        .unwrap()
        .checked_div(YEAR_DURATION)
        .unwrap();
    Ok(until_new_reward_amount as u64)
}

declare_id!("DGcx7eErB4hoBT6ujD15mJK1aVQwYzwQyXU4zqqoRKCo");
#[program]
pub mod solana_spltoken_staking {
    use super::*;   

    pub fn create_global_state(_ctx: Context<CreateGlobalState>) -> Result<()> {
        let global_state = &mut _ctx.accounts.global_state;
        global_state.authority = _ctx.accounts.authority.key();
        global_state.bump = _ctx.bumps.global_state;
        global_state.is_initialized = 1;
        Ok(())
    }

    pub fn update_authority(_ctx: Context<UpdateAuthority>, new_authority: Pubkey) -> Result<()> {
        let state = &mut _ctx.accounts.global_state;
        state.authority = new_authority.key();
        let pool = &mut _ctx.accounts.pool;
        pool.authority = new_authority.key();
        Ok(())
    }

    pub fn create_pool(
        _ctx: Context<CreateStakingPool>,
        apy: u64,
        referal_reward: u64,
        fee: u64,
    ) -> Result<()> {
        let pool = &mut _ctx.accounts.pool;

        require!(referal_reward < 100, ErrorCode::InvalidAmount);
        require!(fee < 100, ErrorCode::InvalidAmount);

        pool.bump = _ctx.bumps.pool;
        pool.is_initialized = 0;
        pool.amount = 0;
        pool.total_user = 0;
        pool.mint = _ctx.accounts.mint.key();
        pool.vault = _ctx.accounts.vault.key();
        pool.apy = apy;
        pool.referal_reward = referal_reward;
        pool.fee = fee;
        pool.authority = _ctx.accounts.authority.key();

        emit!(PoolCreated {
            pool: _ctx.accounts.pool.key(),
            mint: _ctx.accounts.mint.key()
        });
        Ok(())
    }

    pub fn update_pool(
        _ctx: Context<UpdateStakingPool>,
        apy: u64,
        referal_reward: u64,
        fee: u64,
    ) -> Result<()> {
        let pool = &mut _ctx.accounts.pool;

        require!(referal_reward < 100, ErrorCode::InvalidAmount);
        require!(fee < 100, ErrorCode::InvalidAmount);

        pool.bump = _ctx.bumps.pool;
        pool.apy = apy;
        pool.referal_reward = referal_reward;
        pool.fee = fee;

        emit!(PoolCreated {
            pool: _ctx.accounts.pool.key(),
            mint: _ctx.accounts.mint.key()
        });
        Ok(())
    }

    pub fn deposit_reward_token(_ctx: Context<Deposit>, amount: u64) -> Result<()> {
        
        let cpi_accounts = Transfer {
            from: _ctx.accounts.user_vault.to_account_info(),
            to: _ctx.accounts.reward_vault.to_account_info(),
            authority: _ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        let pool = &mut _ctx.accounts.pool;
        pool.amount = pool.amount.checked_add(amount).unwrap();

        Ok(())
    }

    // to do
    pub fn claim_reward_token(_ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let new_pool = &_ctx.accounts.pool;
        let cpi_accounts = Transfer {
            from: _ctx.accounts.reward_vault.to_account_info(),
            to: _ctx.accounts.user_vault.to_account_info(),
            authority: _ctx.accounts.pool.to_account_info(),
        };

        let seeds = &[new_pool.mint.as_ref(), &[new_pool.bump]];
        let signer = &[&seeds[..]];
        let cpi_program = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn create_user(_ctx: Context<CreatePoolUser>) -> Result<()> {
        msg!("create_user_init");
        let user = &mut _ctx.accounts.user;

        user.authority = _ctx.accounts.user_key.key();
        user.bump = _ctx.bumps.user;
        user.pool = _ctx.accounts.pool.key();
        user.amount = 0;
        user.referal_reward = 0;
        user.last_stake_time = 0;
        user.lock_duration = 0;

        let pool = &mut _ctx.accounts.pool;
        pool.total_user += 1;
        emit!(UserCreated {
            pool: _ctx.accounts.pool.key(),
            user: _ctx.accounts.user.key(),
            authority: _ctx.accounts.authority.key(),
        });
        msg!("create_user_done");
        Ok(())
    }

    pub fn stake(_ctx: Context<Stake>, amount: u64) -> Result<()> {
        msg!("stake_start");
        let user = &mut _ctx.accounts.user;
        let pool = &mut _ctx.accounts.pool;
        let referral_user = &mut _ctx.accounts.referral_user;

        let deposit_amout_percent = 100 - pool.referal_reward;
        let deposit_amount = amount.checked_mul(deposit_amout_percent).unwrap().checked_div(100).unwrap();
        let referral_amount = amount.checked_mul(pool.referal_reward).unwrap().checked_div(100).unwrap();
        let current_reward_amount = calculate_reward(user, pool, &_ctx.accounts.clock)?;
        
        user.amount = user.amount
            .checked_add(deposit_amount)
            .unwrap()
            .checked_add(current_reward_amount)
            .unwrap();
        pool.amount = pool.amount.checked_add(deposit_amount).unwrap();

        msg!("user key {}", user.key());
        msg!("user amount {}", user.amount);
        msg!("pool key {}", pool.key());
        msg!("pool amount {}", pool.amount);

        referral_user.referal_reward = referral_user
            .referal_reward
            .checked_add(referral_amount)
            .unwrap();
        user.last_stake_time = _ctx.accounts.clock.unix_timestamp as u64;

        let cpi_accounts = Transfer {
            from: _ctx.accounts.user_vault.to_account_info(),
            to: _ctx.accounts.pool_vault.to_account_info(),
            authority: _ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        emit!(UserStaked {
            pool: _ctx.accounts.pool.key(),
            user: _ctx.accounts.user.key(),
            authority: _ctx.accounts.authority.key(),
            amount
        });
        msg!("stake_end");
        Ok(())
    }

    
    pub fn compound(_ctx: Context<Unstake>) -> Result<()> {
        msg!("compound start");
        let pool = &mut _ctx.accounts.pool;
        let user = &mut _ctx.accounts.user;

        let until_new_reward_amount = calculate_reward(user, pool, &_ctx.accounts.clock)?;

        msg!("user key {}", user.key());
        msg!("user amount {}", user.amount);
        msg!("pool key {}", pool.key());
        msg!("pool amount {}", pool.amount);

        user.amount = user.amount.checked_add(until_new_reward_amount).unwrap();
        user.last_stake_time = _ctx.accounts.clock.unix_timestamp as u64;

        msg!("user key {}", user.key());
        msg!("user amount {}", user.amount);
        msg!("pool key {}", pool.key());
        msg!("pool amount {}", pool.amount);

        emit!(UserHarvested {
            pool: _ctx.accounts.pool.key(),
            user: _ctx.accounts.user.key(),
            authority: _ctx.accounts.authority.key(),
            amount: until_new_reward_amount
        });
        msg!("compound end");
        Ok(())
    }

    pub fn unstake(_ctx: Context<Unstake>) -> Result<()> {
        msg!("unstake_start");
        let user = &mut _ctx.accounts.user;
        let pool = &mut _ctx.accounts.pool;

        require!(
            user.last_stake_time
                .checked_add(user.lock_duration)
                .unwrap()
                <= _ctx.accounts.clock.unix_timestamp as u64,
            ErrorCode::UnderLocked
        );

        msg!("user key {}", user.key());
        msg!("user amount {}", user.amount);
        msg!("pool key {}", pool.key());
        msg!("pool amount {}", pool.amount);

        let mut total_reward_amount = calculate_reward(user, pool, &_ctx.accounts.clock)?;
        total_reward_amount = total_reward_amount
            .checked_add(user.referal_reward)
            .unwrap()
            .checked_add(user.amount)
            .unwrap();

        let withdraw_fee_amount = total_reward_amount.checked_mul(pool.fee).unwrap().checked_div(100).unwrap();
        user.last_stake_time = _ctx.accounts.clock.unix_timestamp as u64;
        
        pool.amount = pool.amount.checked_sub(total_reward_amount).unwrap();
        user.amount = 0;
        user.referal_reward = 0;

        msg!("user key {}", user.key());
        msg!("user amount {}", user.amount);
        msg!("pool key {}", pool.key());
        msg!("pool amount {}", pool.amount);

        let cpi_accounts = Transfer {
            from: _ctx.accounts.pool_vault.to_account_info(),
            to: _ctx.accounts.user_vault.to_account_info(),
            authority: pool.to_account_info(),
        };

        let seeds = &[pool.mint.as_ref(), &[pool.bump]];
        let signer = &[&seeds[..]];
        let cpi_program = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, total_reward_amount.checked_sub(withdraw_fee_amount).unwrap())?;
        
        let cpi_accounts_fee = Transfer {
            from: _ctx.accounts.pool_vault.to_account_info(),
            to: _ctx.accounts.treasury.to_account_info(),
            authority: pool.to_account_info(),
        };

        let cpi_program_fee = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx_fee = CpiContext::new_with_signer(cpi_program_fee, cpi_accounts_fee, signer);
        token::transfer(cpi_ctx_fee, withdraw_fee_amount)?;
        emit!(UserUnstaked {
            pool: _ctx.accounts.pool.key(),
            user: _ctx.accounts.user.key(),
            authority: _ctx.accounts.authority.key(),
            amount: total_reward_amount,
        });
        msg!("unstake_end");
        Ok(())
    }

    pub fn claim(_ctx: Context<Claim>) -> Result<()> {
        msg!("claim start");
        let pool = &mut _ctx.accounts.pool;
        let user = &mut _ctx.accounts.user;

        require!(
            user.last_stake_time
                .checked_add(user.lock_duration)
                .unwrap()
                <= _ctx.accounts.clock.unix_timestamp as u64,
            ErrorCode::UnderLocked
        );

        let mut total_reward_amount = calculate_reward(user, pool, &_ctx.accounts.clock)?;
        total_reward_amount = total_reward_amount
            .checked_add(user.referal_reward)
            .unwrap();
        let withdraw_fee_amount = total_reward_amount.checked_mul(pool.fee).unwrap().checked_div(100).unwrap();

        let cpi_accounts = Transfer {
            from: _ctx.accounts.pool_vault.to_account_info(),
            to: _ctx.accounts.user_vault.to_account_info(),
            authority: pool.to_account_info(),
        };

        let seeds = &[pool.mint.as_ref(), &[pool.bump]];
        let signer = &[&seeds[..]];
        let cpi_program = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, total_reward_amount.checked_sub(withdraw_fee_amount).unwrap())?;

        let cpi_accounts_fee = Transfer {
            from: _ctx.accounts.pool_vault.to_account_info(),
            to: _ctx.accounts.treasury.to_account_info(),
            authority: pool.to_account_info(),
        };

        let cpi_program_fee = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx_fee = CpiContext::new_with_signer(cpi_program_fee, cpi_accounts_fee, signer);
        token::transfer(cpi_ctx_fee, withdraw_fee_amount)?;

        user.referal_reward = 0;
        user.last_stake_time = _ctx.accounts.clock.unix_timestamp as u64;

        emit!(UserHarvested {
            pool: _ctx.accounts.pool.key(),
            user: _ctx.accounts.user.key(),
            authority: _ctx.accounts.authority.key(),
            amount: total_reward_amount
        });
        msg!("claim end");
        Ok(())
    }

}

#[derive(Accounts)]
pub struct CreateGlobalState<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        seeds = [b"state".as_ref()],
        bump,
        payer = authority,
        space = 8 + size_of::<GlobalState>()
    )]
    pub global_state: Account<'info, GlobalState>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateAuthority<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"state".as_ref()],
        bump,
        has_one = authority
    )]
    pub global_state: Account<'info, GlobalState>,
    #[account(
        mut, 
        seeds = [pool.mint.key().as_ref()], 
        bump = pool.bump,
        has_one = authority
    )]
    pub pool: Account<'info, StakingPoolAccount>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CreateStakingPool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [mint.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + size_of::<StakingPoolAccount>()
    )]
    pub pool: Account<'info, StakingPoolAccount>,

    #[account(
        mut, 
        seeds = [b"state".as_ref()], 
        bump = global_state.bump, 
        has_one = authority
    )]
    pub global_state: Account<'info, GlobalState>,

    pub mint: Box<Account<'info, Mint>>,
    #[account(
        init,
        associated_token::mint=mint,
        associated_token::authority=pool,
        payer = authority,
    )]
    pub vault: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct UpdateStakingPool<'info> {    
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [mint.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub pool: Account<'info, StakingPoolAccount>,

    #[account(
        mut, 
        seeds = [b"state".as_ref()], 
        bump = global_state.bump, 
        has_one = authority
    )]
    pub global_state: Account<'info, GlobalState>,

    pub mint: Box<Account<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint=mint,
        associated_token::authority=pool,
    )]
    pub vault: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {    
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut, 
        seeds = [b"state".as_ref()], 
        bump = global_state.bump,
        has_one = authority
    )]
    pub global_state: Account<'info, GlobalState>,
    #[account(
        mut,
        seeds = [mint.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub pool: Account<'info, StakingPoolAccount>,
    pub mint: Box<Account<'info, Mint>>,

    #[account(
        mut, 
        constraint = reward_vault.owner == pool.key()
    )]
    pub reward_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        mut, 
        constraint = user_vault.owner == authority.key()
    )]
    pub user_vault: Box<Account<'info, TokenAccount>>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreatePoolUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK
    #[account(mut)]
    pub user_key: AccountInfo<'info>,

    #[account(
        init,
        seeds = [pool.key().as_ref(), user_key.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + size_of::<StakingPoolUserAccount>()
    )]
    pub user: Account<'info, StakingPoolUserAccount>,
    #[account(
        mut, 
        seeds = [b"state".as_ref()], 
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut, 
        seeds = [pool.mint.key().as_ref()], 
        bump = pool.bump
    )]
    pub pool: Account<'info, StakingPoolAccount>,    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut, 
        seeds = [pool.key().as_ref(), authority.key().as_ref()], 
        bump = user.bump, 
        has_one = pool, 
        has_one = authority
    )]
    pub user: Account<'info, StakingPoolUserAccount>,

    #[account(
        mut, 
        seeds = [b"state".as_ref()], 
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut, 
        seeds = [pool.mint.key().as_ref()], 
        bump = pool.bump
    )]
    pub pool: Account<'info, StakingPoolAccount>,
    
    #[account(constraint = mint.key() == pool.mint)]
    pub mint: Box<Account<'info, Mint>>,
    #[account(
        mut, 
        constraint = pool_vault.owner == pool.key()
    )]
    pub pool_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        mut, 
        constraint = user_vault.owner == authority.key()
    )]
    pub user_vault: Box<Account<'info, TokenAccount>>,

    /// CHECK:
    #[account(mut)]
    pub referral: AccountInfo<'info>,

    /// CHECK:
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    #[account(
        mut, 
        seeds = [pool.key().as_ref(), referral.key().as_ref()], 
        bump = referral_user.bump, 
        has_one = pool
    )]
    pub referral_user: Account<'info, StakingPoolUserAccount>,
    pub system_program: Program<'info, System>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut, 
        seeds = [pool.key().as_ref(), authority.key().as_ref()], 
        bump = user.bump, 
        has_one = pool, 
        has_one = authority
    )]
    pub user: Account<'info, StakingPoolUserAccount>,

    #[account(
        mut, 
        seeds = [b"state".as_ref()], 
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut, 
        seeds = [pool.mint.key().as_ref()], 
        bump = pool.bump
    )]
    pub pool: Account<'info, StakingPoolAccount>,
    
    #[account(constraint = mint.key() == pool.mint)]
    pub mint: Box<Account<'info, Mint>>,
    #[account(
        mut, 
        constraint = pool_vault.owner == pool.key()
    )]
    pub pool_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        mut, 
        constraint = user_vault.owner == authority.key()
    )]
    pub user_vault: Box<Account<'info, TokenAccount>>,

    /// CHECK:
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
    pub clock: Sysvar<'info, Clock>,
}


#[derive(Accounts)]
pub struct Claim<'info> { 
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut, 
        seeds = [pool.key().as_ref(), authority.key().as_ref()], 
        bump = user.bump, 
        has_one = pool, 
        has_one = authority
    )]
    pub user: Account<'info, StakingPoolUserAccount>,

    #[account(
        mut, 
        seeds = [b"state".as_ref()], 
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut, 
        seeds = [pool.mint.key().as_ref()], 
        bump = pool.bump
    )]
    pub pool: Account<'info, StakingPoolAccount>,
   
    #[account(constraint = mint.key() == pool.mint)]
    pub mint: Box<Account<'info, Mint>>,

    #[account(
        mut, 
        constraint = pool_vault.owner == pool.key()
    )]
    pub pool_vault: Box<Account<'info, TokenAccount>>,

    /// CHECK:
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    #[account(
        mut, 
        constraint = user_vault.owner == authority.key()
    )]
    pub user_vault: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
    pub clock: Sysvar<'info, Clock>,
}

#[account]
#[derive(Default)]
pub struct GlobalState {
    pub authority: Pubkey,
    pub bump: u8,
    pub is_initialized: u8,
}

impl<'info> CreateGlobalState<'info> {
    pub fn validate(&self) -> Result<()> {
        if self.global_state.is_initialized == 1 {
            require!(
                self.global_state.authority.eq(&self.authority.key()),
                ErrorCode::NotAllowedAuthority
            )
        }
        Ok(())
    }
}

#[account]
#[derive(Default)]
pub struct StakingPoolAccount {
    pub bump: u8,
    pub is_initialized: u8,
    pub authority: Pubkey,
    pub amount: u64,
    pub mint: Pubkey,
    pub vault: Pubkey,
    pub total_user: u64,
    pub apy: u64,
    pub referal_reward: u64,
    pub fee: u64,
}

impl<'info> CreateStakingPool<'info> {
    pub fn validate(&self) -> Result<()> {
        if self.pool.is_initialized == 1 {
            require!(
                self.pool.authority.eq(&self.authority.key()),
                ErrorCode::NotAllowedAuthority
            )
        }
        Ok(())
    }
}

#[account]
#[derive(Default)]
pub struct StakingPoolUserAccount {
    pub bump: u8,
    pub pool: Pubkey,   //staking pool pubkey
    pub authority: Pubkey, // staking user account
    pub amount: u64, // staked amount
    pub referal_reward: u64, // extra from lock duration; ex lock 12M => +10%
    pub last_stake_time: u64,
    pub lock_duration: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Not Allowed Authority")]
    NotAllowedAuthority,
    #[msg("Invalid Amount")]
    InvalidAmount,
    #[msg("Over staked amount")]
    UnstakeOverAmount,
    #[msg("Under locked")]
    UnderLocked,
}
#[event]
pub struct PoolCreated {
    pool: Pubkey,
    mint: Pubkey,
}
#[event]
pub struct UserCreated {
    pool: Pubkey,
    user: Pubkey,
    authority: Pubkey,
}
#[event]
pub struct UserStaked {
    pool: Pubkey,
    user: Pubkey,
    authority: Pubkey,
    amount: u64,
}
#[event]
pub struct UserUnstaked {
    pool: Pubkey,
    user: Pubkey,
    authority: Pubkey,
    amount: u64,
}
#[event]
pub struct UserHarvested {
    pool: Pubkey,
    user: Pubkey,
    authority: Pubkey,
    amount: u64,
}
