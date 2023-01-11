import React, { useState, useEffect } from "react";
import useWeb3Context from "../../../../../hooks/useWeb3Context";
import { Modal } from "antd";
const IconLenster = "/static/img/g5.svg";
import { TwitterOutlined } from "@ant-design/icons";

export default function DownloadModal({ onCancel, profileId }: any) {
  const { account } = useWeb3Context();
  const [downloading, setDownloading] = useState(false);
  const downloadURL = `https://lens-api.knn3.xyz/api/lens/generate/shareImg/${profileId}`;

  const handleOk = () => {
    onCancel();
  };

  const doDownload = async () => {
    setDownloading(true)
    const res = await fetch(downloadURL);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setDownloading(false);
    var a = document.createElement("a");
    a.href = url;
    a.download = "your_2022_wrapped_on_lens.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCancel = () => {
    onCancel();
  };

  const LensterShareButton = ({ title, url, hashtags, children }: any) => {
    return (
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://lenster.xyz/?text=${encodeURIComponent(
          title
        )}&url=${url}&hashtags=${hashtags}&preview=true`}
      >
        {children}
      </a>
    );
  };

  const TwitterShareButton2 = ({ title, url, hashtags, children }: any) => {
    return (
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&hashtags=${hashtags}&preview=true`}
      >
        {children}
      </a>
    );
  };

  return (
    <Modal
      className="claimModal"
      open={true}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
    >
      <img className="claim-img" src={downloadURL} />
      <div className="claim-download-bottom">
        <div>
          <a
            onClick={doDownload}
            download="my_2022_wrapped"
            target="_blank"
            className="download-btn"
          >
            <div className="download-modal-btn">
              {downloading ? 'Downloading...' : 'Download'}</div>
          </a>
        </div>

        <div>
          <div>
            <LensterShareButton
              title={`My 2022 Wrapped on Lens: https://topscore.knn3.xyz/user/${account}/${profileId} So what are your TopScore? What is your social personality? FreeMint LensRainbowNFT！@knn3_network`}
              url={`https://topscore.knn3.xyz/user/${account}/${profileId}`}
              hashtags="TopScore, Lens, Your2022WrappedonLens"
            >
              <img src={IconLenster} />
            </LensterShareButton>
          </div>
          <div>
            <TwitterShareButton2
              url={`https://topscore.knn3.xyz/user/${account}/${profileId}`}
              hashtags={["TopScore", "Lens", "Your2022WrappedonLens"]}
              title={`My 2022 Wrapped on Lens: https://topscore.knn3.xyz/user/${account}/${profileId} So what are your #TopScore? What is your social personality? FreeMint #LensRainbowNFT！@knn3_network`}
            >
              <TwitterOutlined className="twitter-icon" />
            </TwitterShareButton2>
          </div>
        </div>
      </div>
    </Modal>
  );
}
