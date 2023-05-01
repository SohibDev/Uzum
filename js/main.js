let pageSize = 20;
let activePage = 1;

const elTopList = findElement("#products-top");
const elTopTemplate = findElement("#product-template");

const ulCategories = findElement("#categories");
const loader = findElement("#loader");

const loginBtn = findElement("#login-btn");
const adminLink = findElement("#admin");

let allProductsCount = 0;
let token = localStorage.getItem("token");
const elPaginationList = findElement(".pagination");
const elSearch = findElement("#search");
let products = [];
let favoriteProducts = [];
let categories = [];

elSearch.addEventListener("change", () => {
  const value = elSearch.value;
  let searchResultArray;

  if (value === "") {
    searchResultArray = products;
  } else {
    searchResultArray = products.filter((product) => {
      if (product.name.includes(value)) {
        return product;
      }
    });
  }

  renderProducts(searchResultArray, elTopList, elTopTemplate);
});


const getData = async () => {
  try {
    changeLoading(true);
    const res = await fetch(BASE_URL + "/products");
    if (res.status === 404) {
      throw new Error("xato ketdi");
    }
    const res2 = await res.json();
    console.log(res2);
    allProductsCount = res2.length;

    elPaginationList.innerHTML = `
		<li id="prev" class="opacity-50 page-item page-link">
								&laquo;
							</li>`;
    for (let i = 0; i < Math.ceil(allProductsCount / pageSize); i++) {
      let newLi = document.createElement("li");

      newLi.className = "page-item page-link page-number";
      newLi.textContent = i + 1;
      if (activePage === i + 1) {
        newLi.style.color = "#fff";
        newLi.style.backgroundColor = "blue";
      }
      elPaginationList.appendChild(newLi);
    }
    elPaginationList.innerHTML += `
							<li id="next" class="page-item page-link">
							&raquo;
							</li>`;

    products = res2;

    renderProducts(res2.slice(0, 20), elTopList, elTopTemplate);
  } catch (x) {
    alert(x);
  } finally {
    changeLoading(false);
  }
};

elPaginationList.addEventListener("click", (event) => {
  if (event.target.classList.contains("page-number")) {
    const page = parseInt(event.target.textContent);
    activePage = page;
    renderProducts(
      products.slice((activePage - 1) * pageSize, activePage * pageSize),
      elTopList,
      elTopTemplate
    );
  } else if (event.target.id === "prev") {
    if (activePage > 1) {
      activePage--;
      renderProducts(
        products.slice((activePage - 1) * pageSize, activePage * pageSize),
        elTopList,
        elTopTemplate
      );
    }
  } else if (event.target.id === "next") {
    if (activePage < Math.ceil(products.length / pageSize)) {
      activePage++;
      renderProducts(
        products.slice((activePage - 1) * pageSize, activePage * pageSize),
        elTopList,
        elTopTemplate
      );
    }
  }

  const totalPages = Math.ceil(products.length / pageSize);
  let paginationHTML = `
    <li class="page-item ${activePage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" id="prev">Previous</a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${i === activePage ? "active" : ""}">
        <a class="page-link page-number" href="#">${i}</a>
      </li>
    `;
  }

  paginationHTML += `
    <li class="page-item ${activePage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" id="next">Next</a>
    </li>
  `;

  elPaginationList.innerHTML = paginationHTML;
});

getData();

if (token) {
  loginBtn.textContent = "Chiqish";
  adminLink.style.display = "block";
} else {
  adminLink.style.display = "none";
  loginBtn.textContent = "Kirish";
}

loginBtn.addEventListener("click", () => {
  let token = localStorage.getItem("token");

  if (token) {
    adminLink.style.display = "none";
    localStorage.removeItem("token");

    loginBtn.textContent = "Kirish";
  } else {
    window.location.href = "pages/login.html";
  }
});

fetch(BASE_URL + "categories")
  .then((res) => res.json())
  .then((res) => {
    categories = res;
    renderCategories(categories, ulCategories);
  });

const renderCategories = (array, parent) => {
  const newli = document.createElement("li");
  newli.className = "list-group-item";

  newli.textContent = "All";

  parent.appendChild(newli);
  array.forEach((category) => {
    const newli = document.createElement("li");
    newli.className = "list-group-item";

    newli.textContent = category.name;

    parent.appendChild(newli);
  });
};

ulCategories.addEventListener("click", (evt) => {
  const target = evt.target;

  if (target.className.includes("list-group-item")) {
    const category = target.textContent;

    const result = [];

    if (category.toLowerCase() !== "all".toLowerCase()) {
      products.forEach((product) => {
        if (product.category === category) {
          result.push(product);
          console.log(product);
        }
      });
      renderProducts(result, elTopList, elTopTemplate);
    } else {
      renderProducts(products, elTopList, elTopTemplate);
    }
  }
});

// 0 20

elTopList.addEventListener("click", (evt) => {
  const target = evt.target;

  if (target.id.includes("like") || target.id === "path") {
    const id = Number(target.dataset.id);

    products.forEach((product) => {
      if (+product.id === id) {
        product.isFavorite = !product.isFavorite;

        fetch(BASE_URL + `products/${id}`, {
          method: "put",
          body: JSON.stringify({
            ...product,
            isFavorite: product.isFavorite,
          }),
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
          });
      }
    });

    renderProducts(products, elTopList, elTopTemplate);
  }
});
