// // src/utils/formatCurrency.ts
// export function formatCurrencyNumber(
//   amount: number,
//   currency: string,
//   locale: string
// ): string {
//   return new Intl.NumberFormat(locale, {
//     style: "currency",
//     currency,
//   }).format(amount);
// }


export function formatCurrencyNumber(
  amount: number,
  currency: string,
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2, // always show 2 decimal places
    maximumFractionDigits: 2,
  }).format(amount);
}
