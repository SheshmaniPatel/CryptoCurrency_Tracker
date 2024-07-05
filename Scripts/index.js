const tableBody = document.getElementById("crypto-table-body");
const shimmerContainer = document.querySelector(".shimmer-container");
const peginationContainer = document.querySelector(".pegination");
const sortPriceAsc = document.getElementById("sort-price-asc");
const sortPriceDesc = document.getElementById("sort-price-desc");
const sortVolumeAsc = document.getElementById("sort-volume-asc");
const sortVolumeDesc = document.getElementById("sort-volume-desc");
const searchCoin = document.getElementById("search-box");

const url =
  "https://api.coingecko.com/api/v3/coins/markets?page=1&vs_currency=usd&per_page=100&order=market_cap_desc";

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
//**Fetching favourites coins id from localStorage*/
const fetchFavouriteCoins = () => {
  return JSON.parse(localStorage.getItem("favourites")) || [];
};

//**Saving favourites coinsId to local storage */
const saveFavouriteCoins = (favourites) => {
  localStorage.setItem("favourites", JSON.stringify(favourites));
};

const handleFavClick = (coinId) => {
  let favourites = fetchFavouriteCoins();
  //checking if it is already present
  if (favourites.includes(coinId)) {
    favourites = favourites.filter((id) => id !== coinId);
  } else {
    favourites.push(coinId);
  }

  saveFavouriteCoins(favourites);
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
};

//****************Handle Sorting ****************/
//Sorting by price
const sortCoinsByPrice = (order) => {
  if (order === "asc") {
    coins.sort((a, b) => a.current_price - b.current_price);
  } else if (order === "desc") {
    coins.sort((a, b) => b.current_price - a.current_price);
  }
  currentPage = 1;
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
  renderPegination(coins);
};

//adding eventlistners on icon of price
sortPriceAsc.addEventListener("click", () => {
  sortCoinsByPrice("asc");
});

sortPriceDesc.addEventListener("click", () => {
  sortCoinsByPrice("desc");
});

//Sorting by Volume
const sortCoinsByVolume = (order) => {
  if (order === "asc") {
    coins.sort((a, b) => a.total_volume - b.total_volume);
  } else if (order === "desc") {
    coins.sort((a, b) => b.total_volume - a.total_volume);
  }
  currentPage = 1;
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
  renderPegination(coins);
};

//adding eventlistners on icon of price
sortVolumeAsc.addEventListener("click", () => {
  sortCoinsByVolume("asc");
});

sortVolumeDesc.addEventListener("click", () => {
  sortCoinsByVolume("desc");
});

//****************Handle Search ****************/
const handleSearch = () => {
  const searchQuery = searchCoin.value.trim();
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  currentPage = 1;
  displayCoins(getCoinsToDisplay(filteredCoins, currentPage), currentPage);
  renderPegination(filteredCoins);
};
 // adding EventListner to searchbox
searchCoin.addEventListener("input", handleSearch);

// rendering the data on page
const displayCoins = (coins, currentPage) => {
  const startIndex = (currentPage - 1) * coinsPerPage + 1;
  const favourites = fetchFavouriteCoins();
  tableBody.innerHTML = "";
  coins.forEach((coin, index) => {
    const row = document.createElement("tr");
    const isFavourite = favourites.includes(coin.id);
    row.innerHTML = `
            <td>${startIndex + index}</td>
            <td><img src="${coin.image}" alt="${
      coin.name
    }" width="24" height="24" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td><i class="fas fa-star favourite-icon ${
              isFavourite ? "favourite" : ""
            } " data-id="${coin.id}"></i></td>
    
    `;

    row.addEventListener("click",()=>{
      window.open(`coin/coins.html?id=${coin.id}`,"_blank")
    })

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
      displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
      updatePeginationBtn();
    });

    peginationContainer.appendChild(pageBtn);
  }
};

//Updating pagination btn
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
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
    renderPegination(coins);
    hideShimmer();
  } catch (error) {
    console.log(error);
    hideShimmer();
  }
});
