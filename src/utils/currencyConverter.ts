export const centsToDollars = (cents: number) => {
  return (cents / 100).toFixed(2);
};

export const dollarsToCents = (dollars: number) => {
  return Math.round(dollars * 100);
};
