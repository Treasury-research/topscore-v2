import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { message } from 'antd'
const Icon = "/static/img/topIcon.png";
const headBg1 = "/static/img/headerPro.png";
import useWeb3Context from "../../hooks/useWeb3Context";
import api from "../../api";

const HeaderBtn = (props: any) => {

  const [handlesList, setHandlesList] = useState<any>([]);

  const [isSelf, setIsSelf] = useState<boolean>(false);

  const [showShare,setShowShare] = useState<boolean>(true);

  const { account } = useWeb3Context();

  
 let prevTime = Date.now();

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

  const scrollToRef = () => {

    const charHtmlElement = document.getElementById('charcter-scroll') as HTMLElement;

    const mainHtmlElement = document.getElementById('topscore_scroll') as HTMLElement;

    mainHtmlElement.scrollTo({
      top: charHtmlElement.offsetTop - 100,
      behavior: "smooth"
    });

    setShowShare(false)

  };

  const _handleScroll = () => {
    const mainHtmlElement = document.getElementById('topscore_scroll') as HTMLElement;
      const charHtmlElement = document.getElementById('charcter-scroll') as HTMLElement;
      let nowTime = Date.now();
      if(nowTime - prevTime > 500)
      {
        if(mainHtmlElement.scrollTop < charHtmlElement.offsetTop - charHtmlElement.offsetHeight){
          setShowShare(true)
        }else{
          setShowShare(false)
        }
          prevTime = nowTime;
      }
  }

  useEffect(() => {
    const mainHtmlElement = document.getElementById('topscore_scroll') as HTMLElement;
    if(mainHtmlElement){
      mainHtmlElement.addEventListener('scroll', _handleScroll)
    }
  }, [])

  return (
    <div>
      <div>
        <img src={Icon} alt="" onClick={() => gotoMain()} />
      </div>
      {account && (
        <>
          <div className="topscore-head-main-btn bg-profile" onClick={goProfile}>

          </div>
          {/* {isSelf && props.type === 'main' ? (
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
        )} */}
          {isSelf && props.type === 'main' ? (
            <>
              {props.profileId && showShare && (
                <div
                  className="shareBtn"
                  onClick={() => scrollToRef()}
                >
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
      <div className="topscore-head-main-btn bg-lens" onClick={goRainBow}>

      </div>
    </div>
  );
};

export default HeaderBtn;
