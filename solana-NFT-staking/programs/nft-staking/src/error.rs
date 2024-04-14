use anchor_lang::prelude::*;

#[error_code]
pub enum StakingError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,

    #[msg("You are not authorized to perform this action.")]
    NotAllowedAuthority,

    #[msg("Incorrect NFT Metadata")]
    IncorrectMetadata,

    #[msg("Incorrect Parameter")]
    IncorrectParameter,

    #[msg("Invalid NFT Type")]
    InvalidType,

    #[msg("NFT is still locked")]
    NftLocked,

    #[msg("Unknown NFT")]
    UnknownNFT,

    #[msg("Overflow same kind NFT")]
    OverflowSameKindNft,

    #[msg("This action is not expected.")]
    UnexpectedAction,
}
