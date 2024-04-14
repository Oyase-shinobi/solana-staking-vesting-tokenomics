import { Link } from "react-router-dom";
import { NavLink, useLocation } from "react-router-dom";
import DashboardIcon from "../icons/DashboardIcon";
import VestingIcon from "../icons/VestingIcon";
import StakePoolIcon from "../icons/StakePoolIcon";
import StakingIcon from "../icons/StakingIcon";
import SettingsIcon from "../icons/SettingsIcon";
import ThemeToggleBtn from "./ThemeToggle";
import clsx from "clsx";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect, useMemo, useCallback, useQuery } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ADMINWALLET } from "../contracts/constants";
import {
  PublicKey,
  Keypair,
  Connection,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  sendAndConfirmRawTransaction,
} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

const SliderBar = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const SOLANA_HOST = clusterApiUrl("devnet");
  const connection = new anchor.web3.Connection(SOLANA_HOST);

  const wallet = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);

  const getAdmin = () => {
    if (wallet.publicKey == ADMINWALLET.toBase58()) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    getAdmin();
  }, [connection, wallet]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-secondary-bg dark:bg-secondary-dark-bg font-bold text-[#6B5D53]  dark:text-[#EFEFEF]">
      <div className="min-h-screen flex flex-col mx-6">
        <div className="grid w-full ">
          <div className="branding-header my-5">
            <Link
              to="/dashboard"
              className="MuiTypography-root MuiLink-root justify-self-start MuiLink-underlineHover MuiTypography-colorPrimary"
            >
              <img
                className="w-4/5 h-24 mx-auto hidden dark:flex"
                src="/icons/Logo.svg"
                alt="no image"
              />
              <img
                className="w-4/5 h-24 mx-auto dark:hidden flex"
                src="/icons/logo-light.svg"
                alt="no image"
              />
            </Link>
          </div>
        </div>
        <div className="dapp-sidebar flex flex-1 flex-col justify-between">
          <div className="">
            <div className="dapp-menu-links my-5">
              <div className="flex flex-col gap-2 dapp-nav my-1 ">
                <div
                  className={`hover:bg-[#CD8143] active:bg-[#976237] focus:outline-none focus:ring focus:ring-violet-300 w-full rounded h-full pl-3 ${
                    location.pathname == "/dashboard"
                      ? "bg-[#CD8143]/10 text-[#CD8143] hover:text-white"
                      : ""
                  }`}
                >
                  <Link
                    to="/dashboard"
                    className="MuiTypography-root MuiLink-root MuiLink-underlineHover button-dapp-menu MuiTypography-colorPrimary active my-3 bg-red-400"
                  >
                    <div className="flex py-4 gap-1 font-normal ">
                      <DashboardIcon
                        isActive={location.pathname == "/dashboard"}
                      />
                      <p
                        className={clsx(
                          "z-10  w-full  bg-transparent",
                          location.pathname == "/dashboard"
                            ? "[text-shadow:_10px_0px_20px_#E98431]"
                            : ""
                        )}
                      >
                        Dashboard
                      </p>
                    </div>
                  </Link>
                </div>

                <div
                  className={`hover:bg-[#CD8143] active:bg-[#976237] focus:outline-none focus:ring focus:ring-violet-300 w-full rounded h-full pl-3 ${
                    location.pathname == "/vesting"
                      ? "bg-[#CD8143]/10 text-[#CD8143] hover:text-white"
                      : ""
                  }`}
                >
                  <Link
                    to="/vesting"
                    className="MuiTypography-root MuiLink-root MuiLink-underlineHover button-dapp-menu MuiTypography-colorPrimary active"
                  >
                    <div className="flex py-4 gap-1 font-normal">
                      <VestingIcon isActive={location.pathname == "/vesting"} />
                      <p
                        className={clsx(
                          "z-10  w-full  bg-transparent",
                          location.pathname == "/vesting"
                            ? "[text-shadow:_10px_0px_20px_#E98431]"
                            : ""
                        )}
                      >
                        Vesting
                      </p>
                    </div>
                  </Link>
                </div>
                <div
                  className={`hover:bg-[#CD8143] active:bg-[#976237] focus:outline-none focus:ring focus:ring-violet-300 w-full rounded h-full pl-3 ${
                    location.pathname == "/staking"
                      ? "bg-[#CD8143]/10 text-[#CD8143] hover:text-white"
                      : ""
                  }`}
                >
                  <Link
                    to="/staking"
                    className="MuiTypography-root  MuiLink-root MuiLink-underlineHover button-dapp-menu MuiTypography-colorPrimary"
                  >
                    <div className="flex py-4 gap-1 font-normal">
                      <StakingIcon isActive={location.pathname == "/staking"} />
                      <p
                        className={clsx(
                          "z-10  w-full  bg-transparent",
                          location.pathname == "/staking"
                            ? "[text-shadow:_10px_0px_20px_#E98431]"
                            : ""
                        )}
                      >
                        Staking
                      </p>
                    </div>
                  </Link>
                </div>
                {isAdmin && (
                  <div
                    className={`hover:bg-[#CD8143] active:bg-[#976237] focus:outline-none focus:ring focus:ring-violet-300 w-full rounded h-full pl-3 ${
                      location.pathname == "/poolcreation"
                        ? "bg-[#CD8143]/10 text-[#CD8143] hover:text-white"
                        : ""
                    }`}
                  >
                    <Link
                      to="/poolcreation"
                      className="MuiTypography-root my-5 MuiLink-root MuiLink-underlineHover button-dapp-menu MuiTypography-colorPrimary"
                    >
                      <div className="flex py-4 gap-1 font-normal">
                        <StakePoolIcon
                          isActive={location.pathname == "/poolcreation"}
                        />
                        <p
                          className={clsx(
                            "z-10  w-full  bg-transparent",
                            location.pathname == "/poolcreation"
                              ? "[text-shadow:_10px_0px_20px_#E98431]"
                              : ""
                          )}
                        >
                          Stake Pool Creation
                        </p>
                      </div>
                    </Link>
                  </div>
                )}
                {isAdmin && (
                <div
                  className={`hover:bg-[#CD8143] active:bg-[#976237] focus:outline-none focus:ring focus:ring-violet-300 w-full rounded h-full pl-3 ${
                    location.pathname == "/setting"
                      ? "bg-[#CD8143]/10 text-[#CD8143] hover:text-white"
                      : ""
                  }`}
                >
                  <Link
                    to="/setting"
                    className="MuiTypography-root my-5 MuiLink-root MuiLink-underlineHover button-dapp-menu MuiTypography-colorPrimary"
                  >
                    <div className="group flex py-4 gap-1 font-normal hover:text-[#755942] relative">
                      <SettingsIcon
                        isActive={location.pathname == "/setting"}
                      />
                      <p
                        className={clsx(
                          "z-10  w-full  bg-transparent",
                          location.pathname == "/setting"
                            ? "[text-shadow:_10px_0px_20px_#E98431]"
                            : ""
                        )}
                      >
                        Setting
                      </p>
                    </div>
                  </Link>
                </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-col grid my-5">
            <div className="dapp-menu-doc-link flex flex-row my-2">
              <div className="MuiTypography-root MuiLink-root MuiLink-underlineHover w-full flex flex-row justify-between MuiTypography-colorPrimary">
                <div className="flex items-center gap-x-2">
                  {!isDarkMode ? (
                    <img
                      className="size-5"
                      alt="no image"
                      src="/icons/dark.svg"
                    />
                  ) : (
                    <img
                      className="size-5"
                      alt="no image"
                      src="/icons/light.svg"
                    />
                  )}

                  <p className="my-1 ">
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </p>
                </div>
                <ThemeToggleBtn />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderBar;
