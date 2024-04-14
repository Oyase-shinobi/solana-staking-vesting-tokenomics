export type Z01zetTokenomicsContract = {
  "version": "0.1.0",
  "name": "z01zet_tokenomics_contract",
  "instructions": [
    {
      "name": "distributeTokens",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "partnershipVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "shareholdersVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "advisorsVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "privateVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "publicVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ]
};

export const IDL: Z01zetTokenomicsContract = {
  "version": "0.1.0",
  "name": "z01zet_tokenomics_contract",
  "instructions": [
    {
      "name": "distributeTokens",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "partnershipVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "shareholdersVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "advisorsVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "privateVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "publicVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ]
};
