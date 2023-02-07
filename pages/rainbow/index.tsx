import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import useWeb3Context from "../../hooks/useWeb3Context";
import config from "../../config";
import useErc721Contract from "../../contract/useErc721Contract";
import Wallet from "../../components/WalletBtn";
const ImgToRight = "/static/img/toRight.png";
const ImgToLeft = "/static/img/toLeft.png";
const ImgOpenResult = "/static/img/openResult.png";
const ImgBgStory = "/static/img/bg-story-1.gif";
const ImgWhole = "/static/img/whole-top.png";
import HeaderBtn from "../../components/HeaderBtn";
import { Modal, Carousel } from "antd";

export default function Character() {
  const { account, connectWallet } = useWeb3Context();

  const erc721Contract = useErc721Contract();

  const [step, setStep] = useState(1);

  const [nftList, setNftList] = useState([]);

  const [isShowPic, setIsShowPic] = useState(false);

  const [activeNftDetail, setActiveNftDetail] = useState<any>({});

  const [total, setTotal] = useState(0);

  const [isShowSkip, setIsShowSkip] = useState(false);

  const handleOk = () => {
    setIsShowPic(false);
  };

  const handleCancel = () => {
    setIsShowPic(false);
    setActiveNftDetail({})
  };

  const getAllNfts = async () => {
    const res = await erc721Contract.getAll(config.contracts.nft);
    // check if claimed
    const res2: any = await api.get("/v1/nft/query_ids", {
      params: {
        ids: res.join(','),
      },
    });
    setTotal(res2.data.length);
    let newList: any = [];
    for (var i = 0; i < res2.data.length; i += 4) {
      newList.push(res2.data.slice(i, i + 4));
    }
    setNftList(newList);
  };

  const doOpenBox = async (id: number) => {
    const res = await api.post(`/v1/nft/open/${id}`);
    if (res.data) {
      console.log("open success");
      setActiveNftDetail(res.data)
      setIsShowPic(true)
    }
  };

  useEffect(() => {
    if (!account) {
      return;
    }
    getAllNfts();
  }, [account]);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSkip(true)
    }, 5000)
  });

  const skipOperate = () => {
    if (!account) {
      setStep(2)
    } else {
      setStep(3)
    }
  }

  const enterOperate = async () => {
    const connectedAddress: string = await connectWallet();
    if (connectedAddress) {
      setStep(3)
    }
  }
  return (

    <div className="character">
      <div className="character-head">
        <HeaderBtn />
        <Wallet />
      </div>
      <div className="character-content-scroll">
        {step === 1 && (
          <div className="char-vedio">
            <video
              loop
              autoPlay
              muted
              src="./../../static/vedio_rainbow.mp4"
            >
            </video>
            {
              isShowSkip &&
              <div className="skip" onClick={() => skipOperate()}></div>
            }

          </div>
        )}

        {step === 2 && (
          <div className="char-vedio">
            <div className="enter-bg"></div>
            <div className="enter" onClick={() => enterOperate()}></div>
          </div>
        )}

        {step === 3 && (
          <div className="open-pic">
            <img src={ImgBgStory} alt="" />
            <div className="carou-con">
              <Carousel dotPosition={'right'} className="rainbow-carou" autoplay>
                {
                  nftList.map((t: any, i: number) => (
                    <div>
                      <div className="pic-con">
                        {t.map((item: any) =>
                          item.is_open === 1 ? (
                            <div className="pic-item">
                              <img src={item.token_uri} />
                              <div className="pic-open-btn">
                                <div className="reveal">#{item.id}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="pic-item">
                              <div className="pic-open-item">
                                <div className="text-top">YOUR 2022 WRAPPED ON LENS</div>
                                <div className="text-bot">MYSTERY BOH</div>
                              </div>
                              <div className="pic-open-btn">
                                <div className="arrow">
                                  <img src={ImgToRight} />
                                </div>
                                <div
                                  className="reveal"
                                  onClick={() => doOpenBox(item.id)}
                                >
                                  REVEAL
                                </div>
                                <div className="arrow">
                                  <img src={ImgToLeft} />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))
                }
              </Carousel>
            </div>
            {
              total !== 0 &&
              <div className="pic-total">Total:{total}</div>
            }
          </div>
        )}

        {step === 3 &&
          <div className="open-pic-video">
            <video
              loop
              autoPlay
              muted
              src="./../../static/vedio_rainbow.mp4"
            >
            </video>
          </div>
        }

      </div>
      <Modal
        className="openPicModal"
        open={isShowPic}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <div className="open-imgTitle">
            <img src={ImgWhole} />
          </div>
          <div className="open-imgResult">
            <img src={activeNftDetail.token_uri} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
