const tableBody = document.getElementById("crypto-table-body");
const shimmerContainer = document.querySelector(".shimmer-container");
const peginationContainer = document.querySelector(".pegination");

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
let coinsPerPage = 15;
let currentPage = 1;

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

// Show Shimmer effect
const showShimmer = () => {
  shimmerContainer.style.display = "flex";
};
// Hide Shimmer effect
const hideShimmer = () => {
  shimmerContainer.style.display = "none";
};

//pegination
const getCoinsToDisplay = (coins, page) => {
  const start = (currentPage - 1) * coinsPerPage;
  const end = start + coinsPerPage;
  return coins.slice(start, end);
};

//handle favorite click section
const handleFavClick = (coinId = {});

// rendering the data on page
const displayCoins = (coins,currentPage) => {
    const startIndex=(currentPage-1)*coinsPerPage+1;
  tableBody.innerHTML = "";
  coins.forEach((coin, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${startIndex+index}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price}</td>
            <td>$${coin.total_volume}</td>
            <td>$${coin.market_cap}</td>
            <td><i class="fa-solid fa-star favourite-icon" data-id="${
              coin.id
            }"></i></td>
    
    `;

    row.querySelector(".favourite-icon").addEventListener("click", (event) => {
      event.stopPropagation();
      handleFavClick(coin.id);
    });

    tableBody.appendChild(row);
  });
};

//Render Pegination
const renderPegination = (coins) => {
  const totalPage = Math.ceil(coins.length / coinsPerPage);
  peginationContainer.innerHTML = "";
  for (let i = 1; i <= totalPage; i++) {
    //creating buttons
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add("page-btn");
    if (i === currentPage) {
      pageBtn.classList.add("active");
    }

    //Allow click event on btn
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      displayCoins(getCoinsToDisplay(coins, currentPage),currentPage);
      updatePeginationBtn();
    });

    peginationContainer.appendChild(pageBtn);
  }
};

//Updating btn
const updatePeginationBtn = () => {
  const pageBtns = document.querySelectorAll(".page-btn");
  pageBtns.forEach((button, index) => {
    if (index + 1 === currentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    showShimmer();
    coins = await fetchcoins();
    displayCoins(getCoinsToDisplay(coins, currentPage),currentPage);
    renderPegination(coins);
    hideShimmer();
  } catch (error) {
    console.log(error);
    hideShimmer();
  }
});
