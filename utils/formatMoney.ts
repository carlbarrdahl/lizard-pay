export function formatMoney(val = 0, decimals = 2, currency = "USD") {
  return Number(val).toLocaleString("en-US", {
    currency,
    style: "currency",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
