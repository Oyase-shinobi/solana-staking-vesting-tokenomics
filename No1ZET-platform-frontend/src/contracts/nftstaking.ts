export type RsStakingProgram = {
  version: "0.1.0";
  name: "rs_staking_program";
  instructions: [
    {
      name: "initializeStakingPool";
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
        },
        {
          name: "poolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "rewardPolicyByClass";
          type: {
            array: ["u16", 9];
          };
        },
        {
          name: "lockDay";
          type: "u32";
        }
      ];
    },
    {
      name: "stakeNft";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "poolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftStakeInfoAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "unstakeNft";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "poolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "nftStakeInfoAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakedNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardToAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "depositSwrd";
      accounts: [
        {
          name: "funder";
          isMut: true;
          isSigner: true;
        },
        {
          name: "poolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "funderAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawSwrd";
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
        },
        {
          name: "poolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardToAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "claimReward";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "poolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftStakeInfoAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rewardToAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "changeRewardMint";
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
        },
        {
          name: "poolAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "rewardMint";
          type: "publicKey";
        }
      ];
    },
    {
      name: "changePoolSetting";
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
        },
        {
          name: "poolAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "rewardPerWeek";
          type: "u16";
        },
        {
          name: "paused";
          type: "bool";
        }
      ];
    },
    {
      name: "transferOwnership";
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
        },
        {
          name: "poolAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "newAdmin";
          type: "publicKey";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "poolConfig";
      type: {
        kind: "struct";
        fields: [
          {
            name: "isInitialized";
            type: "bool";
          },
          {
            name: "admin";
            docs: ["admin pubkey"];
            type: "publicKey";
          },
          {
            name: "paused";
            docs: ["Paused state of the program"];
            type: "bool";
          },
          {
            name: "rewardMint";
            docs: ["Mint of the reward token."];
            type: "publicKey";
          },
          {
            name: "rewardVault";
            docs: ["Vault to store reward tokens."];
            type: "publicKey";
          },
          {
            name: "lastUpdateTime";
            docs: ["The last time reward states were updated."];
            type: "i64";
          },
          {
            name: "stakedNft";
            docs: ["Tokens Staked"];
            type: "u32";
          },
          {
            name: "rewardPerWeek";
            docs: ["Reward amount per day according to class type"];
            type: "u16";
          }
        ];
      };
    },
    {
      name: "stakeInfo";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "nftAddr";
            type: "publicKey";
          },
          {
            name: "stakeTime";
            type: "i64";
          },
          {
            name: "lastUpdateTime";
            type: "i64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "NotAllowedAuthority";
      msg: "Not Allowed Authority";
    },
    {
      code: 6001;
      name: "InvalidUserAddress";
      msg: "Invalid User Address";
    },
    {
      code: 6002;
      name: "InvalidPoolError";
      msg: "Invalid pool number";
    },
    {
      code: 6003;
      name: "InvalidNFTAddress";
      msg: "No Matching NFT to withdraw";
    },
    {
      code: 6004;
      name: "InvalidOwner";
      msg: "NFT Owner key mismatch";
    },
    {
      code: 6005;
      name: "InvalidWithdrawTime";
      msg: "Staking Locked Now";
    },
    {
      code: 6006;
      name: "IndexOverflow";
      msg: "Withdraw NFT Index OverFlow";
    },
    {
      code: 6007;
      name: "LackLamports";
      msg: "Insufficient Lamports";
    }
  ];
};

export const NFT_STAKING_IDL: RsStakingProgram = {
  version: "0.1.0",
  name: "rs_staking_program",
  instructions: [
    {
      name: "initializeStakingPool",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "poolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "rewardPolicyByClass",
          type: {
            array: ["u16", 9],
          },
        },
        {
          name: "lockDay",
          type: "u32",
        },
      ],
    },
    {
      name: "stakeNft",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "poolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userNftTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destNftTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nftStakeInfoAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "classId",
          type: "u32",
        },
      ],
    },
    {
      name: "withdrawNft",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "poolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "nftStakeInfoAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userNftTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakedNftTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardToAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "claimReward",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "poolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nftStakeInfoAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rewardToAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "depositSwrd",
      accounts: [
        {
          name: "funder",
          isMut: true,
          isSigner: true,
        },
        {
          name: "poolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "funderAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawSwrd",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "poolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardToAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "changePoolSetting",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "poolAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "rewardPolicyByClass",
          type: {
            array: ["u16", 9],
          },
        },
        {
          name: "lockDay",
          type: "u32",
        },
        {
          name: "paused",
          type: "bool",
        },
      ],
    },
    {
      name: "changeRewardMint",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "poolAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "rewardMint",
          type: "publicKey",
        },
      ],
    },
    {
      name: "transferOwnership",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "poolAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "newAdmin",
          type: "publicKey",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "PoolConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "isInitialized",
            type: "bool",
          },
          {
            name: "admin",
            docs: ["admin pubkey"],
            type: "publicKey",
          },
          {
            name: "paused",
            docs: ["Paused state of the program"],
            type: "bool",
          },
          {
            name: "lockDay",
            docs: ["nft lock period"],
            type: "u32",
          },
          {
            name: "rewardMint",
            docs: ["Mint of the reward token."],
            type: "publicKey",
          },
          {
            name: "rewardVault",
            docs: ["Vault to store reward tokens."],
            type: "publicKey",
          },
          {
            name: "lastUpdateTime",
            docs: ["The last time reward states were updated."],
            type: "i64",
          },
          {
            name: "stakedNft",
            docs: ["Tokens Staked"],
            type: "u32",
          },
          {
            name: "rewardPolicyByClass",
            docs: ["Reward amount per day according to class type"],
            type: {
              array: ["u16", 9],
            },
          },
        ],
      },
    },
    {
      name: "StakeInfo",
      type: {
        kind: "struct",
        fields: [
          {
            name: "classId",
            type: "u32",
          },
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "nftAddr",
            type: "publicKey",
          },
          {
            name: "stakeTime",
            type: "i64",
          },
          {
            name: "lastUpdateTime",
            type: "i64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "NotAllowedAuthority",
      msg: "Not Allowed Authority",
    },
    {
      code: 6001,
      name: "InvalidUserAddress",
      msg: "Invalid User Address",
    },
    {
      code: 6002,
      name: "InvalidPoolError",
      msg: "Invalid pool number",
    },
    {
      code: 6003,
      name: "InvalidNFTAddress",
      msg: "No Matching NFT to withdraw",
    },
    {
      code: 6004,
      name: "InvalidOwner",
      msg: "NFT Owner key mismatch",
    },
    {
      code: 6005,
      name: "InvalidWithdrawTime",
      msg: "Staking Locked Now",
    },
    {
      code: 6006,
      name: "IndexOverflow",
      msg: "Withdraw NFT Index OverFlow",
    },
    {
      code: 6007,
      name: "LackLamports",
      msg: "Insufficient Lamports",
    },
  ],
};
