"use strict";

const token = localStorage.getItem("token");
console.log(token);
if (!token) {
  console.log(token);
  window.location.href = '../index.html'
}

const elTopList = findElement("#products-top");
const elTopTemplate = findElement("#product-template");

const loader = findElement("#loader");

const elForm = findElement("#add-form");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const elTitle = evt.target.title.value;
  const elImage = evt.target.image.value;
  const elPrice = evt.target.price.value;
  const elRating = evt.target.rating.value;
  const elCategory = evt.target.category.value;

  const newProduct = {
    createdAt: new Date(),
    name: elTitle,
    image: elImage,
    price: elPrice,
    rating: elRating,
    category: elCategory,
  };
  const elSubmit = findElement("#submit-btn");

  elSubmit.disabled = "true";

  fetch(BASE_URL + "/products", {
    method: "post",
    body: JSON.stringify(newProduct),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.reload();
      console.log(data);
      elSubmit.disabled = "";
    });
});

function changeLoading(isLoading) {
  if (isLoading) {
    loader.style.display = "block";
  } else {
    loader.style.display = "none";
  }
}

let products = [];
let favoriteProducts = [];

const BASE_URL = "https://63d3e856a93a149755b5c8f1.mockapi.io/";

const getData = async () => {
  try {
    changeLoading(true);
    const res = fetch(BASE_URL + "/products");
    if (res.status === 400) {
      throw "xato ketdi";
    }
    const res2 = await (await res).json();
    products = res2;
    renderProducts(products, elTopList, elTopTemplate, true);
  } catch (x) {
    alert(x);
  } finally {
    changeLoading(false);
  }
};
getData();

elTopList.addEventListener("click", (evt) => {
  const target = evt.target;
  if (target.className.includes("btn-danger")) {
    console.log(target);
    const id = Number(target.dataset.id);
    console.log(id);
    fetch(BASE_URL + `/products/${id}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        window.location.reload();
      });
  }

  renderProducts(products, elTopList, elTopTemplate);
});
