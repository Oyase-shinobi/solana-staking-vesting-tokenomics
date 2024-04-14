import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import * as anchor from '@project-serum/anchor';
import * as token from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import {
    clusterApiUrl,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { Z01ZET_DECIMALS } from "../../contracts/constants";
import {
    createGlobalState,
    // updateGlobalState,
    createPoolState,
    updatePoolState,
    claimToken,
    fundReward,
    // createTokenAccount,
    getTokenFromType,
    getTotalStaked,
    // getMyStakedAndReward,
    getStateInitialized,
    getIsPoolInitialized,
    // getIsAdmin,
    getStakingAPY,
    getWithdrawFee,
    getReferalFee,
    // SOLANA_HOST,
} from '../../contracts/web3';

import {
    createVestingPool,
    createVestingState,
    fundVestingReward,
} from '../../contracts/web3_vesting';

import Button from '../Button';
import TextField from '../TextField';
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    getAccount,
} from "@solana/spl-token";

// const SOLANA_HOST = clusterApiUrl("devnet");//clusterApiUrl("devnet");
// const connection = new anchor.web3.Connection(SOLANA_HOST);

const PoolForm = ({ setIsCreate }) => {
    const wallet = useWallet();

    const [mintAddress, setMintAddress] = useState("");
    const [tokenMint, setTokenMint] = useState('');
    const [dataUpdate, setDataUpdate] = useState(false);
    const [rewardStakingAmount, setRewardStakingAmount] = useState(0);
    const [rewardVestingAmount, setRewardVestingAmount] = useState(0);
    const [rewardPerSecond, setRewardPerSecond] = useState(0);
    const [rewardMaxAmount, setRewardMaxAmount] = useState(0);
    const [maxRewardPerSecond, setMaxRewardPerSecond] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [newAuthority, setNewAuthoriy] = useState("");
    const [stakingAPY, setAPY] = useState(0);
    const [isAdmin, setAdmin] = useState(false);
    const [withdrawFee, setWithdrawFee] = useState(0);
    const [referralFee, setReferralRewardFee] = useState(0);
    const [isStateInitialized, setStateInitialized] = useState(false);
    const [isPoolInitialized, setPoolInitialized] = useState(false);
    const [userAta_balance, setUserAta_balance] = useState(0);
    const [rewardCliamAmount, setRewardCliamAmount] = useState(0);

    useEffect(() => {
        setTokenMint(getTokenFromType());
        (async () => {
            try {
                const stateInit = await getStateInitialized(wallet);
                // console.log("stateInit: ", stateInit);
                setStateInitialized(stateInit);

                const poolInit = await getIsPoolInitialized(tokenMint);
                // console.log("stateInit: ", poolInit);
                setPoolInitialized(poolInit);

                // const amount = await getTotalStaked(wallet, getTokenFromType());
                // setTotalStaked(amount);

                const apy = await getStakingAPY(wallet);
                // console.log("apy: ", apy.toString());
                setAPY(apy);

                const fee = await getWithdrawFee(wallet);
                // console.log("fee: ", fee.toString());
                setWithdrawFee(fee);

                const referal = await getReferalFee(wallet);
                // console.log("referal: ", referal.toString());
                setReferralRewardFee(referal);
            } catch (e) {
                console.log("error", e);
            }

        })();
    }, [dataUpdate]);

    useEffect(() => {
        if (!wallet || !wallet.publicKey) {
            setAdmin(false);
            return;
        }

        (async () => {
            // const adm = await getIsAdmin(wallet);
            // setAdmin(adm);
        })();
    }, [wallet, dataUpdate]);

    const onAddStakingPool = async () => {
        try {
            let txHash = await createPoolState(wallet, tokenMint, stakingAPY, referralFee, withdrawFee);
            console.log("onUpdateGlobalState", txHash);
            setDataUpdate(!dataUpdate)
        } catch (e) {
            console.error(e);
        }
    }

    const onCreateStakingState = async () => {
        try {
            let txHash = await createGlobalState(wallet);
            console.log("onCreateGlobalState", txHash);
            setDataUpdate(!dataUpdate)
        } catch (e) {
            console.error(e);
        }
    };

    const onUpdateAuthority = async () => {
        // try {
        //     let txHash = await updateGlobalState(wallet, newAuthority);
        //     console.log("onUpdateGlobalState", txHash);
        //     setDataUpdate(!dataUpdate)
        // } catch (e) {
        //     console.error(e);
        // }
    }

    const onUpdateStakingState = async () => {
        try {
            let txHash = await updatePoolState(wallet, tokenMint, stakingAPY, referralFee, withdrawFee);
            console.log("onUpdateGlobalState", txHash);
            setDataUpdate(!dataUpdate)
        } catch (e) {
            console.error(e);
        }
    }

    const onDepositStakingReward = async () => {
        try {
            let txHash = await fundReward(wallet, rewardStakingAmount, tokenMint);
            console.log("onFundReward", txHash);
            setDataUpdate(!dataUpdate);
        } catch (e) {
            console.error(e);
        }
    };

    const onClaimToken = async () => {
        try {
            await claimToken(wallet, rewardCliamAmount, tokenMint);
            setDataUpdate(!dataUpdate)
        } catch (e) {
            console.error(e);
        }
    }

    const onAddVestingPool = async () => {
        try {
            let txHash = createVestingPool(wallet, tokenMint);
            console.log(txHash);
        } catch (e) {
            console.error(e);
        }
    }

    const onCreateVestingState = async () => {
        try {
            let txHash = await createVestingState(wallet, tokenMint);
            console.log(txHash);
        } catch (e) {
            console.error(e);
        }
    };

    const onDepositVestingReward = async () => {
        try {
            let txHash = await fundVestingReward(
                wallet,
                rewardVestingAmount,
                tokenMint
            );
            console.log(txHash);
        } catch (e) {
            console.error(e);
        }
    };



    return (
        <div className="flex flex-col items-center w-full ">
            <div className="flex flex-col md:flex-row w-full gap-2 p-6">
                <div className="flex flex-col w-full gap-2 border-[0.5px] border-solid border-[#80573D] p-1">
                    <div className="h-10 flex justify-center ">
                        <h1 className='justify-center'>Token Staking</h1>
                    </div>
                    <div className="h-10">
                        <Button
                            disabled={isStateInitialized ? true : false}
                            text="Create Global State"
                            onClick={() => onCreateStakingState()}
                        />
                    </div>
                    <div className='w-full'>
                        <TextField
                            label="New Authority"
                            placeholder="0"
                            id="update-authority"
                            name="update-authority"
                            onChange={(e) => setNewAuthoriy(e.target.value)}
                        />
                        <div className="h-10 gap-2">
                            <Button
                                text="Update Authority"
                                disabled={isStateInitialized ? false : true}
                                onClick={() => onUpdateAuthority()}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='w-1/3 mx-1'>
                            <TextField
                                label="APY(%)"
                                placeholder="0"
                                type="number"
                                id="APY-value"
                                name="APY-value"
                                onChange={(e) => setAPY(e.target.value)}
                            />
                        </div>
                        <div className='w-1/3 mx-1'>
                            <TextField
                                label="Fee(%)"
                                placeholder="0"
                                type="number"
                                id="withdraw-fee"
                                name="withdraw-fee"
                                onChange={(e) => setWithdrawFee(e.target.value)}
                            />
                        </div>
                        <div className='w-1/3 mx-1'>
                            <TextField
                                label="Referral(%)"
                                placeholder="0"
                                type="number"
                                id="referral-reward"
                                name="referral-reward"
                                onChange={(e) => setReferralRewardFee(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className="h-10 w-1/2 mx-1">
                            <Button
                                text="Create Staking State"
                                disabled={isPoolInitialized ? true : false}
                                onClick={() => onAddStakingPool()}
                            />
                        </div>
                        <div className="h-10 w-1/2 mx-1">
                            <Button
                                text="Update Staking State"
                                disabled={isPoolInitialized ? false : true}
                                onClick={() => onUpdateStakingState()}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='w-1/2 mx-1'>
                            <TextField
                                label="Reward Amount"
                                placeholder="0"
                                type="number"
                                id="reward-amount"
                                name="reward-amount"
                                onChange={(e) => setRewardStakingAmount(e.target.value)}
                            />
                            <div className="h-10 gap-2">
                                <Button
                                    text="Deposit Reward"
                                    onClick={() => onDepositStakingReward()}
                                />
                            </div>
                        </div>
                        <div className='w-1/2 mx-1'>
                            <TextField
                                label="Claim Amount"
                                placeholder="0"
                                type="number"
                                id="claim-amount"
                                name="claim-amount"
                                onChange={(e) => setRewardCliamAmount(e.target.value)}
                            />
                            <div className="h-10 gap-2">
                                <Button
                                    text="Claim Reward Token"
                                    onClick={() => onClaimToken()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full gap-2 border-[0.5px] border-solid border-[#80573D] p-1">
                    <div className="h-10 flex justify-center">
                        <h1 className='justify-center'>Token Vesting</h1>
                    </div>
                    <div className="h-10">
                        <Button
                            text="Create Vesting State"
                            onClick={() => onCreateVestingState()}
                        />
                    </div>
                    <div className="h-10">
                        <Button
                            text="Add Vesting Pool"
                            onClick={() => onAddVestingPool()}
                        />
                    </div>
                    <TextField
                        label="Reward Amount"
                        placeholder="0"
                        type="number"
                        id="reward-amount"
                        name="reward-amount"
                        onChange={(e) => setRewardVestingAmount(e.target.value)}
                    />
                    <div className="h-10">
                        <Button
                            text="Deposit Reward"
                            onClick={() => onDepositVestingReward()}
                        />
                    </div>

                </div>
            </div>
            <div className="w-full flex items-center justify-center dark:bg-[#342216] bg-[#AA6C39] p-4 gap-3 shadow-[0px_-5px_30px_rgba(212,_132,_67,_0.25)] ">
                <div className="w-1/2 h-10">
                    <Button
                        text="Back"
                        variant="outline"
                        onClick={() => setIsCreate(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default PoolForm;
