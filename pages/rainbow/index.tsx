import React, { useState, useEffect } from "react";
import Wallet from "../../components/WalletBtn";
const ImgNoOpen = "/static/img/noOpen.png";
const ImgToRight = "/static/img/toRight.png";
const ImgToLeft = "/static/img/toLeft.png";
const ImgOpenResult = "/static/img/openResult.png";

import HeaderBtn from "../../components/HeaderBtn";
import { Modal } from "antd";

export default function Character() {

  const [step, setStep] = useState(3);

  const [isShowPic, setIsShowPic] = useState(false);

  const handleOk = () => {
    setIsShowPic(false);
  };

  const handleCancel = () => {
    setIsShowPic(false);
  };

  return (
    <div className="character">
      <div className="character-head">
        <HeaderBtn />
        <Wallet />
      </div>
      <div className="character-content-scroll">
        {
          step === 1 &&
          <div className="char-vedio">
            <div className="skip" onClick={() => setStep(2)}></div>
          </div>
        }

        {
          step === 2 &&
          <div className="char-vedio">
            <div className="enter"></div>
          </div>
        }

        {
          step === 3 &&
          <div className="open-pic">
            <p className="text">At dawn, the warm, amber light shines and all things come to life. A crystal prism sits on the windowsill, refracting the light into a spectrum of colors. Rainbows dance across the wall, a seven-hued display of light and shadow. But one strange, golden ray slices through the prism, creating a crevice in its facade. A joyful breeze rushes into the room, and K, a mysterious new life form, is born in silence. Droplets of water playfully roll around K, as it explores its new surroundings.</p>
            <p className="text">Glimmering faintly in the air, a spark of light. Digital entanglements beneath K's skin reflecting different shades. These fragments of words come from the Lens. Entwined, braided and combined with one another. Forming six distinct entities. And evolving into twenty-one personalities in the first century of a new era.</p>
            <p className="text">The combination of these six entities determines the construction of K. Storing all the information of life's personality, color, gestation, growth and decline. Enunciating the colorful hue of K.</p>
            <div className="pic-con">
              <div className="pic-item">
                <div className="pic-open-item">
                  <img
                    src={ImgNoOpen}
                  />
                </div>
                <div className="pic-open-btn">
                  <div className="arrow">
                    <img
                      src={ImgToRight}
                    />
                  </div>

                  <div className="reveal" onClick={() => setIsShowPic(true)}>REVEAL</div>
                  <div className="arrow">
                    <img
                      src={ImgToLeft}
                    />
                  </div>

                </div>
              </div>
              <div className="pic-item">
                <div className="pic-open-item">
                  <img
                    src={ImgNoOpen}
                  />
                </div>
                <div className="pic-open-btn">
                  <div className="arrow">
                    <img
                      src={ImgToRight}
                    />
                  </div>

                  <div className="reveal" onClick={() => setIsShowPic(true)}>REVEAL</div>
                  <div className="arrow">
                    <img
                      src={ImgToLeft}
                    />
                  </div>

                </div>
              </div>
              <div className="pic-item">
                <div className="pic-open-item">
                  <img
                    src={ImgNoOpen}
                  />
                </div>
                <div className="pic-open-btn">
                  <div className="arrow">
                    <img
                      src={ImgToRight}
                    />
                  </div>

                  <div className="reveal" onClick={() => setIsShowPic(true)}>REVEAL</div>
                  <div className="arrow">
                    <img
                      src={ImgToLeft}
                    />
                  </div>

                </div>
              </div>
              <div className="pic-item">
                <div className="pic-open-item">
                  <img
                    src={ImgNoOpen}
                  />
                </div>
                <div className="pic-open-btn">
                  <div className="reveal">#1224</div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
      <Modal
        className="openPicModal"
        open={isShowPic}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
      >
        <div>
          <img
            src={ImgOpenResult}
          />
        </div>
      </Modal>
    </div>
  );
}
