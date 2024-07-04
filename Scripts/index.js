const url =
  "https://coingecko.p.rapidapi.com/coins/markets?page=1&vs_currency=usd&per_page=100&order=market_cap_desc";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-rapidapi-key": "b7ca8eb6bdmsh0ec577917888618p10a818jsn29e4fe8baa1a",
    "x-rapidapi-host": "coingecko.p.rapidapi.com",
  },
};
let coins = [];

const fetchcoins = async () => {
  try {
    const response = await fetch(url, options);
    coins = await response.json();
    console.log(coins);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
window.onload = fetchcoins();
