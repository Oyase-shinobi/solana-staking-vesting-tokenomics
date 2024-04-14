import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import Slider from "react-slick";

import * as anchor from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

import {
  claimReward,
  getClaimableReward,
  getStakedInfo,
} from "../../contracts/nft-staking";
import { getAllNftData, getNftMetadataURI } from "../../contracts/utils";
import Button from "../Button";
import NFTItem from "./NFTItem";

const NFTStakingSection = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    variableWidth: 100,
    leftMode: true,
    autoplay: false,
  };

  const [selectedTab, setSelectedTab] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(true);
  const [vault_items, setVault_items] = useState([]);
  const sliderRef = useRef();
  const [stakedNfts, setStakedNfts] = useState([]);
  const [unStakedNft, setUnStakedNfts] = useState([]);
  const [claimableReward, setClaimableReward] = useState(0);

  const SOLANA_HOST = clusterApiUrl("devnet");
  const connection = new anchor.web3.Connection(SOLANA_HOST);
  const wallet = useWallet();

  async function fetchAll() {
    if (fetchFlag && wallet.publicKey) {
      await fetchUnstakedInfo();
      await fetchStakedInfo();
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedTab == "all") {
      const showNfts = [...stakedNfts, ...unStakedNft];
      setFilteredNFTs(showNfts);
    } else if (selectedTab == "staked") {
      setFilteredNFTs(stakedNfts);
    } else {
      setFilteredNFTs(unStakedNft);
    }
  }, [stakedNfts, unStakedNft, selectedTab]);

  useEffect(() => {
    async function getReward() {
      await getClaimableRewards();
    }

    getReward();
  }, [vault_items]);

  const fetchUnstakedInfo = async () => {
    let data = await getNftTokenData();

    try {
      if (data && data.length > 0) {
        const nfts = [];
        for (let i = 0; i < data.length; i++) {
          let uri = await axios.get(data[i].data.uri);
          const nft = {
            id: 1,
            name: data[i].data.name,
            image: uri.data.image,
            apy: 20,
            endsIn: "23:01:23:45",
            staked: false,
            stakingContract: "",
            mint: data[i].mint,
          };
          nfts.push(nft);
        }
        setUnStakedNfts(nfts);
      }
    } catch (error) {
      console.log("[error] => fetchNFTInfo() ", error);
    }
  };

  const getNftTokenData = async () => {
    try {
      let nftData = await getAllNftData(wallet, connection);
      var data = Object.keys(nftData).map((key) => nftData[key]);
      let arr = [];
      let n = data.length;
      for (let i = 0; i < n; i++) {
        arr.push(data[i]);
      }
      return arr;
    } catch (error) {
      console.log("[error] => getNftTokenData() ", error);
    }
  };

  const fetchStakedInfo = async () => {
    let stakedInfo = await getStakedInfo(wallet, connection);
    let nfts = [];
    let arr = [];
    for (let i = 0; i < stakedInfo.length; i++) {
      let uri = await getNftMetadataURI(
        wallet,
        connection,
        stakedInfo[i].account.nftAddr
      );
      
      const nft = {
        id: 1,
        name: uri.name,
        image: uri.image,
        apy: 20,
        endsIn: "23:01:23:45",
        staked: true,
        stakingContract: "",
        mint: stakedInfo[i].account.nftAddr.toBase58(),
      };
      nfts.push(nft);

      arr.push({
        id: stakedInfo[i].account.nftAddr.toBase58(),
        uri,
        name: uri.name,
        classId: stakedInfo[i].account.classId,
        lastUpdateTime: stakedInfo[i].account.lastUpdateTime,
      });
    }
    setStakedNfts(nfts);
    setVault_items(arr);
  };

  const getClaimableRewards = async () => {
    let arr = [];
    vault_items.map((item) => {
      arr.push({
        lastUpdateTime: Number(item.lastUpdateTime),
        classId: item.classId,
      });
    });
    let rewards = getClaimableReward(arr);
    setClaimableReward(rewards);
  };

  const goPrev = () => {
    sliderRef.current?.slickPrev();
    setActiveIndex(activeIndex === 0 ? activeIndex : activeIndex - 1);
  };

  const goNext = () => {
    sliderRef.current?.slickNext();
    setActiveIndex(
      activeIndex === filteredNFTs.length - 1 ? activeIndex : activeIndex + 1
    );
  };

  const onClaimReward = async () => {
    if (!wallet.publicKey) {
      // onToastOpen(WARNNING, "Please connect wallet");
      return;
    }

    try {
      //setLoading(true);
      let res = await claimReward(wallet, connection, vault_items);
      if (res.result == "success") {
        onToastOpen(SUCCESS, "Claim Reward Successfully!");
      } else {
        onToastOpen(WARNNING, "Claim Reward Failed!");
      }

      // setLoading(false);
      // setFetchFlag(true);
    } catch (e) {
      // console.log("Claim failed", e);
      // setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-3 lg:flex-row">
      <div className="flex flex-col w-full gap-3 bg-white rounded-lg lg:w-3/4 dark:bg-lightBrown shadow-custom">
        <div className="flex items-center justify-between px-3 mt-5 lg:px-8">
          <h2 className="text-xl font-semibold dark:text-white text-title-light whitespace-nowrap ">
            My NFTs
          </h2>

          <div className="w-2/3 lg:w-1/3  h-12  flex items-center justify-center   p-2 rounded-lg dark:bg-[#493121] bg-[#FFE5CF] gap-2 ">
            <div
              className={`w-1/3 flex items-center justify-center cursor-pointer h-full rounded-lg
            ${
              selectedTab === "all"
                ? "dark:bg-[#634430] bg-[#CD8549] text-white"
                : "bg-transparent text-[#ababab]"
            }
          `}
              onClick={() => setSelectedTab("all")}
            >
              All
            </div>

            <div
              className={`w-1/3 flex items-center justify-center cursor-pointer h-full rounded-lg
           ${
             selectedTab === "staked"
               ? "bg-[#634430] text-white"
               : "bg-transparent text-[#ababab]"
           }
         `}
              onClick={() => setSelectedTab("staked")}
            >
              Staked
            </div>

            <div
              className={`w-1/3 flex items-center justify-center cursor-pointer h-full rounded-lg
           ${
             selectedTab === "unstaked"
               ? "bg-[#634430] text-white"
               : "bg-transparent text-[#ababab]"
           }
         `}
              onClick={() => setSelectedTab("unstaked")}
            >
              Unstaked
            </div>
          </div>
        </div>
        {filteredNFTs.length > 0 ? (
          <Slider ref={sliderRef} {...settings}>
            {filteredNFTs.map((item) => (
              <NFTItem
                key={item.id}
                img={item.image}
                name={item.name}
                mint={item.mint}
                isStaked={item.staked}
                isStaking="Staking"
                onfetchAll={fetchAll}
              />
            ))}
          </Slider>
        ) : (
          ""
        )}
        <div className="flex items-center justify-between px-4 pb-4">
          <p className="text-sm text-[#ababab]">{`Showing ${
            activeIndex + 1
          }-${Math.min(activeIndex + 3, filteredNFTs.length)} from ${
            filteredNFTs.length
          }`}</p>
          <div className="flex items-center justify-start gap-x-5 ">
            <button
              onClick={goPrev}
              className="flex justify-center items-center border-2 border-[#89785E] w-10 h-10 rounded-md"
            >
              <img
                className="hidden w-4 h-4 dark:flex"
                alt=""
                src="/icons/left-chevron.svg"
              />
              <img
                className="flex w-4 h-4 dark:hidden "
                alt=""
                src="/icons/left-chevron-light.svg"
              />
            </button>
            <button
              onClick={goNext}
              className="flex justify-center items-center border-2 border-[#89785E] w-10 h-10 rounded-md"
            >
              <img
                className="hidden w-4 h-4 dark:flex"
                alt=""
                src="/icons/right-chevron.svg"
              />
              <img
                className="flex w-4 h-4 dark:hidden "
                alt=""
                src="/icons/right-chevron-light.svg"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-3 lg:w-1/4">
        <div className="w-full p-6 bg-white rounded-lg dark:bg-lightBrown shadow-custom dark:text-white text-title-light">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Staking Info</h2>
            <div className="flex gap-3">
              <img
                className="hidden w-10 h-10 dark:flex"
                src="/icons/staking.svg"
              />
              <img
                className="flex w-10 h-10 dark:hidden"
                src="/icons/staking-light.svg"
              />

              <div className="flex flex-col">
                <div className="text-xs dark:text-subtitle-dark text-subtitle-light">
                  Total Staked
                </div>
                <div className="text-base ">7.38 SOL</div>
              </div>
            </div>

            <div className="flex gap-3">
              <img
                className="hidden w-10 h-10 dark:flex"
                src="/icons/apr.svg"
              />
              <img
                className="flex w-10 h-10 dark:hidden"
                src="/icons/apr-light.svg"
              />
              <div className="flex flex-col">
                <div className="text-xs dark:text-subtitle-dark text-subtitle-light">
                  Average APR
                </div>
                <div className="text-base ">115%</div>
              </div>
            </div>

            <div className="flex gap-3">
              <img
                className="hidden w-10 h-10 dark:flex"
                src="/icons/earning.svg"
              />
              <img
                className="flex w-10 h-10 dark:hidden"
                src="/icons/earning-light.svg"
              />
              <div className="flex flex-col">
                <div className="text-xs dark:text-subtitle-dark text-subtitle-light">
                  Total Earnings
                </div>
                <div className="text-base ">0.51 SOL</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full p-6 bg-white rounded-lg dark:bg-lightBrown shadow-custom">
          <div className="flex flex-col gap-3 dark:text-white text-title-light">
            <h2 className="text-lg font-semibold">Withdraw</h2>
            <div className="flex gap-3">
              <img
                className="hidden w-10 h-10 dark:flex"
                src="/icons/check.svg"
              />
              <img
                className="flex w-10 h-10 dark:hidden"
                src="/icons/check-light.svg"
              />
              <div className="flex flex-col">
                <div className="text-xs dark:text-subtitle-dark text-subtitle-light">
                  Available for withdraw
                </div>
                <div className="text-base ">Claim {claimableReward} tokens</div>
              </div>
            </div>
            <div className="h-11">
              <Button text="Withdraw" onClick={onClaimReward} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTStakingSection;
