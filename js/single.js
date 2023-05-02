const id = localStorage.getItem("id");
const template = document.querySelector("#product-template");
const card = document.querySelector(".card");
const headerSvg = document.querySelector("svg");
const similarProductsContainer = document.querySelector(
  "#similar-products-container"
);
const categoryContainer = document.querySelector("#category-container");

headerSvg.addEventListener("click", () => {
  window.location.href = "index.html";
});

function setProductID(id) {
  localStorage.setItem("id", id);
}

async function fetchProduct(id) {
  const response = await fetch(BASE_URL + "products/" + id);
  const data = await response.json();
  return data;
}

async function fetchSimilarProducts(category) {
  const response = await fetch(BASE_URL + "products?category=" + category);
  const data = await response.json();
  return data;
}

async function fetchCategories() {
  const response = await fetch(BASE_URL + "categories");
  const data = await response.json();
  return data;
}

async function renderPage() {
  const product = await fetchProduct(id);
  renderProducts([product], card, template);

  const similarProducts = await fetchSimilarProducts(product.category);
  similarProductsContainer.innerHTML = `
    <h2 class="mt-5">Similar Products:</h2> 
    <div class="row row-cols-1 row-cols-md-3 g-4">
      ${similarProducts
        .map(
          (product) => `
        <div class="col" style="box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2)
        ;">
          <div class="card h-100">
            <img src="${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text d-inline-block text-truncate" style="max-width: 150px">${product.body}</p>
              <button class="btn btn-primary" onclick="setProductID(${product.id}); window.location.href='single-product.html'">View </button>
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  const categories = await fetchCategories();
  const categorySet = new Set();
  categories.forEach((category) => categorySet.add(category.name));
  categoryContainer.innerHTML = `
  <div class="d-flex flex-wrap justify-content-between align-items-center" style="box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
  <h5>Categories:</h5> 
  <button class="btn btn-secondary d-block d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#categoryCollapse" aria-expanded="false" aria-controls="categoryCollapse"> Show/Hide </button> 
</div> 
<div class="collapse d-md-block" id="categoryCollapse"> 
  <div class="list-group"> 
    ${Array.from(categorySet)
      .map(
        (category) => `
      <a href="#" class="list-group-item" style="box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2)
      ;">${category}</a>
    `
      )
      .join("")} 
  </div> 
</div>

  `;
}

renderPage();
