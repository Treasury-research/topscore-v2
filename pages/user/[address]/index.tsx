import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import api from "../../../api";
import { formatIPFS } from "../../../lib/tool";
import BN from "bignumber.js";
import useWeb3Context from "../../../hooks/useWeb3Context";
import Follow from "./components/Follow";
import Wallet from "../../../components/WalletBtn";
import { DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Dropdown, Space, Menu, Modal, Drawer, Pagination } from "antd";
import Radar from "./components/Radar";
import Comment from "./components/comment";
import Character from "./components/character";
import HeaderBtn from "../../../components/HeaderBtn";
import FixedIcon from "./components/FixedIcon";
import ClaimModal from "./components/ClaimModal";
import DownloadModal from "./components/DownloadModal";
const ImgGenerate = "/static/img/generate-button.gif";
const ImgHoverGenerate = "/static/img/hover-generate-button.gif";
import log from "../../../lib/log";

const tag1 = ["Influence", "Curation"];

const tag2 = ["Collection", "Publication"];

const defaultPageLimit = 6;

const typeList = [
  "Overall",
  "Influence",
  "Campaign",
  "Engagement",
  "Creation",
  "Collection",
  "Curation",
];
export default function Main() {
  const { account, connectWallet } = useWeb3Context();
  const [showList, setShowList] = useState(false);
  const [handlesList, setHandlesList] = useState<any>([]);
  const [loadingHandlesList, setLoadingHandlesList] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [rankList, setRankList] = useState<[]>([]);
  const [rankTotal, setRankTotal] = useState<number>(0);
  const [rankPageNo, setRankPageNo] = useState<number>(1);
  const [rankType, setRankType] = useState<string>("overall");
  const [rankLoading, setRankLoading] = useState<boolean>(false);
  const [influence, setInfluence] = useState<any>({});
  const [curation, setCuration] = useState<any>({});
  const [collection, setCollection] = useState<any>({});
  const [currentProfile, setCurrentProfile] = useState<any>({});
  const [activeHandleIndex, setActiveHandleIndex] = useState<number>(0);
  const [activeRankIndex, setActiveRankIndex] = useState<number>(0);
  const [pub, setPub] = useState<any>({});
  const [activeTag1, setActiveTag1] = useState<number>(0);
  const [activeTag2, setActiveTag2] = useState<number>(0);
  const [canLoadAvatar, setCanLoadAvatar] = useState<boolean>(true);
  const [rankInfo, setRankInfo] = useState<any>({});
  const [isSelf, setIsSelf] = useState<boolean>(false);
  const [showRadorGif, setShowRadorGif] = useState(false);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);

  const router = useRouter();

  const { address, queryProfileId } = router.query;

  const [rador1, setRador1] = useState([
    { name: "Influence", value: 0 },
    { name: "Campaign", value: 0 },
    { name: "Engagement", value: 0 },
    { name: "Curation", value: 0 },
    { name: "Collection", value: 0 },
    { name: "Creation", value: 0 },
  ]);

  const [rador2, setRador2] = useState([
    { name: "", value: 0 },
    { name: "", value: 0 },
    { name: "", value: 0 },
    { name: "Curation", value: 0 },
    { name: "", value: 0 },
    { name: "", value: 0 },
  ]);

  const [rador3, setRador3] = useState([
    { name: "", value: 0 },
    { name: "", value: 0 },
    { name: "", value: 0 },
    { name: "", value: 0 },
    { name: "Campaign", value: 0 },
    { name: "Engagement", value: 0 },
  ]);

  const onClose = () => {
    setShowList(false);
    setRankPageNo(1);
    log("close_ranklist", account || "");
  };

  const getRankList = async () => {
    setRankLoading(true);
    const toQuery = rankType === "overall" ? "score" : rankType;
    const res: any = await api.get(`/lens/${toQuery}/rank/list`, {
      params: {
        limit: defaultPageLimit,
        offset: (rankPageNo - 1) * defaultPageLimit,
      },
    });
    setRankLoading(false);
    setRankTotal(res.data.total);
    setRankList(res.data.data);
  };

  const getLensHandle = async () => {
    setLoadingHandlesList(true);
    try {
      const res: any = await api.get(`/lens/handles/${address}`);
      setHandlesList(res.data);
      if (res.data.length === 0) {
        setCurrentProfile({});
      }
    } finally {
      setLoadingHandlesList(false);
    }
  };

  const getIndicators = async (profileId: string) => {
    const res: any = await api.get(`/lens/indicators/${profileId}`);
    setUserInfo((prev: any) => ({
      ...prev,
      ...res.data,
    }));
  };

  const getPublication = async (profileId: string) => {
    const res: any = await api.get(`/lens/publication/${profileId}`);
    setUserInfo((prev: any) => ({
      ...prev,
      ...res.data,
    }));
  };

  useEffect(() => {
    if (JSON.stringify(rankInfo) !== "{}") {
      const {
        influReda,
        campaignReda,
        engagementReda,
        collectReda,
        creationReda,
        curationReda,
      } = rankInfo;

      if (activeTag1 == 0) {
        setRador2(() => {
          return [
            ...[
              { name: "Influence", value: influReda },
              { name: "", value: campaignReda },
              { name: "", value: creationReda },
              { name: "", value: curationReda },
              { name: "", value: collectReda },
              { name: "", value: engagementReda },
            ],
          ];
        });
      } else {
        setRador2(() => {
          return [
            ...[
              { name: "", value: influReda },
              { name: "", value: campaignReda },
              { name: "", value: creationReda },
              { name: "Curation", value: curationReda },
              { name: "", value: collectReda },
              { name: "", value: engagementReda },
            ],
          ];
        });
      }
    }
  }, [activeTag1]);

  useEffect(() => {
    if (JSON.stringify(rankInfo) !== "{}") {
      const {
        influReda,
        campaignReda,
        engagementReda,
        collectReda,
        creationReda,
        curationReda,
      } = rankInfo;

      if (activeTag2 == 0) {
        setRador3(() => {
          return [
            ...[
              { name: "", value: influReda },
              { name: "", value: campaignReda },
              { name: "", value: engagementReda },
              { name: "", value: curationReda },
              { name: "Collection", value: collectReda },
              { name: "Creation", value: creationReda },
            ],
          ];
        });
      } else {
        setRador3(() => {
          return [
            ...[
              { name: "", value: influReda },
              { name: "Campaign", value: campaignReda },
              { name: "Engagement", value: engagementReda },
              { name: "", value: curationReda },
              { name: "", value: collectReda },
              { name: "", value: engagementReda },
            ],
          ];
        });
      }
    }
  }, [activeTag2]);

  useEffect(() => {
    const {
      influReda,
      campaignReda,
      engagementReda,
      collectReda,
      creationReda,
      curationReda,
    } = rankInfo;

    setRador1(() => {
      return [
        ...[
          { name: "Influence", value: influReda },
          { name: "Campaign", value: campaignReda },
          { name: "Engagement", value: engagementReda },
          { name: "Curation", value: curationReda },
          { name: "Collection", value: collectReda },
          { name: "Creation", value: creationReda },
        ],
      ];
    });

    setRador2(() => {
      return [
        ...[
          { name: "Influence", value: influReda },
          { name: "", value: campaignReda },
          { name: "", value: creationReda },
          { name: "", value: curationReda },
          { name: "", value: collectReda },
          { name: "", value: engagementReda },
        ],
      ];
    });

    setRador3(() => {
      return [
        ...[
          { name: "", value: influReda },
          { name: "", value: campaignReda },
          { name: "", value: engagementReda },
          { name: "", value: curationReda },
          { name: "Collection", value: collectReda },
          { name: "Creation", value: creationReda },
        ],
      ];
    });
  }, [rankInfo]);

  const getRankInfo = async (profileId: string) => {
    const res: any = await api.get(`/lens/scores/${profileId}`);
    setRankInfo((prev: any) => ({
      ...prev,
      ...res.data,
    }));
  };

  const getInfluence = async (profileId: string) => {
    const res: any = await api.get(`/lens/influence/${profileId}`);
    setInfluence(res.data);
  };

  const getCuration = async (profileId: string) => {
    const res: any = await api.get(`/lens/curation/${profileId}`);
    setCuration(res.data);
  };

  const getCollection = async (profileId: string) => {
    const res: any = await api.get(`/lens/collection/${profileId}`);
    setCollection(res.data);
  };

  const getPub = async (profileId: string) => {
    const res: any = await api.get(`/lens/topPub/${profileId}`);
    setPub(res.data);
  };

  const getUserInfo = async (profileId: string) => {
    getRankInfo(profileId);
    getIndicators(profileId);
    getInfluence(profileId);
    getCollection(profileId);
    getCuration(profileId);
    getPub(profileId);
    getPublication(profileId);
    getRankList();
  };

  const showRank = (name: string) => {
    setActiveRankIndex(typeList.indexOf(name));
    setShowList(true);
    log(`open_ranklist_${name}`, account || "");
  };

  const onRankChange = (val: number) => {
    setRankPageNo(val);
  };

  useEffect(() => {
    if (!rankType || !rankPageNo) {
      return;
    }
    getRankList();
  }, [rankPageNo, rankType]);

  // useEffect(() => {
  //   if (!account) {
  //     return;
  //   }
  //   getLensHandle();
  // }, [account]);

  useEffect(() => {
    console.log("addr change", address);
    if (!address) {
      return;
    }
    getLensHandle();
  }, [address]);

  useEffect(() => {
    if (!address || !account) {
      return;
    }

    setIsSelf(address === account);
  }, [address, account]);

  const changeProfile = (profileId: number) => {
    router.push(`/user/${address}?queryProfileId=${profileId}`);
    // location.href = `/user/${address}?queryProfileId=${profileId}`
  };

  useEffect(() => {
    if (!handlesList || handlesList.length === 0) {
      return;
    }

    if (
      queryProfileId &&
      handlesList[activeHandleIndex].profileId !== Number(queryProfileId)
    ) {
      // setActiveHandleIndex(
      //   handlesList.findIndex(
      //     (item: any) => item.profileId === Number(queryProfileId)
      //   )
      // );
    } else {
      console.log("trig 2");

      // router.push(
      //   `/user/${address}?queryProfileId=${handlesList[activeHandleIndex].profileId}`
      // );
    }

    const profile = handlesList[activeHandleIndex];

    setCurrentProfile(profile);
  }, [activeHandleIndex, handlesList]);

  useEffect(() => {
    const { profileId } = currentProfile;

    if (!profileId) {
      return;
    }

    getUserInfo(profileId);
  }, [currentProfile]);

  return (
    <div className="toscore">
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your 2022 Wrapped on Lens" />
        <meta
          name="twitter:description"
          content="TopScore - a KNN3-powered scoring system based on Lens Protocol to evaluate this campaign."
        />
        <meta
          property="twitter:image"
          content={`https://lens-api.knn3.xyz/api/lens/generate/shareImg/${currentProfile.profileId}`}
        />
        <meta property="og:title" content="Your 2022 Wrapped on Lens" />
        <meta
          property="og:description"
          content="TopScore - a KNN3-powered scoring system based on Lens Protocol to evaluate this campaign."
        />
        <meta
          property="og:image"
          content={`https://lens-api.knn3.xyz/api/lens/generate/shareImg/${currentProfile.profileId}`}
        />
        <meta property="og:locale'" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://topscore.knn3.xyz" />
        <meta property="og:site_name" content="Topscore" />
      </Head>
      <FixedIcon />
      <div className="toscore-head">
        <HeaderBtn
          type={"main"}
          profileId={currentProfile.profileId}
          setDownloadModalVisible={() => setDownloadModalVisible(true)}
        />
        <Wallet />
      </div>
      <div className="toscore-content">
        <div className="toscore-main">
          <div>
            {handlesList && handlesList.length > 0 ? (
              <div className="toscore-main-base-info">
                {currentProfile.imageURI && canLoadAvatar ? (
                  <img
                    className="net-head-img"
                    onError={() => setCanLoadAvatar(false)}
                    src={formatIPFS(currentProfile.imageURI)}
                  />
                ) : (
                  <div className="net-head-img">K</div>
                )}
                <div>
                  <div>
                    <Dropdown
                      overlay={
                        <Menu>
                          {handlesList.map((t: any, i: number) => (
                            <div
                              className="drop-menu"
                              key={i}
                              onClick={() => {
                                setActiveHandleIndex(i);
                                changeProfile(t.profileId);
                                log("change_profile", account || "");
                              }}
                            >
                              {t.handle}
                            </div>
                          ))}
                        </Menu>
                      }
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Space className="space">
                          {currentProfile.name || currentProfile.handle}
                          <DownOutlined />
                        </Space>
                      </a>
                    </Dropdown>
                  </div>
                  <div>@{currentProfile.handle}</div>
                </div>
              </div>
            ) : loadingHandlesList ? (
              <div className="empty-hint"> Loading...</div>
            ) : (
              <div className="empty-hint"> You don't have any profile yet.</div>
            )}

            {account && (
              <>
                {isSelf ? (
                  <>
                    <div
                      className="topscore-head-wallet-btn"
                      onClick={() => {
                        setIsModalOpen(true);
                        log("click_share_mint", account);
                      }}
                    >
                      Mint
                    </div>
                  </>
                ) : (
                  <>
                    <Follow
                      profileId={currentProfile.profileId}
                      handle={currentProfile.handle}
                    />
                  </>
                )}
              </>
            )}
          </div>

          <div className="top-rador">
            <div>
              <Radar
                data={rador1}
                id="top-rador"
                width={"100%"}
                height={"100%"}
                showTooltip={true}
                showList={(name: string) => showRank(name)}
              />
            </div>
            {!account && (
              <div className="generate">
                {!showRadorGif && (
                  <img
                    src={ImgGenerate}
                    alt=""
                    onMouseEnter={() => setShowRadorGif(true)}
                  />
                )}
                {showRadorGif && (
                  <img
                    onMouseLeave={() => setShowRadorGif(false)}
                    onClick={() => connectWallet()}
                    src={ImgHoverGenerate}
                    alt=""
                  />
                )}
              </div>
            )}
            <div className="top-rador-info">
              <div className="rador-info">
                <div>
                  <div>
                    <div>
                      <p>{new BN(userInfo.rank).toFormat()}</p>
                      <p>Rank</p>
                    </div>
                    <div>
                      <p>{new BN(userInfo.following).toFormat()}</p>
                      <p>Following</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>{new BN(userInfo.score).toFixed(2)}</p>
                      <p>Score</p>
                    </div>
                    <div>
                      <p>{new BN(userInfo.follower).toFormat()}</p>
                      <p>Followers</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <p>{new BN(userInfo.collect).toFormat()}</p>
                      <p>Collections</p>
                    </div>
                    <div>
                      <p>{new BN(userInfo.publication).toFormat()}</p>
                      <p>Publications</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>{new BN(userInfo.collectBy).toFormat()}</p>
                      <p>Collected</p>
                    </div>
                    <div className="diff-sty-info">
                      <p>
                        <span>{new BN(userInfo.post).toFormat()}</span>
                        <span>Posts</span>
                      </p>
                      <p>
                        <span>{new BN(userInfo.comment).toFormat()}</span>
                        <span>Comments</span>
                      </p>
                      <p>
                        <span>{new BN(userInfo.mirror).toFormat()}</span>
                        <span>Mirrors</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Drawer
              title=""
              placement="right"
              onClose={onClose}
              open={showList}
              closable={false}
            >
              <div className="drawer">
                <div
                  className="rightOut"
                  onClick={() => {
                    setShowList(false);
                    log("close_ranklist", account || "");
                  }}
                >
                  <RightOutlined />
                </div>
                <Dropdown
                  overlay={
                    <Menu>
                      {typeList.map((t, i) => (
                        <div
                          className="drop-menu"
                          key={i}
                          onClick={() => {
                            setActiveRankIndex(i);
                            setRankType(t.toLowerCase());
                            setRankPageNo(1);
                          }}
                        >
                          {t}
                        </div>
                      ))}
                    </Menu>
                  }
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className="space overall">
                      <span className="list-type">
                        {typeList[activeRankIndex]}
                      </span>
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
                <Spin spinning={rankLoading}>
                  {rankList.map((t: any, i) => (
                    <div className="rank-item" key={i}>
                      <span>{t.rank}</span>
                      {t.imageURI ? (
                        <img className="avatar" src={formatIPFS(t.imageURI)} />
                      ) : (
                        <span>k</span>
                      )}
                      <span title={t.handle}>
                        {t.handle && t.handle.length > 16
                          ? `${t.handle.slice(0, 16)}...`
                          : t.handle}
                      </span>
                      {/* <span>
                        <img src={imgRadarSmall} alt="" />
                      </span> */}
                      <span className="score">Score: {new BN(t.score).toFixed(2)}</span>
                    </div>
                  ))}
                </Spin>
                <div className="pagination">
                  <Pagination
                    simple
                    current={rankPageNo}
                    pageSize={defaultPageLimit}
                    onChange={onRankChange}
                    total={rankTotal}
                  />
                </div>
              </div>
            </Drawer>
          </div>
          <div className="btn-group-1">
            <div>
              {tag1.map((t: string, i: number) => (
                <div
                  className={activeTag1 == i ? "activeBtnGroup btnTb" : "btnTb"}
                  onClick={() => setActiveTag1(i)}
                  key={i}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="influence_curation">
            {activeTag1 === 0 &&
              (JSON.stringify(rankInfo) === "{}" ||
                rankInfo.influScore == 0) && (
                <div className="influence-default-text">
                  <p>THE COMPANIONS</p>
                  <p>MAKE THE JOURNEY &nbsp; NO LONGER &nbsp; LONELY.</p>
                </div>
              )}

            {activeTag1 === 1 &&
              (JSON.stringify(rankInfo) === "{}" ||
                rankInfo.curationScore == 0) && (
                <div className="curation-default-text">
                  <p>YOU WILL MEET LIKE MINDED PEOPLE</p>
                  <p>ALONG</p>
                  <p>THE</p>
                  <p>WAY</p>
                </div>
              )}

            {activeTag1 === 0 &&
              JSON.stringify(rankInfo) !== "{}" &&
              rankInfo.influScore !== 0 && (
                <div className="left-rador">
                  <Radar
                    data={rador2}
                    id="top-rador_1"
                    width={"100%"}
                    height={"100%"}
                    showTooltip={false}
                    showList={(name: string) => console.log(name)}
                  />
                </div>
              )}

            {activeTag1 === 1 &&
              JSON.stringify(rankInfo) !== "{}" &&
              rankInfo.curationScore !== 0 && (
                <div className="left-rador">
                  <Radar
                    data={rador2}
                    id="top-rador_1"
                    width={"100%"}
                    height={"100%"}
                    showTooltip={false}
                    showList={(name: string) => console.log(name)}
                  />
                </div>
              )}

            {activeTag1 === 0 &&
              JSON.stringify(rankInfo) !== "{}" &&
              rankInfo.influScore !== 0 && (
                <div className="right-text">
                  <p>In 2022,</p>
                  <p>
                    you had the power to capture hearts and minds, growing your
                    followers by{" "}
                    <span>{new BN(userInfo.follower).toFormat()}</span> and
                    achieving an influence score of{" "}
                    <span>{new BN(rankInfo.influScore).toFixed(2)}</span>,
                    ranking you{" "}
                    <span>{new BN(rankInfo.influRank).toFormat()}</span> in the
                    game of social media,
                  </p>
                  {/* <p>
                  growing your followers by{" "}
                  <span>{new BN(userInfo.follower).toFormat()}</span> and
                </p>
                <p>
                  achieving an influence score of{" "}
                  <span>{new BN(rankInfo.influScore).toFixed(2)}</span>,
                </p>
                <p>
                  ranking you{" "}
                  <span>{new BN(rankInfo.influRank).toFormat()}</span> in the
                  game of social media,
                </p> */}

                  {userInfo.follower > 0 ? (
                    <p>A true sign of your authority and influence!</p>
                  ) : (
                    <p>Let's strive to do better next year!</p>
                  )}
                </div>
              )}
            {activeTag1 === 1 &&
              JSON.stringify(rankInfo) !== "{}" &&
              rankInfo.curationScore !== 0 && (
                <div className="right-text">
                  <p>In 2022,</p>
                  <p>
                    you mirrored{" "}
                    <span>{new BN(userInfo.mirror).toFormat()}</span> pieces of
                    content, resulting in{" "}
                    <span>{new BN(rankInfo.curationScore).toFormat()}</span>{" "}
                    Collects for the original authors. Your Curation score was{" "}
                    <span>{new BN(rankInfo.curationScore).toFormat()}</span>,
                    ranking you{" "}
                    <span>{new BN(rankInfo.curationRank).toFormat()}</span>!
                  </p>

                  <p>Let's take the time to your achievement in 2022!</p>
                </div>
              )}
          </div>
          <div className="btn-group-2">
            <div>
              {tag2.map((t: string, i: number) => (
                <div
                  className={activeTag2 == i ? "activeBtnGroup btnTb" : "btnTb"}
                  onClick={() => setActiveTag2(i)}
                  key={i}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="collect_pablication">
            {activeTag2 === 0 &&
              (JSON.stringify(rankInfo) === "{}" ||
                rankInfo.creationScore == 0) && (
                <div className="collect-default-text text-left">
                  <p>PEOPLE SOMETIMES FORGET,</p>
                  <p>BUT BLOCKS DONT.</p>
                </div>
              )}

            {activeTag2 === 1 &&
              (JSON.stringify(rankInfo) === "{}" ||
                rankInfo.campaignScore == 0) && (
                <div className="publication-default-text text-left">
                  <p>THE FLAME OF WISDOM ALWAYS BURSTS OUT IN THE DISCUSSION</p>
                </div>
              )}

            {activeTag2 === 0 &&
              JSON.stringify(rankInfo) !== "{}" &&
              rankInfo.creationScore !== 0 && (
                <div className="left-text">
                  {userInfo.collectBy > 0 ? (
                    <>
                      <p>In 2022, </p>
                      <p>you achieved incredible success with your content! </p>
                      <p>
                        Your content has been collected{" "}
                        <span>{new BN(userInfo.collectBy).toFormat()}</span>{" "}
                        times, and you have collected{" "}
                        <span>{new BN(userInfo.collect).toFormat()}</span>{" "}
                        pieces of valuable content.
                      </p>
                      <p>
                        Your Creation score was{" "}
                        <span>{new BN(rankInfo.creationScore).toFixed(2)}</span>{" "}
                        ranking you{" "}
                        <span>{new BN(rankInfo.creationRank).toFormat()}</span>!{" "}
                      </p>
                      <p>
                        Your Collection score was also{" "}
                        <span>
                          {new BN(rankInfo.collectionScore).toFixed(2)}
                        </span>
                        , earning you a place at{" "}
                        <span>
                          {new BN(rankInfo.collectionRank).toFormat()}
                        </span>{" "}
                        on the leaderboard.{" "}
                      </p>
                      <p>It's been a great year for you and your creations!</p>
                    </>
                  ) : (
                    <>
                      <p>In 2022,</p>
                      <p>
                        Your content has been collected{" "}
                        <span>{new BN(userInfo.collectBy).toFormat()}</span>{" "}
                        times, and you have collected{" "}
                        <span>{new BN(userInfo.collect).toFormat()}</span>{" "}
                        pieces of valuable content.
                      </p>
                      <p>
                        Your Creation score was{" "}
                        <span>{new BN(rankInfo.creationScore).toFixed(2)}</span>
                        , ranking{" "}
                        <span>
                          {new BN(rankInfo.collectionRank).toFormat()}
                        </span>
                        ,{" "}
                      </p>
                      <p>
                        while your Collection score was{" "}
                        <span>
                          {new BN(rankInfo.collectionScore).toFixed(2)}
                        </span>
                        , ranking{" "}
                        <span>
                          {new BN(rankInfo.collectionRank).toFormat()}
                        </span>
                        .{" "}
                      </p>
                      <p>
                        Continue to put in your best effort and aim for even
                        greater achievements in the coming year!
                      </p>
                    </>
                  )}
                </div>
              )}
            {activeTag2 === 1 &&
              JSON.stringify(rankInfo) !== "{}" &&
              rankInfo.campaignScore !== 0 && (
                <div className="left-text">
                  {true ? (
                    <>
                      {/* 版本1(正常) */}
                      <p>In 2022, </p>
                      <p>you made a splash on social media! </p>
                      <p>
                        You posted{" "}
                        <span>{new BN(userInfo.post).toFormat()}</span> times,
                        made <span>{new BN(userInfo.comment).toFormat()}</span>{" "}
                        Comments, and created{" "}
                        <span>{new BN(userInfo.mirror).toFormat()}</span>{" "}
                        Mirrors that really got people talking.{" "}
                      </p>
                      <p>
                        You received an incredible{" "}
                        <span>
                          {new BN(userInfo.receiveComment).toFormat()}
                        </span>{" "}
                        Comments, and your content was Mirrored{" "}
                        <span>{new BN(userInfo.receiveMirror).toFormat()}</span>{" "}
                        times.{" "}
                      </p>
                      <p>
                        Your Campaign score was{" "}
                        <span>{new BN(rankInfo.campaignScore).toFixed(2)}</span>
                        , making you a{" "}
                        <span>{new BN(rankInfo.campaignRank).toFormat()}</span>{" "}
                        ranker,{" "}
                      </p>
                      <p>
                        and your Engagement score was{" "}
                        <span>
                          {new BN(rankInfo.engagementScore).toFixed(2)}
                        </span>
                        , giving you a place in{" "}
                        <span>
                          {new BN(rankInfo.engagementRank).toFormat()}
                        </span>
                        !{" "}
                      </p>
                      <p>You really set the bar for social media success!</p>
                    </>
                  ) : (
                    <>
                      {/* 版本2(0 page rank <?) */}
                      <p>In 2022, </p>
                      <p>
                        you posted{" "}
                        <span>{new BN(userInfo.post).toFormat()}</span> Posts,{" "}
                        <span>{new BN(userInfo.comment).toFormat()}</span>{" "}
                        Comments,{" "}
                        <span>{new BN(userInfo.mirror).toFormat()}</span>{" "}
                        Mirrors,{" "}
                      </p>
                      <p>
                        earned <span>_num_</span> Comments, were mirrored{" "}
                        <span>_num_</span> times,{" "}
                      </p>
                      <p>
                        your Campaign Score was{" "}
                        <span>{new BN(rankInfo.campaignScore).toFixed(2)}</span>
                        , ranking{" "}
                        <span>{new BN(rankInfo.campaignRank).toFormat()}</span>,{" "}
                      </p>
                      <p>
                        your Engagement Score was{" "}
                        <span>
                          {new BN(rankInfo.engagementScore).toFixed(2)}
                        </span>
                        , ranking{" "}
                        <span>
                          {new BN(rankInfo.engagementRank).toFormat()}
                        </span>
                        .{" "}
                      </p>
                      <p>
                        Keep up the fantastic work and shoot for the stars in
                        the next year!
                      </p>
                    </>
                  )}
                </div>
              )}
            {activeTag2 === 0 &&
              JSON.stringify(rankInfo) !== "{}" &&
              rankInfo.creationScore !== 0 && (
                <div className="right-rador">
                  <Radar
                    data={rador3}
                    id="top-rador_2"
                    width={"100%"}
                    height={"100%"}
                    showTooltip={false}
                    showList={(name: string) => console.log(name)}
                  />
                </div>
              )}

            {activeTag2 === 1 &&
              JSON.stringify(rankInfo) !== "{}" &&
              rankInfo.campaignScore !== 0 && (
                <div className="right-rador">
                  <Radar
                    data={rador3}
                    id="top-rador_2"
                    width={"100%"}
                    height={"100%"}
                    showTooltip={false}
                    showList={(name: string) => console.log(name)}
                  />
                </div>
              )}
          </div>

          {activeTag2 === 0 &&
            pub.collect &&
            Object.keys(pub.collect.publication).length > 0 && (
              <Comment
                data={{
                  headImg: canLoadAvatar
                    ? formatIPFS(currentProfile.imageURI)
                    : "",
                  name: currentProfile.name,
                  lensHandle: currentProfile.handle,
                  msg: pub.collect.publication.metadata.description,
                  commentImg: formatIPFS(
                    pub.collect.publication.metadata.image
                  ),
                  iconNum1: pub.collect.commentCount,
                  iconNum2: pub.collect.mirrorCount,
                  iconNum3: pub.collect.collectCount,
                  // iconNum4: "10",
                }}
              />
            )}

          {activeTag2 === 1 &&
            pub.engagement &&
            Object.keys(pub.engagement.publication).length > 0 && (
              <Comment
                data={{
                  headImg: canLoadAvatar
                    ? formatIPFS(currentProfile.imageURI)
                    : "",
                  name: currentProfile.name,
                  lensHandle: currentProfile.handle,
                  msg: pub.engagement.publication.metadata.description,
                  commentImg: formatIPFS(
                    pub.engagement.publication.metadata.image
                  ),
                  iconNum1: pub.collect.commentCount,
                  iconNum2: pub.collect.mirrorCount,
                  iconNum3: pub.collect.collectCount,
                  // iconNum4: "10",
                }}
              />
            )}
          <div className="charcter-main">
            <Character profileId={currentProfile.profileId} />
          </div>
        </div>
        <div
          className="leftOut"
          onClick={() => {
            setShowList(true);
            log("open_ranklist", account || "");
          }}
        >
          <LeftOutlined />
        </div>
      </div>

      {isModalOpen && (
        <ClaimModal
          profileId={currentProfile.profileId}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
      {downloadModalVisible && (
        <DownloadModal
          profileId={currentProfile.profileId}
          onCancel={() => setDownloadModalVisible(false)}
        />
      )}
    </div>
  );
}
