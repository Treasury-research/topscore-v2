import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import config from "../../../../../config";
import axios from "axios";
import log from "../../../../../lib/log";
// import { TwitterShareButton } from "react-share";
import useWeb3Context from "../../../../../hooks/useWeb3Context";
import useClaimContract from "../../../../../contract/useClaimContract";
import useERC721Contract from "../../../../../contract/useErc721Contract";
import { TwitterOutlined } from "@ant-design/icons";
const IconLenster = "/static/img/g5.svg";

export default function ClaimModal({ onCancel, profileId }: any) {
  const claimContract = useClaimContract();
  const erc721Contract = useERC721Contract();
  const [merkleProof, setMerkleProof] = useState<any>([]);
  const [checking, setChecking] = useState(true);
  const [canClaim, setCanClaim] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [nftBalance, setNftBalance] = useState(0);
  const [minting, setMinting] = useState(false);
  const { account } = useWeb3Context();
  const handleOk = () => {
    onCancel();
  };

  const handleCancel = () => {
    onCancel();
  };

  const getMerkleProof = async () => {
    const res: any = await axios.get(
      `${config.baseURL}/v1/merkletree/${account}`
    );

    if (res.data.result.length === 0) {
      setChecking(false);
    }

    setMerkleProof(() => [...res.data.result]);
  };

  const checkCanClaim = async () => {
    const res = await claimContract.canClaim(merkleProof);
    setCanClaim(res);
    setChecking(false);
  };

  const doClaim = async () => {
    try {
      setMinting(true);
      await claimContract.claim(merkleProof);
      setMinting(false);
      checkBalance();
      // setCanClaim(false);
    } catch (err) {
      setMinting(false);
      console.log(err);
    }
  };

  const checkBalance = async () => {
    const res = await erc721Contract.balanceOf(config.contracts.nft);
    setNftBalance(res);
    if (res > 0) {
      setChecking(false);
      const tokenId = await erc721Contract.getTokenId(config.contracts.nft);
      const res = await erc721Contract.getNftInfo(
        config.contracts.nft,
        tokenId
      );
      setImageUri(res.imageUri);
    } else {
      // start check if eligiable
      getMerkleProof();
    }
  };

  const LensterShareButton = ({ title, url, hashtags, children }: any) => {
    return (
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://lenster.xyz/?text=${encodeURIComponent(title)}&url=${url}&hashtags=${hashtags}&preview=true`}
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
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&hashtags=${hashtags}&preview=true`}
      >
        {children}
      </a>
    );
  };

  useEffect(() => {
    if (!account) {
      return;
    }
    checkBalance();
  }, [account]);

  useEffect(() => {
    if (!merkleProof || merkleProof.length === 0) {
      return;
    }
    checkCanClaim();
  }, [merkleProof]);

  return (
    <Modal
      className="claimModal"
      open={true}
      onOk={handleOk}
      onCancel={handleCancel}
      width={500}
    >
      {imageUri ? (
        <img className="claim-img" src={imageUri} />
      ) : (
        <div className="claim-img" />
      )}
      <div className="claim-bottom">
        <div>Mint ended</div>
        {(canClaim || imageUri || true) && (
          <div className="claim-share-btnGroup">
            <div onClick={() => log("share_lens", account || "")}>
              <LensterShareButton
                title={`My 2022 Wrapped on Lens: https://topscore.knn3.xyz/user/${account}/${profileId} So what are your TopScore? What is your social personality? FreeMint LensRainbowNFT！@Knn3Network`}
                url={`https://topscore.knn3.xyz/user/${account}/${profileId}`}
                hashtags="TopScore, Lens, Your2022WrappedonLens"
              >
                <img src={IconLenster} />
              </LensterShareButton>
            </div>
            <div onClick={() => log("share_twitter", account || "")}>
              <TwitterShareButton2
                url={`https://topscore.knn3.xyz/user/${account}/${profileId}`}
                hashtags={["TopScore", "Lens", "Your2022WrappedonLens"]}
                title={`My 2022 Wrapped on Lens: https://topscore.knn3.xyz/user/${account}/${profileId} So what are your #TopScore? What is your social personality? FreeMint #LensRainbowNFT！@Knn3Network`}
              >
                <TwitterOutlined className="twitter-icon" />
              </TwitterShareButton2>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
