const template = findElement("#product-template");
const elParent = findElement("#products-favorites");
const loader = findElement("#loader");

let favoriteProducts = [];

fetch("https://63d3e856a93a149755b5c8f1.mockapi.io/products/")
  .then((res) => res.json())
  .then((data) => {
    const result = data.filter((product) => {
      if (product.isFavorite) {
        return product;
      }
    });
    favoriteProducts = result;
    if (favoriteProducts.length == 0) {
      alert("Saralangan mahsulotlaringiz yo\'q")
      
    }
    renderProducts(result, elParent, template);
  });
changeLoading(false);

elParent.addEventListener("click", (evt) => {
  const target = evt.target;
  if (target.id.includes("like") || target.id === "path") {
    const id = Number(target.dataset.id);
    changeLoading(true);

	elParent.style.display = "none";
    favoriteProducts.forEach((product) => {
      if (+product.id === id) {
        product.isFavorite = !product.isFavorite;

        fetch(`https://63d3e856a93a149755b5c8f1.mockapi.io/products/${id}`, {
          method: "put",
          body: JSON.stringify({
            ...product,
            isFavorite: product.isFavorite,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            fetch("https://63d3e856a93a149755b5c8f1.mockapi.io/products/")
              .then((res) => res.json())
              .then((data) => {
                const result = data.filter((product) => {
                  if (product.isFavorite) {
                    return product;
                  }
                });
                changeLoading(false);
				elParent.style.display = "flex";
                favoriteProducts = result;
                renderProducts(result, elParent, template);
              });
          });
      }
    });
  }
});
