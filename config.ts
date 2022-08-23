// export const tokens = {
//   usdc: {
//     1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
//     5: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
//   },
// };

// export const etherscan = {
//   1: "https://etherscan.io",
//   5: "https://goerli.etherscan.io",
// };

// export const alchemy = {
//   1: "https://eth-mainnet.alchemyapi.io/v2",
//   5: "https://eth-goerli.alchemyapi.io/v2",
// };

export const config = {
  1: {
    alchemy: "https://eth-mainnet.alchemyapi.io/v2",
    etherscan: "https://etherscan.io",
    tokens: {
      usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    },
  },
  5: {
    alchemy: "https://eth-goerli.alchemyapi.io/v2",
    etherscan: "https://goerli.etherscan.io",
    tokens: {
      usdc: "0xbdDC7e710059ee36703a580F9780b00147a46424",
      // usdc: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
    },
  },
};
