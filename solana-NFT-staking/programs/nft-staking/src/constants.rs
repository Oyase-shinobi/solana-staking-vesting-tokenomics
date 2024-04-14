pub const GLOBAL_STATE_SEED: &[u8] = b"GLOBAL_STATE_SEED";
pub const USER_STATE_SEED: &[u8] = b"USER_STATE_SEED";

pub const MAX_COUNTS: [u8; 4] = [4, 3, 2, 1];

// pub const ONE_DAY: u64 = 3600 * 24;
pub const ONE_DAY: u64 = 60; // 1 minute

pub const LOCK_PERIOD: u64 = 10 * ONE_DAY;

/*
10% Primitive potion
25% Uncommon potion
50% Rare potion
100% Legendary potion
*/