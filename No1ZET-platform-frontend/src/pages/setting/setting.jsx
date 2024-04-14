import Button from "../../components/Button";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import TextField from "../../components/TextField";
import {
  distributeTokens,
  showToast,
} from "../../contracts/web3_tokenomics"
import { useWallet } from '@solana/wallet-adapter-react';
import {
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

export const SettingPage = () => {
  const wallet = useWallet();
  const [PartnerShips, setParterShip] = useState("");
  const [ShareHolders, setShareHolders] = useState("");
  const [Advisors, setAdvisors] = useState("");
  const [Private, setPrivate] = useState("");
  const [Public, setPublic] = useState("");
  const [Reserve, setReserve] = useState("");
  const [amount, setAmount] = useState();

  const handleSendTransaction = async () => {
    if (amount == 0) {
      showToast("Input the distribute amount", 2000, 1);
      return;
    }

    let tx = await distributeTokens(wallet, PartnerShips, ShareHolders, Private, Public, Reserve, Advisors, amount);
    console.log("tx: ", tx);
  };

  return (
    <div className="h-full flex justify-center">
      <div className="max-w-7xl lg:mx-24 mx-4 lg:px-4 px-2 flex flex-col w-[100%]">
        <h className=" dark:text-white text-title-light my-5 font-semibold">Tokenomics</h>
        <div className="dark:text-white text-title-light my-5 font-semibold text-5 w-[100%]">
          <TextField
            label="PARTNERSHIPS"
            placeholder="PARTNERSHIPS wallet address"
            type="text"
            id="reward-max-supply"
            name="reward-max-supply"
            onChange={(ev) => setParterShip(ev.target.value)}
          />
          <TextField
            label="SHAREHOLDERS"
            placeholder="SHAREHOLDERS wallet address"
            type="text"
            id="max-reward-seconds"
            name="max-reward-seconds"
            onChange={(ev) => setShareHolders(ev.target.value)}
          />
          <TextField
            label="ADVISORS"
            placeholder="ADVISORS wallet address"
            type="text"
            id="max-reward-seconds"
            name="max-reward-seconds"
            onChange={(ev) => setAdvisors(ev.target.value)}
          />
          <TextField
            label="PRIVATE"
            placeholder="PRIVATE wallet address"
            type="text"
            id="max-reward-seconds"
            name="max-reward-seconds"
            onChange={(ev) => setPrivate(ev.target.value)}
          />
          <TextField
            label="PUBLIC"
            placeholder="PUBLIC wallet address"
            type="text"
            id="max-reward-seconds"
            name="max-reward-seconds"
            onChange={(ev) => setPublic(ev.target.value)}
          />
          <TextField
            label="RESERVE"
            placeholder="RESERVE wallet address"
            type="text"
            id="max-reward-seconds"
            name="max-reward-seconds"
            onChange={(ev) => setReserve(ev.target.value)}
          />
          <TextField
            label="Distribute Amount"
            placeholder="Distribute Total Amount"
            type="number"
            id="max-reward-seconds"
            name="max-reward-seconds"
            onChange={(ev) => setAmount(ev.target.value)}
          />
          <div className="w-full h-11 px-6 flex flex-row justify-center my-10">
            <button text="Distribute" className="mx-2 relative rounded-[8px]   text-white text-1xl w-1/2 h-full 
      opacity-100 bg-gradient-to-r dark:from-[#994D0E] dark:to-[#E2914F] from-[#D97A2B] to-[#E2914F]" onClick={handleSendTransaction}>Distribute</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingPage;
