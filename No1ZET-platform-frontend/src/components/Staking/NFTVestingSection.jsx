import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import Slider from "react-slick";

import * as anchor from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

import {
  claimReward,
  getClaimableReward,
  getVestedInfo,
} from "../../contracts/nft-vesting";
import { getAllNftData, getNftMetadataURI } from "../../contracts/utils";
import Button from "../Button";
import NFTItem from "./NFTItem";

const NFTVestingSection = () => {
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
  const [vestedNfts, setVestedNfts] = useState([]);
  const [unVestedNft, setUnVestedNfts] = useState([]);
  const [claimableReward, setClaimableReward] = useState(0);

  const SOLANA_HOST = clusterApiUrl("devnet");
  const connection = new anchor.web3.Connection(SOLANA_HOST);
  const wallet = useWallet();

  async function fetchAll() {
    console.log("Fetching...............");
    if (fetchFlag && wallet.publicKey) {
      console.log("[log] => fetching...");
      await fetchUnvestedInfo();
      await fetchVestedInfo();
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedTab == "all") {
      const showNfts = [...vestedNfts, ...unVestedNft];
      setFilteredNFTs(showNfts);
    } else if (selectedTab == "vested") {
      setFilteredNFTs(vestedNfts);
    } else {
      setFilteredNFTs(unVestedNft);
    }
  }, [vestedNfts, unVestedNft, selectedTab]);

  useEffect(() => {
    async function getReward() {
      await getClaimableRewards();
    }

    getReward();
  }, [vault_items]);

  const fetchUnvestedInfo = async () => {
    let data = await getNftTokenData();
    console.log("==>>>>==unvested=", data);

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
            vested: false,
            vestingContract: "",
            mint: data[i].mint,
          };
          nfts.push(nft);
        }
        setUnVestedNfts(nfts);
      }
    } catch (error) {
      console.log("[error] => fetchNFTInfo() ", error);
    }
  };

  const getNftTokenData = async () => {
    try {
      console.log(
        "[log] => getNfttokenData() wallet",
        wallet.publicKey.toBase58()
      );
      let nftData = await getAllNftData(wallet, connection);
      var data = Object.keys(nftData).map((key) => nftData[key]);
      let arr = [];
      let n = data.length;
      for (let i = 0; i < n; i++) {
        console.log(data[i].data.uri);
        arr.push(data[i]);
      }
      // console.log(`arr`)
      return arr;
    } catch (error) {
      console.log("[error] => getNftTokenData() ", error);
    }
  };

  const fetchVestedInfo = async () => {
    let vestedInfo = await getVestedInfo(wallet, connection);
    console.log("==>>>>=vestedInfo==".vestedInfo);
    let nfts = [];
    let arr = [];
    for (let i = 0; i < vestedInfo.length; i++) {
      let uri = await getNftMetadataURI(
        wallet,
        connection,
        vestedInfo[i].account.nftAddr
      );
      console.log("===>>>>=vested uri=", uri);
      console.log(
        "==vest=>>>=mint====",
        vestedInfo[i].account.nftAddr.toBase58()
      );
      const nft = {
        id: 1,
        name: uri.name,
        image: uri.image,
        apy: 20,
        endsIn: "23:01:23:45",
        vested: true,
        vestingContract: "",
        mint: vestedInfo[i].account.nftAddr.toBase58(),
      };
      nfts.push(nft);

      arr.push({
        id: vestedInfo[i].account.nftAddr.toBase58(),
        uri,
        name: uri.name,
        classId: vestedInfo[i].account.classId,
        lastUpdateTime: vestedInfo[i].account.lastUpdateTime,
      });
    }
    setVestedNfts(nfts);
    setVault_items(arr);
  };

  const getClaimableRewards = async () => {
    console.log("Vault Items ************************> ", vault_items);
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
      console.log("==WARNNING==", "Please connect wallet");
      // onToastOpen(WARNNING, "Please connect wallet");
      return;
    }
    try {
      //setLoading(true);
      let res = await claimReward(wallet, connection, vault_items);
      if (res.result == "success") {
        console.log("==SUCCESS==", "Claim Reward Successfully!");
        // onToastOpen(SUCCESS, "Claim Reward Successfully!");
      } else {
        console.log("==WARNNING==", "Claim Reward Failed!");
        // onToastOpen(WARNNING, "Claim Reward Failed!");
      }

      // setLoading(false);
      // setFetchFlag(true);
    } catch (e) {
      // console.log("Claim failed", e);
      // setLoading(false);
    }
  };

  return (
    <div className="w-full flex gap-3 flex-col lg:flex-row">
      <div className="w-full lg:w-3/4 flex flex-col gap-3 dark:bg-lightBrown bg-white rounded-lg shadow-custom rounded-lg">
        <div className="flex justify-between items-center px-3 lg:px-8 mt-5">
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
             selectedTab === "vested"
               ? "bg-[#634430] text-white"
               : "bg-transparent text-[#ababab]"
           }
         `}
              onClick={() => setSelectedTab("vested")}
            >
              Vested
            </div>

            <div
              className={`w-1/3 flex items-center justify-center cursor-pointer h-full rounded-lg
           ${
             selectedTab === "unvested"
               ? "bg-[#634430] text-white"
               : "bg-transparent text-[#ababab]"
           }
         `}
              onClick={() => setSelectedTab("unvested")}
            >
              Unvested
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
                isStaked={item.vested}
                isStaking="Vesting"
                onfetchAll={fetchAll}
              />
            ))}
          </Slider>
        ) : (
          ""
        )}
        <div className="flex justify-between items-center px-4 pb-4">
          <p className="text-sm text-[#ababab]">{`Showing ${
            activeIndex + 1
          }-${Math.min(activeIndex + 3, filteredNFTs.length)} from ${
            filteredNFTs.length
          }`}</p>
          <div className="flex items-center gap-x-5  justify-start ">
            <button
              //   ref={prevButton}
              onClick={goPrev}
              className="flex justify-center items-center border-2 border-[#89785E] w-10 h-10 rounded-md"
            >
              {/* <img src="/icons/left-chevron.svg" className="w-4 h-4" alt="" /> */}
              <img
                className="w-4 h-4 hidden dark:flex"
                alt=""
                src="/icons/left-chevron.svg"
              />
              <img
                className="w-4 h-4 dark:hidden flex "
                alt=""
                src="/icons/left-chevron-light.svg"
              />
            </button>
            <button
              //   ref={nextButton}
              onClick={goNext}
              className="flex justify-center items-center border-2 border-[#89785E] w-10 h-10 rounded-md"
            >
              <img
                className="w-4 h-4 hidden dark:flex"
                alt=""
                src="/icons/right-chevron.svg"
              />
              <img
                className="w-4 h-4 dark:hidden flex "
                alt=""
                src="/icons/right-chevron-light.svg"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-1/4 gap-3">
        <div className="w-full rounded-lg p-6 dark:bg-lightBrown bg-white shadow-custom  dark:text-white text-title-light">
          <div className="flex flex-col gap-3">
            <h2 className="font-semibold text-lg">Vesting Info</h2>
            <div className="flex gap-3">
              <img
                className="w-10 h-10 hidden dark:flex"
                src="/icons/vesting.svg"
              />
              <img
                className="w-10 h-10  dark:hidden flex"
                src="/icons/vesting-light.svg"
              />

              <div className="flex flex-col">
                <div className="dark:text-subtitle-dark text-subtitle-light text-xs">
                  Total Vested
                </div>
                <div className=" text-base">7.38 SOL</div>
              </div>
            </div>

            <div className="flex gap-3">
              <img
                className="w-10 h-10 hidden dark:flex"
                src="/icons/apr.svg"
              />
              <img
                className="w-10 h-10  dark:hidden flex"
                src="/icons/apr-light.svg"
              />
              <div className="flex flex-col">
                <div className="dark:text-subtitle-dark text-subtitle-light text-xs">
                  Average APR
                </div>
                <div className=" text-base">115%</div>
              </div>
            </div>

            <div className="flex gap-3">
              <img
                className="w-10 h-10 hidden dark:flex"
                src="/icons/earning.svg"
              />
              <img
                className="w-10 h-10  dark:hidden flex"
                src="/icons/earning-light.svg"
              />
              <div className="flex flex-col">
                <div className="dark:text-subtitle-dark text-subtitle-light text-xs">
                  Total Earnings
                </div>
                <div className=" text-base">0.51 SOL</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded-lg  dark:bg-lightBrown bg-white shadow-custom p-6">
          <div className="flex flex-col gap-3 dark:text-white text-title-light">
            <h2 className="font-semibold text-lg">Withdraw</h2>
            <div className="flex gap-3">
              <img
                className="w-10 h-10 hidden dark:flex"
                src="/icons/check.svg"
              />
              <img
                className="w-10 h-10  dark:hidden flex"
                src="/icons/check-light.svg"
              />
              <div className="flex flex-col">
                <div className="dark:text-subtitle-dark text-subtitle-light text-xs">
                  Available for withdraw
                </div>
                <div className="  text-base">
                  Claim {claimableReward} tokens
                </div>
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

export default NFTVestingSection;
