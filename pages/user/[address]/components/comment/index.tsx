import React, { useState, useEffect } from "react";
const IconG1 = "/static/img/g1.svg";
const IconG2 = "/static/img/g2.svg";
const IconG3 = "/static/img/g3.svg";
const IconG4 = "/static/img/g4.svg";
const Comment = (props: any) => {
    const {
        headImg,
        name,
        lensHandle,
        msg,
        commentImg,
        iconNum1,
        iconNum2,
        iconNum3,
        iconNum4,
    } = props.data
    return (
        <div className="con">
            <div className="head">
                <div>
                    {
                        headImg ? (
                            <img src={headImg} alt="" />
                        ):(
                            <div className="head-default">K</div>
                        )
                    }
                </div>
                <div>
                    <div>{name}</div>
                    <div>
                        <span>{lensHandle}</span>
                    </div>
                </div>
            </div>
            <div className="msg">{msg}</div>
            <div className="msg-img">
                <img src={commentImg} />
            </div>
            <div className="pro-data">
                <div>
                    <span>
                        <img src={IconG1} alt="" />
                    </span>
                    <span>{iconNum1}</span>
                </div>
                <div>
                    <span style={{ color: "red" }}>
                        <img src={IconG2} alt="" style={{ color: "red" }} />
                    </span>
                    <span>{iconNum2}</span>
                </div>
                <div>
                    <span>
                        <img src={IconG3} alt="" />
                    </span>
                    <span>{iconNum3}</span>
                </div>
                {/* <div>
                    <span>
                        <img src={IconG4} alt="" />
                    </span>
                    <span>{iconNum4}</span>
                </div> */}
            </div>
        </div>
    );
};

export default Comment;
