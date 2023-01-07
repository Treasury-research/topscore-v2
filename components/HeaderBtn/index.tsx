import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {message} from 'antd'
const Icon = "/static/img/topIcon.png";
import useWeb3Context from "../../hooks/useWeb3Context";
import api from "../../api";

const HeaderBtn = (props: any) => {
  const [handlesList, setHandlesList] = useState<any>([]);
  const [isSelf, setIsSelf] = useState<boolean>(false);
  const { account } = useWeb3Context();
  const router = useRouter()

  const { address } = router.query

  const goProfile = () => {
    if (handlesList.length > 0) {
      router.push(`/user/${account}`);
    } else {
      message.info("You must have a Lens Protocol Profile");
      router.push(`/user/0x09c85610154a276a71eb8a887e73c16072029b20`);
    }
  };

  const goRainBow = () => {
    router.push(`/rainbow`);
  };

  const gotoMain = () => {
    router.push(`/rsrv`);
  };

  const getLensHandle = async () => {
    const res: any = await api.get(`/lens/handles/${account}`);
    setHandlesList(res.data);
  };

  const goMine = () => {
    router.push(`/user/${account}`);
  };

  useEffect(() => {
    if (!account) {
      return;
    }
    getLensHandle();
  }, [account]);

  useEffect(() => {
    if (!address || !account) {
      return;
    }

    setIsSelf(address === account);
  }, [address, account]);

  return (
    <div>
      <div>
        <img src={Icon} alt="" onClick={() => gotoMain()}/>
      </div>
      {account && (
        <>
        <div className="topscore-head-main-btn" onClick={goProfile}>
          Profile
        </div>
        {isSelf && props.type === 'main' ? (
          <>
            {props.profileId && (
              <div
                className="topscore-head-wallet-btn downLoadBtn"
                onClick={() => {
                  props.setDownloadModalVisible();
                }}
              >
                Download & Share
              </div>
            )}
          </>
        ) : props.type === 'main' && (
          <>
            <div
              onClick={goMine}
              className="topscore-head-wallet-btn downLoadBtn"
            >
              Check Mine
            </div>
          </>
        )}
        </>
      )}
      <div className="topscore-head-main-btn" onClick={goRainBow}>
        Lens-Rainbow
      </div>
    </div>
  );
};

export default HeaderBtn;
