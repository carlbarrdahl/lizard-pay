import axios from "axios";

const baseURL = "https://dashboard.alchemyapi.io/api";
const apiKey = "KFtqMHMJTcv7b8wrJQqBdeGGnap8AUQm";
const config = { headers: { "x-alchemy-token": apiKey } };

export const createWebhook = (data: any) =>
  axios
    .post(`${baseURL}/create-webhook`, data, config)
    .then(({ data }) => data.data);

export const deleteWebhook = (id: string) =>
  axios
    .delete(`${baseURL}/delete-webhook?webhook_id=${id}`, config)
    .then(({ data }) => data.data);

export const getTransactions = (params: any, { network = 1 }) => {
  return axios
    .post(
      `https://eth-goerli.g.alchemy.com/v2/SqRHw2HjBjLCbvoAu0TYCirdJhF_wsaC`,
      {
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [params],
      }
    )
    .then(({ data }) => data);
};
