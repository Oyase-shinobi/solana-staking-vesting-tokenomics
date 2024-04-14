import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import * as anchor from "@project-serum/anchor";
import * as token from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Z01ZET_DECIMALS } from "../../contracts/constants"

import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getAccount,
} from "@solana/spl-token";

import {
  stake,
  unstake,
  compound,
  claim,
  getTokenFromType,
  getMyStakedAndReward,
  getStakingAPY
} from "../../contracts/web3";
import Button from "../Button";
import StatItem from "../StatItem";
import PlusMinusButton from "./PlusMinusButton";
import StakingSummaryItem from "./StakingSummaryItem";

const SOLANA_HOST = "https://solana-devnet.g.alchemy.com/v2/qR88bjAxFf_021F7-qAP_Q74-v-KMcCZ";//clusterApiUrl("devnet");//clusterApiUrl("devnet");
const connection = new anchor.web3.Connection(SOLANA_HOST);

const TokenStakingSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalStaking, setTotalStaking] = useState(250000);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [setimatedAward, setEstimatedAward] = useState(150);
  const [price, setPrice] = useState(0.0001);
  const [unStakeAmount, setUnStakeAmount] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [tokenMint, setTokenMint] = useState('');
  const [dataUpdate, setDataUpdate] = useState(false);
  const [userAta_balance, setUserAta_balance] = useState(0);
  const [myStakedTime, setMyStakedTime] = useState(0);
  const [myRefReward, setMyRefReward] = useState(0);
  const [stakingAPY, setStakingAPY] = useState('');

  const wallet = useWallet();

  const getOrCreateAssociatedTokenAccountNew = async () => {
    const mint = tokenMint;
    const owner = wallet.publicKey;
    let commitment;

    const associatedToken = getAssociatedTokenAddressSync(
      mint,
      owner,
    );

    // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
    // Sadly we can't do this atomically.
    let account;
    try {
      account = await getAccount(connection, associatedToken, commitment, TOKEN_PROGRAM_ID);
      // console.log("account", account);
    } catch (error) {
      // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
      // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
      // TokenInvalidAccountOwnerError in this code path.
      // Now this should always succeed
      await createTokenAccount(wallet, mint);
      account = await getAccount(connection, associatedToken, commitment, TOKEN_PROGRAM_ID);
    }

    if (!account.mint.equals(mint)) {
      console.log("getOrCreateAssociatedTokenAccountNew error1");
    }
    if (!account.owner.equals(owner)) {
      console.log("getOrCreateAssociatedTokenAccountNew error2");
    }
    return account;
  }

  const fetchBalance = async () => {
    try {
      if (!wallet || !wallet.publicKey || !wallet.connected)
        return;

      const balance1 = await connection.getBalance(wallet.publicKey);
      setWalletBalance(balance1 / LAMPORTS_PER_SOL);

      const userAta = await getOrCreateAssociatedTokenAccountNew();

      if (userAta) {
        const userAta_balance = parseInt(userAta.amount) / 10 ** Z01ZET_DECIMALS;
        setUserAta_balance(userAta_balance);
      }

    } catch (error) {
      // Handle errors appropriately
      console.error("Error fetching balance:", error);
    }
  }

  useEffect(() => {
    fetchBalance();
  }, [connection, wallet, dataUpdate]);

  useEffect(() => {

    setTokenMint(getTokenFromType());

    (async () => {
      try {
        // const stateInit = await getStateInitialized(wallet);
        // setStateInitialized(stateInit);

        // const poolInit = await getIsPoolInitialized(getTokenFromType())
        // setPoolInitialized(poolInit);

        // const amount = await getTotalStaked(wallet, getTokenFromType());
        // setTotalStaked(amount);

        const apy = await getStakingAPY(wallet);
        setStakingAPY(apy);
        console.log("apy: ", apy.toString());

        // const fee = await getWithdrawFee(wallet);
        // setWithdrawFee(fee);

        // const referal = await getReferalFee(wallet);
        // setReferralFee(referal);
      } catch (e) {
        console.log("error", e);
      }

    })();
  }, [dataUpdate]);

  useEffect(() => {
    if (!wallet || !wallet.publicKey) {
      setStakedAmount(0);
      setRewards(0);
      return;
    }
    setTokenMint(getTokenFromType());
    (async () => {
      const [amount, reward_amount, time] = await getMyStakedAndReward(wallet, tokenMint);
      console.log("amount-frontend", amount);
      console.log("reward_amount-frontend", reward_amount);
      setStakedAmount(amount);
      setMyRefReward(reward_amount);
      setMyStakedTime(time);
    })();
  }, [wallet.publicKey, dataUpdate]);
// useEffect(() => {
  //   setTimeout(() => {
  //     console.log("timer");
  //     // fetchBalance();
  //     // getReward();
  //   }, 1000);
  // }, []);
  setTimeout(() => {
    if (stakedAmount == undefined)
      return;
    const currentTime = new Date();
    const unixTimestamp = Math.floor(currentTime.getTime() / 1000);
    const reward_amount_t = myRefReward + stakedAmount * (unixTimestamp - myStakedTime) / (365 * 24 * 3600) * parseInt(stakingAPY) / 100;
    console.log("reward_amount_t", reward_amount_t);
    setRewards(reward_amount_t.toFixed(5));
  }, 1000);

  const onStake = async () => {
    let referral = getRef();
    if (referral === null) referral = wallet.publicKey.toString();
    try {
      let txHash = await stake(wallet, stakeAmount, tokenMint, referral);
    } catch (e) {
      console.error(e);
    }
  };

  const onUnstake = async () => {
    try {
      await unstake(wallet, tokenMint);
      setDataUpdate(!dataUpdate)
    } catch (e) {
      console.error(e);
    }
  };

  const onClaim = async () => {
    try {
      await claim(wallet, tokenMint);
      setDataUpdate(!dataUpdate)
    } catch (e) {
      console.error(e);
    }
  };

  const onCompound = async () => {
    try {
      let txHash = await compound(wallet, tokenMint);
      console.log("onCompound", txHash);
      setDataUpdate(!dataUpdate);
    } catch (e) {
      console.error(e);
    }
  }

  const getRef = () => {
    const ref = searchParams.get("ref");
    return ref;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="w-full flex flex-col gap-3 dark:bg-lightBrown bg-white shadow-custom rounded-xl p-4 dark:text-white text-title-light ">
        <div className="flex flex-row items-center justify-start my-6 dark:text-white text-title-light gap-4">
          <img
            className="w-14 hidden dark:flex"
            alt=""
            src="/icons/logo1.svg"
          />
          <img
            className="w-14 dark:hidden flex"
            alt=""
            src="/icons/logo1-light.svg"
          />
          <h1 className="text-2xl font-semibold">N01ZET Staking</h1>
        </div>
        <div className="flex justify-between">
          <div className="w-2/5 flex flex-col gap-6 ">
            <p>Available In Wallet</p>
            <div className="flex flex-row justify-between">
              <p>{userAta_balance}</p>
              <button
                onClick={() => setStakeAmount(walletBalance)}
                className="underline text-[#FB9037]"
              >
                Max
              </button>
            </div>

            <div className="flex flex-row justify-between items-center gap-x-1">
              <PlusMinusButton
                value="-"
                onClick={() => setStakeAmount((prev) => Math.max(prev - 1, 0))}
              />

              <input
                type="number"
                value={stakeAmount}
                min={0}
                onChange={(e) => setStakeAmount(parseInt(e.target.value))}
                className="w-24 grow h-12 text-center bg-transparent rounded border-2 border-[#9D8B70]"
              />
              <PlusMinusButton
                value="+"
                onClick={() =>
                  setStakeAmount((stakeAmount) =>
                    Math.min(stakeAmount + 1, totalStaking)
                  )
                }
              />
            </div>
            <div className="h-11">
              <Button text="Stake" onClick={onStake} />
            </div>
          </div>

          <div className="w-2/5 flex flex-col gap-6 ">
            <p>Total Staked</p>
            <div className="flex flex-row justify-between">
              <p>{stakedAmount}</p>
              {/* <button
                onClick={() => setUnStakeAmount(stakedAmount)}
                className="underline text-[#FB9037]"
              >
                Max
              </button> */}
            </div>
            {/* <div className="flex flex-row justify-between  items-center gap-x-1 w-full ">
              <PlusMinusButton
                value="-"
                onClick={() =>
                  setUnStakeAmount((prev) => Math.max(prev - 1, 0))
                }
              />
              <input
                type="number"
                value={unStakeAmount}
                max={stakedAmount}
                min={0}
                onChange={(e) => setUnStakeAmount(parseInt(e.target.value))}
                className="w-24 grow h-12 text-center bg-transparent rounded border-2 border-[#9D8B70]"
              />
              <PlusMinusButton
                value="+"
                onClick={() =>
                  setUnStakeAmount((prev) => Math.min(prev + 1, stakedAmount))
                }
              />
            </div> */}
            <div className="h-11">
              <Button
                text="Unstake"
                disabled={stakedAmount > 0 ? false : true}
                onClick={onUnstake}
              />
            </div>
            <div className="h-11">
              <Button
                text="Compound"
                className="px-10"
                onClick={onCompound}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center ">
          <p>Pending Rewards: {rewards}</p>

          <div className="w-24 h-11">
            <Button
              text="Claim"
              iconSrc="/icons/download.svg"
              className="px-10"
              onClick={onClaim}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
          <div className="w-full ">
            <StatItem
              value={`${totalStaking} N01zet`}
              title="Total Staking"
              info="/icons/info.svg"
            />
          </div>
          <div className="w-full">
            <StatItem
              value={`${setimatedAward}% ARP`}
              title="Estimated Award"
              info="/icons/info.svg"
            />
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-3 dark:bg-lightBrown bg-white shadow-custom rounded-xl p-6 ">
          <h2 className="font-semibold pb-6 dark:text-white text-title-light">
            Staking Summary
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <StakingSummaryItem title="N01ZET Price" value={`$${price}`} />
            <StakingSummaryItem
              title="Daily Rewards"
              value={`$${price}`}
              info={true}
            />
            <StakingSummaryItem
              title="Total Supply"
              value={`$${price}`}
              info={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenStakingSection;
