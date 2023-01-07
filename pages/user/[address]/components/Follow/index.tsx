import React, { useEffect, useState } from "react";
import ApproveButton from "../../../../../components/ApproveButton";
import useWeb3Context from "../../../../../hooks/useWeb3Context";
import useLenshubContract from "../../../../../contract/useLenshubContract";
import useErc20Contract from "../../../../../contract/useErc20Contract";
import log from "../../../../../lib/log";
import useErc721Contract, {
} from "../../../../../contract/useErc721Contract";
import BN from "bignumber.js";
import useFeeFollowContract from "../../../../../contract/useFeeFollowContract";
import lensApi from "../../../../../lib/lensApi";
import config from "../../../../../config";

export default function Lens({ profileId, handle }: any) {
  const [followBalance, setFollowBalance] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(true);
  const [profileInfo, setProfileInfo] = useState<any>({});
  const [feeInfo, setFeeInfo] = useState<any>({});
  const [tokenInfo, setTokenInfo] = useState<any>({});
  const lenshubContract = useLenshubContract();
  const erc721Contract = useErc721Contract();
  const erc20Contract = useErc20Contract();
  const feeFollowContract = useFeeFollowContract();
  const { account, chainId } = useWeb3Context();

  const doFollow = async () => {
    console.log("fff", profileId, feeInfo);
    const res: any = await lenshubContract.follow(profileId, feeInfo);
    if (res) {
      setFollowBalance((prev: any) => {
        prev.push(res.events.Transfer.returnValues.tokenId);
        return [...prev];
      });
      log('follow', account || '')
    }
  };

  const doUnfollow = async () => {
    const res: any = await erc721Contract.burn(
      profileInfo.followNftAddress,
      followBalance[0]
    );
    if (res) {
      setFollowBalance((prev: any) => {
        prev.splice(0, 1);
        return [...prev];
      });
    }
  };

  const getProfile = async () => {
    setLoading(true);
    const profileInfoRaw = await lensApi.getProfileByHandle(handle);
    setProfileInfo(profileInfoRaw);
    setLoading(false);

    const followBalanceRaw = await erc721Contract.getAll(
      profileInfoRaw.followNftAddress
    );
    setFollowBalance(followBalanceRaw);

    const feeInfoRaw = await feeFollowContract.getProfileData(profileId);

    setFeeInfo(feeInfoRaw);
  };

  const getTokenInfo = async () => {
    const symbol = await erc20Contract.symbol(feeInfo.currency);
    const decimals = await erc20Contract.decimals(feeInfo.currency);
    setTokenInfo({
      symbol,
      decimals,
    });
  };

  useEffect(() => {
    if (!feeInfo.amount || feeInfo.amount === "0") {
      return;
    }
    getTokenInfo();
  }, [feeInfo]);

  useEffect(() => {
    if (!profileId || !handle) {
      return;
    }
    getProfile();
  }, [profileId, handle, chainId]);

  return followBalance.length === 0 ? (
    <>
      <ApproveButton
        skipCheck={!feeInfo || !feeInfo.amount || feeInfo.amount === "0"}
        tokenAddress={feeInfo.currency}
        contractAddress={config.contracts.lenshub}
      >
        <div className="topscore-head-wallet-btn" onClick={doFollow}>
          Follow{` `}
          {feeInfo.amount && tokenInfo.symbol && (
            <>
              (
              {new BN(feeInfo.amount).shiftedBy(-tokenInfo.decimals).toString()}{" "}
              {tokenInfo.symbol})
            </>
          )}
        </div>
      </ApproveButton>
    </>
  ) : (
    <div className={"topscore-head-wallet-btn"}>Following</div>
  );
}
