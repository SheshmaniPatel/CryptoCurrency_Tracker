const url =
  "https://coingecko.p.rapidapi.com/coins/markets?page=1&vs_currency=usd&per_page=100&order=market_cap_desc";
//  const tempurl =
//   "https://api.coingecko.com/api/v3/coins/markets?page=1&vs_currency=usd&per_page=100&order=market_cap_desc";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-rapidapi-key": "b7ca8eb6bdmsh0ec577917888618p10a818jsn29e4fe8baa1a",
    "x-rapidapi-host": "coingecko.p.rapidapi.com",
  },
};
let coins = [];

// fetching and handling the data from API

const fetchcoins = async () => {
  try {
    const response = await fetch(url, options);
    const coins = await response.json();
    return coins;
  } catch (error) {
    console.error(error);
  }
};
//handle favorite click section
const handleFavClick=(coinId)={};

// rendering the data on page

const displayCoins = (coins) => {
  const tableBody = document.getElementById("crypto-table-body");
  tableBody.innerHTML = "";
  coins.forEach((coin, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index+1}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price}</td>
            <td>$${coin.total_volume}</td>
            <td>$${coin.market_cap}</td>
            <td><i class="fa-solid fa-star favourite-icon" data-id="${coin.id}"></i></td>
    
    `;

    row.querySelector(".favourite-icon").addEventListener('click',(event)=>{
        event.stopPropagation(); 
        handleFavClick(coin.id);
    })

    tableBody.appendChild(row);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  coins = await fetchcoins();
  console.log(coins);
  displayCoins(coins);
});
