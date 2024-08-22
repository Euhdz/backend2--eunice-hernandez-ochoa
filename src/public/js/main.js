const socket = io();

socket.on("products", (data) => {
  renderProducts(data);
});

const renderProducts = (data) => {
  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("div");

    card.innerHTML = `<p> Id# ${item.id} </p>
        <h5 class="card-title"> ${item.title} </h5>
    <p> ${item.description} </p>
    <p> $ ${item.price} </p>
    <button> Delete </button>
    `;
    productsContainer.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      deleteProduct(item.id);
    });
  });
};

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

document.getElementById("btnSend").addEventListener("click", () => {
  addProduct();
  clearFormFields();
});

const addProduct = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: document.getElementById("price").value,
    status: document.getElementById("status").value === "true",
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    thumbnails: document.getElementById("thumbnails").value,
  };
  socket.emit("addProduct", product);
};

const clearFormFields = () => {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("code").value = "";
  document.getElementById("price").value = "";
  document.getElementById("status").value === "true";
  document.getElementById("stock").value = "";
  document.getElementById("category").value = "";
  document.getElementById("thumbnails").value = "";
};
