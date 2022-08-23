# Stripe Crypto

- Pay a Stripe Invoice with crypto
- Invoice is automatically set to paid when funds are transferred to set address

### Todo

- [ ] Dashboard
  - [ ] Connect Stripe
  - [ ] Store wallet address on user
- [x] Create Alchemy webhook for incoming tx to address
  - [x] Append Stripe `invoice.id` to URL
  - [ ] Create db entry with mapping of webhookId to invoiceId
- [ ] Receive Alchemy webhook
  - [x] Get Stripe `invoice.id` from URL (does this work?)
  - [ ] Get `source = event.activity.hash` from webhook data
  - [ ] Pay Stripe invoice
    - [ ] `stripe.invoices.pay(id, { paid_out_of_bounds: true, source }`
- [x] ERC20 test token on Goerli
- [ ] Test flow
  - [ ] Create invoice in Stripe
    - [ ] Add wallet address to footer
  - [ ] View invoice in /invoices
  - [ ] Create Webhook
  - [ ] View Pay page
    - [ ] Verify test invoice
    - [ ] Verify invoice amount is correct
  - [ ] Pay with crypto
    - [ ] Verify Stripe invoice has been marked as paid with tx hash as source

```ts
const sdk = require("api")("@alchemy-docs/v1.0#1q84j11l6middf5");

sdk.createWebhook({
  addresses: ["0x..."],
  network: "ETH", // ETH_GOERLI
  webhook_type: "ADDRESS_ACTIVITY",
  webhook_url: "http://localhost:3000?invoice=in_1LYpKYCdAxqeKAjis9rxWzur",
});

// Received webhook data
// https://docs.alchemy.com/reference/notify-api-quickstart#3-address-activity
{
  "webhookId": "wh_octjglnywaupz6th",
  "id": "whevt_ogrc5v64myey69ux",
  "createdAt": "2022-02-28T17:48:53.306Z",
  "type": "ADDRESS_ACTIVITY",
  "event": {
    "network": "ETH_MAINNET",
    "activity": [
      {
        "category": "token",
        "fromAddress": "0x59479de9d374bdbcba6c791e5d036591976fe422",
        "toAddress": "0x59479de9d374bdbcba6c791e5d036591976fe425",
        "erc721TokenId": "0x1",
        "rawContract": {
          "rawValue": "0x",
          "address": "0x93C46aA4DdfD0413d95D0eF3c478982997cE9861"
        },
        "log": {
          "removed": false,
          "address": "0x93C46aA4DdfD0413d95D0eF3c478982997cE9861",
          "data": "0x",
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x00000000000000000000000059479de9d374bdbcba6c791e5d036591976fe422",
            "0x00000000000000000000000059479de9d374bdbcba6c791e5d036591976fe425",
            "0x0000000000000000000000000000000000000000000000000000000000000001"
          ]
        }
      }
    ]
  }
}
```
