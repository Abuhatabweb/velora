// api connect
let products = [];

let api = "api/products.json";
let response = new XMLHttpRequest();
response.open("GET", api);
response.send();
response.onreadystatechange = function () {
  if (this.status === 200 && this.readyState === 4) {
    products = JSON.parse(this.response);
  }
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Navigation
document.querySelector(".nav-home").addEventListener("click", () => {
  document.getElementById("home").style.display = "block";
  document.getElementById("products").style.display = "none";
});

document.querySelector(".explore").addEventListener("click", () => {
  document.getElementById("home").style.display = "none";
  document.getElementById("products").style.display = "block";
  renderProducts();
});

document.querySelector(".nav-products").addEventListener("click", () => {
  document.getElementById("home").style.display = "none";
  document.getElementById("products").style.display = "block";
  renderProducts();
});

// Cart Icon
document.querySelector(".cart-icon").addEventListener("click", () => {
  document.querySelector(".cart-sidebar").classList.toggle("active");
});

// Render Products
function renderProducts() {
  const grid = document.querySelector(".products-grid");
  grid.innerHTML = "";

  products.forEach((product) => {
    if (product.name !== "") {
      const card = document.createElement("div");
      card.className = "product-card";

      const priceHTML = product.discount
        ? `<div class="price-section">
                <span class="original-price">$${product.price}</span>
                <span class="discount">${product.discount}% off</span>
                <div>$${(product.price * (1 - product.discount / 100)).toFixed(
                  2
                )}</div>
            </div>`
        : `<div class="price-section">
      <span class="original-price"> <br></span>
      <span class="discount"></span>
      <div>$${product.price}</div>
  </div>`;
      if (product.avilability == true) {
        card.innerHTML = `
            <img src="${product.img}" class="product-img" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            ${priceHTML}
            <button class="add-to-cart" data-id="${product.name}">Add to Cart</button>
        `;
        card.querySelector(".add-to-cart").addEventListener("click", () => {
          if (!cart.find((item) => item.name === product.name)) {
            cart.push({ ...product, quantity: 1 });
            updateCart();
          }
        });
      } else {
        card.innerHTML = `
            <img src="${product.img}" class="product-img" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            ${priceHTML}
            <button class="not-add-to-cart" data-id="${product.name}">Not Avilable</button>
        `;
      }

      grid.appendChild(card);
    }
  });
}

// Update Cart
function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  document.querySelector(".cart-count").textContent = cart.length;

  const cartItems = document.querySelector(".cart-items");
  cartItems.innerHTML = "";

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * (1 - (item.discount || 0) / 100) * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
            <img src="${item.img}" class="cart-item-img" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="quantity-controls">
                    <button data-index="${index}" class="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button data-index="${index}" class="increase">+</button>
                </div>
            </div>
            <div>$${(
              item.price *
              (1 - (item.discount || 0) / 100) *
              item.quantity
            ).toFixed(2)}</div>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;

    // Decrease button (prevent deletion when quantity reaches 0)
    cartItem.querySelector(".decrease").addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        updateCart();
      }
    });

    // Increase button
    cartItem.querySelector(".increase").addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      cart[index].quantity++;
      updateCart();
    });

    // Delete button
    cartItem.querySelector(".delete-btn").addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1); // Remove the item from the cart
      updateCart();
    });

    cartItems.appendChild(cartItem);
  });

  document.querySelector(".total-price").textContent = `Total: $${total.toFixed(
    2
  )}`;
}

// WhatsApp Purchase
document.querySelector(".buy-btn").addEventListener("click", () => {
  if (cart == "") {
    alert("Add something");
  } else {
    const message = `Order Details:%0A${cart
      .map(
        (item) =>
          `${item.name} x${item.quantity} - $${(
            item.price *
            (1 - (item.discount || 0) / 100) *
            item.quantity
          ).toFixed(2)}`
      )
      .join("%0A")}%0ATotal: $${cart
      .reduce(
        (sum, item) =>
          sum + item.price * (1 - (item.discount || 0) / 100) * item.quantity,
        0
      )
      .toFixed(2)}`;

    window.open(`https://wa.me/+201551891064?text=${message}`, "_blank");
  }
});

// Initial render
updateCart();
