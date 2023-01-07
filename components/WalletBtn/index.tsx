import config from "../../config";
import { shortenAddr, switchChain } from "../../lib/tool";
import useWeb3Context from "../../hooks/useWeb3Context";

export default function Wallet() {
  const { account, connectWallet, chainId } = useWeb3Context();

  return (
    <div>
      {account ? (
        <>
          {account && chainId && config.chainId !== chainId ? (
            <div
              className="topscore-head-wallet-btn"
              onClick={() => switchChain(config.chainId)}
            >
              Switch to polygon
            </div>
          ) :   <div className="topscore-head-wallet-btn">
          {shortenAddr(account)}
        </div>}
        </>
      ) : (
        <div
          onClick={() => connectWallet()}
          className="topscore-head-wallet-btn"
        >
          Connect Wallet
        </div>
      )}
    </div>
  );
}
