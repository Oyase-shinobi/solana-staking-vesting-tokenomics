import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import clsx from "clsx";
import ThemeToggleBtn from "./ThemeToggle";
import DashboardIcon from "../icons/DashboardIcon";
import VestingIcon from "../icons/VestingIcon";
import StakingIcon from "../icons/StakingIcon";
import StakePoolIcon from "../icons/StakePoolIcon";
import SettingsIcon from "../icons/SettingsIcon";
import { useTheme } from "./ThemeProvider";

const truncateString = (str) => {
  if (str.length <= 12) {
    return str;
  }
  return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
};

const Header = () => {
  return (
    <header className="w-full">
      <div className="hidden lg:flex w-full">
        <DesktopHeader />
      </div>
      <div className="flex lg:hidden w-full">
        <MobileHeader />
      </div>
    </header>
  );
};

const DesktopHeader = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState(12);
  return (
    <div className="flex items-center justify-between text-white my-8 w-full">
      <div className="time-menu-root mx-10 max-w-lg lg:max-w-xl w-full">
        <div className="time-menu-btn bg-[#] rounded bg-cover bg-center bg-no-repeat text-white text-2xl w-full max-w-lg lg:max-w-xl">
        </div>
      </div>
      <div className="relative mx-10">
        <div className="rounded-2">
          <WalletMultiButton />
        </div>
      </div>
    </div>
  );
};

const MobileHeader = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode } = useTheme();
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    });

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", () => {
        if (window.innerWidth > 1024) {
          setIsMenuOpen(false);
        }
      });
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);

    return () => {
      setIsMenuOpen(false);
    };
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-between text-white h-20 w-full px-5">
      <div className="flex items-center justify-between w-full ">
        <div className="grid">
          <div className="branding-header w-52">
            <Link
              to="/dashboard"
              className="MuiTypography-root MuiLink-root justify-self-center MuiLink-underlineHover MuiTypography-colorPrimary"
            >
              <img
                className=" h-16 mx-auto hidden dark:flex"
                src="/icons/Logo.svg"
                alt="no image"
              />
              <img
                className="h-16 mx-auto dark:hidden flex"
                src="/icons/logo-light.svg"
                alt="no image"
              />
            </Link>
          </div>
        </div>
        <button onClick={() => setIsMenuOpen(true)} className="relative">
          <img src="/icons/menu-icon-dark.svg" alt="menu icon" />
        </button>
      </div>

      <div
        className={clsx(
          "fixed  min-h-screen flex w-full max-w-screen overflow-x-hidden transition-all transform duration-500 ease-in-out z-50 top-0 left-0 bg-secondary-bg dark:bg-secondary-dark-bg flex-col gap-4 px-4 text-white",
          isMenuOpen ? " translate-x-0" : " -translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-20 ">
          <div className="branding-header w-48">
            <Link
              to="/dashboard"
              className="MuiTypography-root MuiLink-root justify-self-center MuiLink-underlineHover MuiTypography-colorPrimary"
            >
              <img
                className=" h-14 mx-auto hidden dark:flex"
                src="/icons/Logo.svg"
                alt="no image"
              />
              <img
                className="h-16 mx-auto dark:hidden flex"
                src="/icons/logo-light.svg"
                alt="no image"
              />
            </Link>
          </div>
          <button onClick={() => setIsMenuOpen(false)}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.9166 2.08087L17.9191 0.083374L9.99992 8.00254L2.08075 0.083374L0.083252 2.08087L8.00242 10L0.083252 17.9192L2.08075 19.9167L9.99992 11.9975L17.9191 19.9167L19.9166 17.9192L11.9974 10L19.9166 2.08087Z"
                fill="#AA6C39"
              />
            </svg>
          </button>
        </div>

        <div className="dapp-sidebar flex flex-1 flex-col justify-between">
          <div className="text-primary-dark-bg dark:text-white">
            <div className="dapp-menu-links my-5">
              <div className="flex flex-col gap-2 dapp-nav my-1 ">
                <div
                  className={`hover:bg-[#482f1e] active:bg-[#976237] focus:outline-none focus:ring focus:ring-violet-300 w-full rounded h-full pl-3 ${
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
                      Dashboard
                    </div>
                  </Link>
                </div>

                <div
                  className={`hover:bg-[#482f1e] active:bg-[#976237] focus:outline-none focus:ring focus:ring-violet-300 w-full rounded h-full pl-3 ${
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
                      Vesting
                    </div>
                  </Link>
                </div>
                <div
                  className={`hover:bg-[#482f1e] active:bg-[#976237] focus:outline-none focus:ring focus:ring-violet-300 w-full rounded h-full pl-3 ${
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
                      Staking
                    </div>
                  </Link>
                </div>
                <div
                  className={`hover:bg-[#482f1e] active:bg-[#976237] focus:outline-none focus:ring focus:ring-violet-300 w-full rounded h-full pl-3 ${
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
                      Stake Pool Creation
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-col grid my-5 text-primary-dark-bg dark:text-white">
            <div className="dapp-menu-doc-link flex flex-row my-2">
              <a
                className="MuiTypography-root MuiLink-root MuiLink-underlineHover  flex flex-row items-center gap-x-2 MuiTypography-colorPrimary"
                href="https://docs.syncus.fi/"
                target="_blank"
              >
                <svg
                  fill="none"
                  className={clsx(
                    "size-5",
                    isDarkMode ? "text-[#816752]" : "text-[#ECD3BE]"
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 10L15 10M15 10L13 8M15 10L13 12M11 14L11 17C11 18.1046 10.1046 19 9 19L3 19C1.89543 19 1 18.1046 1 17L1 3C1 1.89543 1.89543 1 3 1L9 1C10.1046 1 11 1.89543 11 3L11 6"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>

                <p className="my-1">Logout</p>
              </a>
            </div>
            <div className="dapp-menu-doc-link flex flex-row my-2">
              <div className="MuiTypography-root MuiLink-root MuiLink-underlineHover w-full flex flex-row gap-x-5 MuiTypography-colorPrimary">
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

export default Header;
