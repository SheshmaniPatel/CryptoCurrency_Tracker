const tableBody = document.getElementById("crypto-table-body");
const shimmerContainer = document.querySelector(".shimmer-container");
const noFavouriteCoin = document.getElementById("no-favourites");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-rapidapi-key": "b7ca8eb6bdmsh0ec577917888618p10a818jsn29e4fe8baa1a",
    "x-rapidapi-host": "coingecko.p.rapidapi.com",
  },
};
//**Getting favourites coins id from localStorage*/
const getFavouriteCoins = () => {
  return JSON.parse(localStorage.getItem("favourites")) || [];
};

const fetchFavouritescoins = async (coinIds) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?page=1&vs_currency=usd&ids=${coinIds.join(
        ","
      )}`,
      options
    );
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

//*Displaying favoirite */
const displayFavouriteCoins = (favCoins) => {
  tableBody.innerHTML = "";
  favCoins.forEach((coin, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${coin.image}" alt="${
      coin.name
    }" width="24" height="24" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
             
        `;
    row.addEventListener("click", () => {
      window.open(`../coin/coins.html?id=${coin.id}`, "_blank");
    });
    tableBody.appendChild(row);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    showShimmer();
    const favorite = getFavouriteCoins();
    if (favorite.length > 0) {
      const favouritesCoins = await fetchFavouritescoins(favorite);
      displayFavouriteCoins(favouritesCoins);
    } else {
      noFavouriteCoin.style.display = "block";
    }
    hideShimmer();
  } catch (error) {
    console.log(error);
    hideShimmer();
  }
});
