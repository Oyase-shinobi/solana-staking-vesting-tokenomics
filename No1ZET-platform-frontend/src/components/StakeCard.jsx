import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useSearchParams } from 'react-router-dom';

import * as anchor from '@project-serum/anchor';
import * as token from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

import {
  claim_staking,
  createPool,
  createState,
  fundReward,
  getIsAdmin,
  getIsPoolInitialized,
  getMyStakedAndReward,
  getPoolPoint,
  getStateInitialized,
  getTokenFromType,
  getTotalStaked,
  stake,
  unstake,
} from '../contracts/web3';
import Button from './Button';

const StakeCard = ({ heading, disable }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const SOLANA_HOST = clusterApiUrl("devnet");
    const connection = new anchor.web3.Connection(SOLANA_HOST);

    const wallet = useWallet();

    const tokenMint = useMemo(() => {
        return getTokenFromType(heading);
    }, [heading]);

    const [stakingAmount, setStakingAmount] = useState("");
    const [unstakingAmount, setUnstakingAmount] = useState("");
    const [rewardFundAmount, setRewardFundAmount] = useState("");
    const [poolPoint, setPoolPoint] = useState("");
    const [dataUpdate, setDataUpdate] = useState(false);
    const [totalStaked, setTotalStaked] = useState(0);
    const [myStaked, setMyStaked] = useState(0);
    const [myReward, setMyReward] = useState(0);
    const [isStateInitialized, setStateInitialized] = useState(false);
    const [isPoolInitialized, setPoolInitialized] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [userAta_balance, setUserAta_balance] = useState(0);

    const fetchBalance = useCallback(async () => {
        try {
            const balance1 = await connection.getBalance(wallet.publicKey);
            setWalletBalance(balance1 / LAMPORTS_PER_SOL);
            const mint = tokenMint;

            const userAta = await token.getOrCreateAssociatedTokenAccount(
                connection,
                wallet,
                mint,
                wallet.publicKey,
                false
            );
            const userAta_balance = parseInt(userAta.amount) / LAMPORTS_PER_SOL;
            setUserAta_balance(userAta_balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }, [connection, wallet]);

    useEffect(() => {
        fetchBalance();
    }, [connection, wallet]);
    useEffect(() => {}, [heading]);

    useEffect(() => {
        (async () => {
            const stateInit = await getStateInitialized();
            setStateInitialized(stateInit);
        })();
    }, []);

    useEffect(() => {
        if (!wallet || !wallet.publicKey) {
            setAdmin(false);
            setStateInitialized(true);
            setMyStaked(0);
            setMyReward(0);
            return;
        }

        (async () => {
            const adm = await getIsAdmin(wallet);

            setAdmin(adm);
        })();
    }, [wallet]);

    useEffect(() => {
        (async () => {
            const poolInit = await getIsPoolInitialized(tokenMint);
            setPoolInitialized(poolInit);

            const amount = await getTotalStaked(tokenMint);
            setTotalStaked(amount);
        })();
    }, [tokenMint]);

    useEffect(() => {
        (async () => {
            const [amount, reward_amount] = await getMyStakedAndReward(
                wallet,
                tokenMint
            );
            setMyStaked(amount);
            setMyReward(reward_amount);

            const point = await getPoolPoint(wallet, tokenMint);
            setPoolPoint(point);
        })();
    }, [wallet, dataUpdate]);

    const onStake = async () => {
        let referral = getRef();
        if (referral === null) referral = wallet.publicKey.toString();
        try {
            await stake(wallet, stakingAmount, tokenMint, referral);
            setDataUpdate(!dataUpdate);
        } catch (e) {
            console.error(e);
        }
    };

    const onUnstake = async () => {
        let referral = getRef();
        if (referral === null) referral = wallet.publicKey.toString();
        try {
            setDataUpdate(!dataUpdate);
            await unstake(wallet, unstakingAmount, tokenMint, referral);
        } catch (e) {
            console.error(e);
        }
    };

    const getRef = () => {
        const ref = searchParams.get("ref");
        return ref;
    };

    const onClaim = async () => {
        let referral = getRef();
        try {
            await claim_staking(wallet, tokenMint);
            setDataUpdate(!dataUpdate);
        } catch (e) {
            console.error(e);
        }
    };

    const onCreateState = async () => {
        try {
            let txHash = await createState(wallet, tokenMint);
        } catch (e) {
            console.error(e);
        }
    };

    const onCreatePool = async () => {
        try {
            createPool(wallet, tokenMint);
        } catch (e) {
            console.error(e);
        }
    };

    const onFundReward = async () => {
        try {
            fundReward(wallet, rewardFundAmount, tokenMint);
        } catch (e) {
            console.error(e);
        }
    };

    const getAdminPanelVisibility = () => {
        if (!wallet || !wallet.publicKey) return false;
        if (isAdmin) return true;
        if (!isStateInitialized) return true;
        return false;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 grid justify-items-center">
            <div className="w-[60%]">
                <div className="bg-[#111422] lg:rounded-[36px] sm:rounded-[28px] rounded-3xl text-white py-3 px-4 md:px-7 lg:px-10 bg-[#111422] justify-self-center">
                    <h3 className="text-3xl">Token Staking</h3>
                    <div className="pt-4 pb-2">
                        <img src="/dash-line.png" alt="dash-line" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-7 justify-between">
                            <div>
                                <p className="md:text-xl">My SOL Balance :</p>
                            </div>
                            <div className="bg-[#000000] w-3/5 p-1">
                                <p className="text-lg sm:text-2xl">
                                    {walletBalance}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-7 justify-between">
                            <div>
                                <p className="md:text-xl">My Token Balance:</p>
                            </div>
                            <div className="bg-[#000000] w-3/5 p-1">
                                <p className="text-lg sm:text-2xl">
                                    {userAta_balance}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-7 justify-between">
                            <div>
                                <p className="md:text-xl">My Staked :</p>
                            </div>
                            <div className="bg-[#000000] w-3/5 p-1">
                                <p className="text-lg sm:text-2xl">
                                    {myStaked}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-7 justify-between">
                            <div>
                                <p className="md:text-xl"> Reward :</p>
                            </div>
                            <div className="bg-[#000000] w-3/5 p-1">
                                <p className="text-lg sm:text-2xl">
                                    {myReward}
                                </p>
                            </div>
                        </div>
                    </div>
                    {wallet != null &&
                        wallet.publicKey != null &&
                        (isAdmin || !isStateInitialized) && (
                            <div className="flex justify-between mt-5 mb-3 space-x-3">
                                <div className="basis-1/2">
                                    <Button
                                        text="Create State"
                                        disable={
                                            isStateInitialized
                                                ? "true"
                                                : "false"
                                        }
                                        onClick={onCreateState}
                                    />
                                </div>
                                <div className="basis-1/2">
                                    <Button
                                        text="Create Pool"
                                        disable={
                                            isPoolInitialized ? "true" : "false"
                                        }
                                        onClick={onCreatePool}
                                    />
                                </div>
                            </div>
                        )}

                    {wallet != null &&
                        wallet.publicKey != null &&
                        (isAdmin || !isStateInitialized) && (
                            <div className="flex justify-between mt-5 mb-3 space-x-3">
                                <div className="basis-1/2">
                                    <input
                                        type="number"
                                        className="bg-[#000000] text-white font-jone leading-1 text-xl w-full focus:outline-none border-none text-right px-2"
                                        placeholder="Amount"
                                        value={rewardFundAmount}
                                        onChange={(ev) =>
                                            setRewardFundAmount(ev.target.value)
                                        }
                                    />
                                </div>
                                <div className="basis-1/2">
                                    <Button
                                        text="Fund Reward"
                                        onClick={onFundReward}
                                    />
                                </div>
                            </div>
                        )}

                    <div className="flex justify-between mt-5 mb-3 space-x-3">
                        <div className="basis-1/2">
                            <input
                                type="number"
                                className="bg-[#000000] text-white font-jone leading-1 text-xl w-full focus:outline-none border-none text-right px-2"
                                placeholder="Amount"
                                value={stakingAmount}
                                onChange={(ev) =>
                                    setStakingAmount(ev.target.value)
                                }
                            />
                        </div>
                        <div className="basis-1/2">
                            <Button text="Stake" onClick={onStake} />
                        </div>
                    </div>

                    <div className="flex justify-between mt-5 mb-3 space-x-3">
                        <div className="basis-1/2">
                            <input
                                type="number"
                                className="bg-[#000000] text-white font-jone leading-1 text-xl w-full focus:outline-none border-none text-right px-2"
                                placeholder="Amount"
                                value={unstakingAmount}
                                onChange={(ev) =>
                                    setUnstakingAmount(ev.target.value)
                                }
                            />
                        </div>
                        <div className="basis-1/2">
                            <Button text="Unstake" onClick={onUnstake} />
                        </div>
                    </div>

                    <div className="flex justify-center mt-5 mb-3 space-x-3">
                        <div className="basis-1/2">
                            <Button text="Claim" onClick={onClaim} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StakeCard;
