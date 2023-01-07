import type { AppProps } from "next/app";
import { Web3ContextProvider } from "../context/Web3Context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "../styles/custom.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ContextProvider>
      <Component {...pageProps} />
      <ToastContainer position="top-right" />
    </Web3ContextProvider>
  );
}
