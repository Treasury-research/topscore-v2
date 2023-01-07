import React, { useState, useEffect } from "react";
import api from "../../api";
import useWeb3Context from "../../hooks/useWeb3Context";
import Wallet from "../../components/WalletBtn";
const BotText = "/static/img/botText.gif";
const BotLeftText = "/static/img/botLeftText.gif";
const imgHead = "/static/img/rsrv-head.png";
const radorImg = '/static/img/radar.png'
const ImgWrapped = '/static/img/wrapped.png'
const ImgLens = '/static/img/lens.png'
const ImgAlmost = '/static/img/almost.png'
const ImgYour = '/static/img/your.png'
const ImgMobile = '/static/img/mobile-tc.png'
const ImgGenerate = "/static/img/generate-button.gif";
const ImgHoverGenerate = "/static/img/hover-generate-button.gif";
import { DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import Radar from "./components/Radar";
import { useRouter } from "next/router";
import { Dropdown, Space, Menu, Drawer, Pagination, Modal, message } from "antd";

const typeList = ['Influence', 'Campaign', 'Engagement', 'Creation', 'Collection', 'Curation'];
const rankList = [{
  name: '???',
  score: '???'
},
{
  name: '???',
  score: '???'
},
{
  name: '???',
  score: '???'
},
{
  name: '???',
  score: '???'
},
{
  name: '???',
  score: '???'
},
{
  name: '???',
  score: '???'
}]
export default function Main() {
  const { account, connectWallet } = useWeb3Context();
  const [showList, setShowList] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHoverRadar, setIsHoverRadar] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [activeName, setActiveName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const onClose = () => {
    setShowList(false);
    setActiveName('');
    setMenuOpen(false);
  };

  // const postReserve = async (address: string) => {
  //   if (reserving) {
  //     return
  //   }
  //   try {
  //     setReserving(true)
  //     await log("reserve", address)
  //     setIsOpen(true);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setReserving(false)
  //   }
  // }

  const doReserve = async () => {
    message.info('Revervation ended');
    return

    // if (!account) {
    //   try {
    //     message.info('Revervation ended');
    //     // const connectedAddress: string = await connectWallet();
    //     // if (connectedAddress) {
    //     //   postReserve(connectedAddress);
    //     // }
    //   } catch (err) {
    //     console.log('rejected')
    //   }
    // } else {
    //   // postReserve(account);
    // }
  }

  const postGenerate = async (address: string) => {
    const res:any = await api.get(`/lens/handles/${address}`);
    if (res.data.length > 0) {
      router.push(`/user/${address}`);
    } else {
      message.info("You must have a Lens Protocol Profile");
      router.push(`/user/0x09c85610154a276a71eb8a887e73c16072029b20`);
    }
  }

  const doGenerate = async () => {
    if (!account) {
      try {
        const connectedAddress: string = await connectWallet();
        if (connectedAddress) {
          postGenerate(connectedAddress);
        }
      } catch (err) {
        console.log('rejected')
      }
    } else {
      postGenerate(account);
    }
  }

  return (
    <div className="rsrv-content">
      <div className="rsrv">
        <div className="rsrv-head">
          <Wallet/>
        </div>
        <div className="des-1"><img src={ImgWrapped} alt="" /></div>
        <div className="des-2"><img src={ImgYour} alt="" /></div>
        <div className="des-3"><img src={ImgLens} alt="" /></div>
        <div className="rsrv-content">
          <div className="rsrv-main">
            <div className="top-rador">
              <div>
                <Radar id="top-rador" width={"100%"} height={"100%"} showList={(name: string) => {setShowList(true); setActiveName(name)}} />
              </div>
              <div className="top-rador-info">
                <div className="rador-info">
                  <div>
                    <div>
                      <div>
                        <p>?</p>
                        <p>Rank</p>
                      </div>
                      <div>
                        <p>?</p>
                        <p>Following</p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <p>?</p>
                        <p>Score</p>
                      </div>
                      <div>
                        <p>?</p>
                        <p>Followers</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        <p>?</p>
                        <p>Collections</p>
                      </div>
                      <div>
                        <p>?</p>
                        <p>Publications</p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <p>?</p>
                        <p>Collected</p>
                      </div>
                      <div className="diff-sty-info">
                        <p><span>?</span><span>Posts</span></p>
                        <p><span>?</span><span>Comments</span></p>
                        <p><span>?</span><span>Mirrors</span></p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="appint-gif-1">
                {
                  !isHoverRadar &&
                  <div onMouseEnter={() => setIsHoverRadar(true)}>
                    <img src={ImgGenerate} alt="" />
                  </div>
                }
                {
                  isHoverRadar &&
                  <div onMouseLeave={() => setIsHoverRadar(false)}>
                    <img src={ImgHoverGenerate} alt="" onClick={doGenerate} />
                  </div>
                }
              </div>
              <Drawer title="" placement="right" onClose={onClose} open={showList} closable={false}>
                <div className="drawer">
                  <div className="rightOut" onClick={() => { setShowList(false); setActiveName('') }}><RightOutlined /></div>
                  <Dropdown
                    open={menuOpen}
                    overlay={
                      <Menu className="drop-wrapper">
                        {
                          typeList.filter(item => item !== activeName).map((t, i) =>
                            <div
                              className="drop-menu"
                              onClick={() => { setActiveName(t === '???' ? '' : t) ;setMenuOpen(false)}}
                              key={i}
                            >
                              {t}
                            </div>
                          )
                        }
                      </Menu>
                    }
                  >
                    <a onClick={(e) =>  setMenuOpen(true)}>
                      <Space className="space overall">
                        <span className="list-type">{activeName || 'Overall'}</span>
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                  {
                    rankList.map((t, i) =>
                      <div className="rank-item" key={i}>
                        <span>{i + 1}</span>
                        <span><img src={imgHead} alt="" /></span>
                        <span>{t.name}</span>
                        <span className="rank-item-radar-img"><img src={radorImg} alt="" /></span>
                        <span>Score: {t.score}</span>
                      </div>
                    )
                  }
                  <div className="pagination">
                    <Pagination simple total={50} disabled />
                  </div>
                </div>
              </Drawer>
              <Modal
                title=""
                open={isOpen}
                footer={null}
                onCancel={() => setIsOpen(false)}
                width={700}
                className="modal-bg"
              >
                <div className="notify-btn" onClick={() => window.open('https://sm1f0asueon.typeform.com/to/uT23cD90')}>Notify me by email</div>
              </Modal>
            </div>
          </div>
          <div className="leftOut" onClick={() => { setShowList(true) }}><LeftOutlined /></div>
          <div className="des-4"><img src={ImgAlmost} alt="" /></div>
          <div className="des-bottom">
            <div>
              <img src={BotLeftText} alt="" />
            </div>
            <div><img src={BotText} alt="" /></div>
          </div>
        </div>
      </div>
      <div className="mobile-rsrv">
        <div className="img-top">
          <img src={BotLeftText} alt="" />
        </div>
        <div className="content">
          <div className="text1">YOUR 2022 WRAPPED</div>
          <div className="text2">ON LENS</div>
          <div><img src={ImgMobile} alt="" /></div>
          <div className="text3">
            <div>IS ALMOST</div>
            <div>HERE</div>
          </div>
          <div className="img-bottom">
            <img src={BotText} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
