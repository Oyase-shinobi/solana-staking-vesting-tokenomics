import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import * as anchor from "@project-serum/anchor";
import * as token from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

import {
  claim_vesting,
  getMyVestedAndReward,
  getTokenFromType,
  unvest,
  vest,
} from "../../contracts/web3_vesting";
import Button from "../Button";
import StatItem from "../StatItem";
import PlusMinusButton from "./PlusMinusButton";
import StakingSummaryItem from "./StakingSummaryItem";

const TokenVestingSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalVesting, setTotalVesting] = useState(250000);
  const [vestAmount, setVestAmount] = useState(0);
  const [vestedAmount, setVestedAmount] = useState(0);
  const [totalVested, setTotalVested] = useState(0);
  const [setimatedAward, setEstimatedAward] = useState(150);
  const [price, setPrice] = useState(0.0988);
  const [unVestAmount, setUnVestAmount] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const APY = 15;

  const SOLANA_HOST = "https://solana-devnet.g.alchemy.com/v2/qR88bjAxFf_021F7-qAP_Q74-v-KMcCZ";//clusterApiUrl("devnet");
  const connection = new anchor.web3.Connection(SOLANA_HOST);

  const wallet = useWallet();

  const tokenMint = useMemo(() => {
    return getTokenFromType("FRENS");
  }, ["FRENS"]);

  const getReward = async () => {
    const [amount, reward_amount] = await getMyVestedAndReward(
      wallet,
      tokenMint
    );
    setVestedAmount(amount);
    setRewards(reward_amount);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBalance();
      getReward();
    }, 2000);

    return () => clearInterval(interval);
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("timer");
  //     // fetchBalance();
  //     // getReward();
  //   }, 1000);
  // }, []);

  const fetchBalance = useCallback(async () => {
    try {
      const balance1 = await connection.getBalance(wallet.publicKey);
      const mint = tokenMint;
      const userAta = await token.getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mint,
        wallet.publicKey,
        false
      );
      const userAta_balance = parseInt(userAta.amount) / LAMPORTS_PER_SOL;
      setWalletBalance(userAta_balance);
    } catch (error) {
      // Handle errors appropriately
      console.error("Error fetching balance:", error);
    }
  }, [connection, wallet]);

  useEffect(() => {
    fetchBalance();
    getReward();
  }, [connection, wallet]);

  const onVest = async () => {
    let referral = getRef();
    if (referral === null) referral = wallet.publicKey.toString();
    try {
      let txHash = await vest(wallet, vestAmount, tokenMint, referral);
      console.log("txHash:", txHash);
    } catch (e) {
      console.error(e);
    }
  };

  const onUnvest = async () => {
    let referral = getRef();
    if (referral === null) referral = wallet.publicKey.toString();
    try {
      await unvest(
        wallet,
        vestedAmount + (vestedAmount * APY) / 100,
        tokenMint,
        referral
      );
    } catch (e) {
      console.error(e);
    }
  };

  const onClaim = async () => {
    try {
      await claim_vesting(wallet, tokenMint);
      setDataUpdate(!dataUpdate);
    } catch (e) {
      console.error(e);
    }
  };

  const getRef = () => {
    const ref = searchParams.get("ref");
    return ref;
  };

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <div className="flex flex-col w-full gap-3 p-4 bg-white dark:bg-lightBrown shadow-custom rounded-xl dark:text-white text-title-light ">
        <div className="flex flex-row items-center justify-start gap-4 my-6 dark:text-white text-title-light">
          <img
            className="hidden w-14 dark:flex"
            alt=""
            src="/icons/logo1.svg"
          />
          <img
            className="flex w-14 dark:hidden"
            alt=""
            src="/icons/logo1-light.svg"
          />
          <h1 className="text-2xl font-semibold">N01ZET Vesting</h1>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col w-2/5 gap-6 ">
            <p>Available In Wallet</p>
            <div className="flex flex-row justify-between">
              <p>{walletBalance}</p>
              <button
                onClick={() => setVestAmount(walletBalance)}
                className="underline text-[#FB9037]"
              >
                Max
              </button>
            </div>

            <div className="flex flex-row items-center justify-between gap-x-1">
              <PlusMinusButton
                value="-"
                onClick={() => setVestAmount((prev) => Math.max(prev - 1, 0))}
              />

              <input
                type="number"
                value={vestAmount}
                min={0}
                onChange={(e) => setVestAmount(parseInt(e.target.value))}
                className="w-24 grow h-12 text-center bg-transparent rounded border-2 border-[#9D8B70]"
              />
              <PlusMinusButton
                value="+"
                onClick={() =>
                  setVestAmount((vestAmount) =>
                    Math.min(vestAmount + 1, totalVesting)
                  )
                }
              />
            </div>
            <div className="h-11">
              <Button text="Vest" onClick={onVest} />
            </div>
          </div>

          <div className="flex flex-col w-2/5 gap-6 ">
            <p>Total Vested</p>
            <div className="flex flex-row justify-between">
              <p>{vestedAmount}</p>
            </div>
            <div className="flex flex-row items-center justify-between w-full gap-x-1 ">
              <input
                type="number"
                value={vestedAmount + (vestedAmount * APY) / 100}
                // onChange={(e) => setUnVestAmount(e.target.value)}
                className="w-24 grow h-12 text-center bg-transparent rounded border-2 border-[#9D8B70]"
              />
            </div>
            <div className="h-11">
              <Button
                text="Unvest"
                disabled={vestedAmount > 0 ? false : true}
                onClick={onUnvest}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-3">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="w-full ">
            <StatItem
              value={`${totalVesting} N01zet`}
              title="Total Vesting"
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
        <div className="flex flex-col w-full h-full gap-3 p-6 bg-white dark:bg-lightBrown shadow-custom rounded-xl ">
          <h2 className="pb-6 font-semibold dark:text-white text-title-light">
            Vesting Summary
          </h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
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

export default TokenVestingSection;
