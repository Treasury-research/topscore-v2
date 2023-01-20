import React, { useState, useEffect } from "react";
import api from "../../api";
import useWeb3Context from "../../hooks/useWeb3Context";
import config from "../../config";
import useErc721Contract from "../../contract/useErc721Contract";
import Wallet from "../../components/WalletBtn";
const ImgNoOpen = "/static/img/noOpen.png";
const ImgToRight = "/static/img/toRight.png";
const ImgToLeft = "/static/img/toLeft.png";
const ImgOpenResult = "/static/img/openResult.png";

import HeaderBtn from "../../components/HeaderBtn";
import { Modal, Carousel } from "antd";

export default function Character() {
  const { account, connectWallet } = useWeb3Context();
  const erc721Contract = useErc721Contract();

  const [step, setStep] = useState(3);

  const [nftList, setNftList] = useState([]);

  const [isShowPic, setIsShowPic] = useState(false);

  const [activeNftDetail, setActiveNftDetail] = useState({});

  const [total, setTotal] = useState(0);

  const testTokenId = 0;

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
        // ids: res.join(","),
        ids: testTokenId,
      },
    });
    setTotal(res2.data.length);
    // let rdata = [{
    //   id: '234',
    //   is_open: 1
    // },
    //   , {
    //   id: '234',
    //   is_open: 1
    // },
    // {
    //   id: '234',
    //   is_open: 1
    // },
    // {
    //   id: '234',
    //   is_open: 1
    // },
    // {
    //   id: '234',
    //   is_open: 1
    // },
    // {
    //   id: '234',
    //   is_open: 1
    // },
    // {
    //   id: '234',
    //   is_open: 1
    // },
    // {
    //   id: '234',
    //   is_open: 1
    // },
    // {
    //   id: '234',
    //   is_open: 1
    // },
    // {
    //   id: '234',
    //   is_open: 1
    // }]


    let newList:any = [];
    for (var i = 0; i < res2.data.length; i += 4) {
      newList.push(res2.data.slice(i, i + 4));
    }
    setNftList(newList);
  };

  const doOpenBox = async (id: number) => {
    const res = await api.post(`/v1/nft/open/${testTokenId}`);
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

  return (
    <div className="character">
      <div className="character-head">
        <HeaderBtn />
        <Wallet />
      </div>
      <div className="character-content-scroll">
        {step === 1 && (
          <div className="char-vedio">
            <div className="skip" onClick={() => setStep(2)}></div>
          </div>
        )}

        {step === 2 && (
          <div className="char-vedio">
            <div className="enter"></div>
          </div>
        )}

        {step === 3 && (
          <div className="open-pic">
            <p className="text">
              At dawn, the warm, amber light shines and all things come to life.
              A crystal prism sits on the windowsill, refracting the light into
              a spectrum of colors. Rainbows dance across the wall, a seven-hued
              display of light and shadow. But one strange, golden ray slices
              through the prism, creating a crevice in its facade. A joyful
              breeze rushes into the room, and K, a mysterious new life form, is
              born in silence. Droplets of water playfully roll around K, as it
              explores its new surroundings.
            </p>
            <p className="text">
              Glimmering faintly in the air, a spark of light. Digital
              entanglements beneath K's skin reflecting different shades. These
              fragments of words come from the Lens. Entwined, braided and
              combined with one another. Forming six distinct entities. And
              evolving into twenty-one personalities in the first century of a
              new era.
            </p>
            <p className="text">
              The combination of these six entities determines the construction
              of K. Storing all the information of life's personality, color,
              gestation, growth and decline. Enunciating the colorful hue of K.
            </p>
            <div className="carou-con">
              <Carousel dotPosition={'right'} className="rainbow-carou" autoplay>
                {
                  nftList.map((t: any, i: number) => (
                    <div>
                      <div className="pic-con">
                        {t.map((item: any) =>
                          item.is_open === 0 ? (
                            <div className="pic-item">
                              <div className="pic-open-item">
                                <img src={ImgNoOpen} />
                              </div>
                              <div className="pic-open-btn">
                                <div className="reveal">#{item.id}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="pic-item">
                              <div className="pic-open-item">
                                <img src={ImgNoOpen} />
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
      </div>
      <Modal
        className="openPicModal"
        open={isShowPic}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
      >
        <div>
          <img src={ImgOpenResult} />
        </div>
      </Modal>
    </div>
  );
}
