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
  currency?: string | null,
  locale?: string | null
): string {
  const safeLocale = locale || "en-GB";
  const safeCurrency = currency || "EUR";

  return new Intl.NumberFormat(safeLocale, {
    style: "currency",
    currency: safeCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
