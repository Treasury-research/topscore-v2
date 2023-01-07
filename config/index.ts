import envConf from "./polygon";

export const baseURL = "https://lens-api.knn3.xyz/api";

export const infuraId = "997ec38ed1ff4c818b45a09f14546530";

export const endpoint = `https://mainnet.infura.io/v3/${infuraId}`;

export default {
  baseURL,
  knn3Endpoint: "https://master.graphql.knn3.xyz/graphql",
  knn3Credentials: "https://credentials.knn3.xyz/api/#/",
  graphScan: "https://www.etherscan.com",
  graphProvider:
    "https://eth-mainnet.g.alchemy.com/v2/K9UhC2MV5uPm_j7WIRSWCrSJyaKg6Ggm",
  ...envConf,
};
