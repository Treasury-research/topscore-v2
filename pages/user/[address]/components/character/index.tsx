import React, { useState, useEffect } from "react";
import api from "../../../../../api";
const Mastermind = "/static/img/dark-character/Mastermind.png";
const Pioneer = "/static/img/dark-character/Pioneer.png";
const Artist = "/static/img/dark-character/Artist.png";
const Conductor = "/static/img/dark-character/Conductor.png";
const Actor = "/static/img/dark-character/Actor.png";
const Antiquer = "/static/img/dark-character/Antiquer.png";
const Spy = "/static/img/dark-character/Spy.png";
const Magician = "/static/img/dark-character/Magician.png";
const Healer = "/static/img/dark-character/Healer.png";
const Volcanologist = "/static/img/dark-character/Volcanologist.png";
const Photographer = "/static/img/dark-character/Photographer.png";
const Designer = "/static/img/dark-character/Designer.png";
const Architect = "/static/img/dark-character/Architect.png";
const Engineer = "/static/img/dark-character/Engineer.png";
const Promotor = "/static/img/dark-character/Promotor.png";
const Supervisor = "/static/img/dark-character/Supervisor.png";
const Mobilizer = "/static/img/dark-character/Mobilizer.png";
const Counselor = "/static/img/dark-character/Counselor.png";
const Musician = "/static/img/dark-character/Musician.png";
const Motivator = "/static/img/dark-character/Motivator.png";
const Demonstrator = "/static/img/dark-character/Demonstrator.png";
const IconLenster = "/static/img/g5.svg";
import { TwitterOutlined } from "@ant-design/icons";
import useWeb3Context from "../../../../../hooks/useWeb3Context";
import { useRouter } from "next/router";
import BN from "bignumber.js";

const background = {
    Mastermind: Mastermind,
    Pioneer: Pioneer,
    Artist: Artist,
    Conductor: Conductor,
    Actor: Actor,
    Antiquer: Antiquer,
    Spy: Spy,
    Magician: Magician,
    Healer: Healer,
    Volcanologist: Volcanologist,
    Photographer: Photographer,
    Designer: Designer,
    Architect: Architect,
    Engineer: Engineer,
    Promotor: Promotor,
    Supervisor: Supervisor,
    Mobilizer: Mobilizer,
    Counselor: Counselor,
    Musician: Musician,
    Motivator: Motivator,
    Demonstrator: Demonstrator,
}



const Character = (props: any) => {

    const [imgUrl, setImgUrl] = useState<any>("");

    const [userInfo, setUserInfo] = useState<any>("");

    const { account } = useWeb3Context();

    const [isSelf, setIsSelf] = useState<boolean>(false);

    const router = useRouter();

    const { address, queryProfileId } = router.query;

    const getRadar = async () => {
        console.log(props.profileId)
        const res: any = await api.get(`/lens/scores/${props.profileId}`);
        console.log(res)
        let arr = [
            { type: 'influReda', score: res.data.influReda * 1.05 },
            { type: 'campaignReda', score: res.data.campaignReda * 1.09 },
            { type: 'engagementReda', score: res.data.engagementReda * 1.07 },
            { type: 'collectReda', score: res.data.collectReda * 1.06 },
            { type: 'creationReda', score: res.data.creationReda * 1.08 },
            { type: 'curationReda', score: res.data.curationReda * 1.1 },
        ];
        arr.sort((a: any, b: any) => { return b.score - a.score })
        const img = getImg(arr);
        setImgUrl(img)
    };

    const getIndicators = async () => {
        const res: any = await api.get(`/lens/indicators/${props.profileId}`);
        setUserInfo((prev: any) => ({
            ...prev,
            ...res.data,
        }));
    };

    useEffect(() => {
        if (props.profileId) {
            getRadar();
            getIndicators();
        }
    }, [props.profileId]);

    useEffect(() => {
        if (!address || !account) {
            return;
        }

        setIsSelf(address === account);
    }, [address, account]);

    const shareUrl = `https://topscore.staging.knn3.xyz/user/${account}?queryProfileId=${props.profileId}`

    const getImg = (arr: any) => {
        if (arr[0].score - arr[1].score > 1.6) {
            switch (arr[0].type) {
                case 'curationReda': //灰色
                    return background['Mastermind'];
                case 'campaignReda': //蓝色
                    return background['Pioneer'];
                case 'creationReda': //紫色
                    return background['Artist'];
                case 'influReda': // 红色
                    return background['Conductor'];
                case 'engagementReda': // 橘色
                    return background['Actor'];
                case 'collectReda': //绿色
                    return background['Antiquer'];
            }
        } else {
            if (
                (arr[0].type === 'collectReda' && arr[1].type === 'curationReda') ||
                (arr[0].type === 'curationReda' && arr[1].type === 'collectReda')
            ) {
                return background['Spy'];
            }
            if (
                (arr[0].type === 'creationReda' && arr[1].type === 'curationReda') ||
                (arr[0].type === 'curationReda' && arr[1].type === 'creationReda')
            ) {
                return background['Magician'];
            }
            if (
                (arr[0].type === 'creationReda' && arr[1].type === 'collectReda') ||
                (arr[0].type === 'collectReda' && arr[1].type === 'creationReda')
            ) {
                return background['Healer'];
            }
            if (
                (arr[0].type === 'engagementReda' && arr[1].type === 'curationReda') ||
                (arr[0].type === 'curationReda' && arr[1].type === 'engagementReda')
            ) {
                return background['Volcanologist'];
            }
            if (
                (arr[0].type === 'engagementReda' && arr[1].type === 'collectReda') ||
                (arr[0].type === 'collectReda' && arr[1].type === 'engagementReda')
            ) {
                return background['Photographer'];
            }
            if (
                (arr[0].type === 'engagementReda' && arr[1].type === 'creationReda') ||
                (arr[0].type === 'creationReda' && arr[1].type === 'engagementReda')
            ) {
                return background['Designer'];
            }
            if (
                (arr[0].type === 'campaignReda' && arr[1].type === 'curationReda') ||
                (arr[0].type === 'curationReda' && arr[1].type === 'campaignReda')
            ) {
                return background['Architect'];
            }
            if (
                (arr[0].type === 'campaignReda' && arr[1].type === 'collectReda') ||
                (arr[0].type === 'collectReda' && arr[1].type === 'campaignReda')
            ) {
                return background['Engineer'];
            }
            if (
                (arr[0].type === 'campaignReda' && arr[1].type === 'creationReda') ||
                (arr[0].type === 'creationReda' && arr[1].type === 'campaignReda')
            ) {
                return background['Promotor'];
            }
            if (
                (arr[0].type === 'campaignReda' && arr[1].type === 'engagementReda') ||
                (arr[0].type === 'engagementReda' && arr[1].type === 'campaignReda')
            ) {
                return background['Supervisor'];
            }
            if (
                (arr[0].type === 'influReda' && arr[1].type === 'curationReda') ||
                (arr[0].type === 'curationReda' && arr[1].type === 'influReda')
            ) {
                return background['Mobilizer'];
            }
            if (
                (arr[0].type === 'influReda' && arr[1].type === 'collectReda') ||
                (arr[0].type === 'collectReda' && arr[1].type === 'influReda')
            ) {
                return background['Counselor'];
            }
            if (
                (arr[0].type === 'influReda' && arr[1].type === 'creationReda') ||
                (arr[0].type === 'creationReda' && arr[1].type === 'influReda')
            ) {
                return background['Musician'];
            }
            if (
                (arr[0].type === 'influReda' && arr[1].type === 'campaignReda') ||
                (arr[0].type === 'campaignReda' && arr[1].type === 'influReda')
            ) {
                return background['Motivator'];
            }
            if (
                (arr[0].type === 'influReda' && arr[1].type === 'engagementReda') ||
                (arr[0].type === 'engagementReda' && arr[1].type === 'influReda')
            ) {
                return background['Demonstrator'];
            }
        }
    }

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

    return (
        <div className="char-pic-default">
            {
                imgUrl &&
                <>
                    <img src={imgUrl} alt="" />
                    <div className="character-rank">{props.rank}</div>
                    <div className="character-lens">{props.lens}</div>
                    <div className="character-score">{props.score}</div>
                    {
                        isSelf && account ?
                            (<div className="char-share-btnGroup">
                                <div>
                                    <LensterShareButton
                                        title={`🔥 Unlock your web3 social presence with #TopScore! Stand out from the crowd & explore your self-building potential! 🔗：@KNN3Network #Lens`}
                                        url={`https://topscore.knn3.xyz/user/${account}/${props.profileId}`}
                                        hashtags="@knn3_network #Lens"
                                    >
                                        <img src={IconLenster} />
                                    </LensterShareButton>
                                </div>
                                <div>
                                    <TwitterShareButton2
                                        url={shareUrl}
                                        hashtags={["@KNN3Network #Lens"]}
                                        title={`🔥 Unlock your web3 social presence with #TopScore! Stand out from the crowd & explore your self-building potential! 🔗：@knn3_network #Lens`}
                                    >
                                        <TwitterOutlined className="twitter-icon" />
                                    </TwitterShareButton2>
                                </div>
                            </div>) :
                            (
                                <div className="clear-btn-group"></div>
                            )
                    }
                </>
            }


        </div>
    );
};

export default Character;
