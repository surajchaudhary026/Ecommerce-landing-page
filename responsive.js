// Change navbar background on scroll
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Toggle modal by ID
function toggleModal(id) {
  const modal = document.getElementById(id);
  modal.classList.toggle("hidden");
}

// Cart functionality with localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productName, price) {
  const item = cart.find(i => i.productName === productName);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ productName, price: parseFloat(price.replace(/[^0-9.]/g, '')), quantity: 1 });
  }
  alert(`${productName} added to cart!`);
  updateCartIcon();
  saveCart();
}

function updateCartIcon() {
  const icon = document.querySelector(".cart-icon");
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  icon.setAttribute("title", `Items in cart: ${totalItems}`);
}

// DOMContentLoaded setup
window.onload = function () {
  const buttons = document.querySelectorAll(".product-card button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = btn.closest(".product-card");
      const name = card.querySelector("h3").innerText;
      const price = card.querySelector("p").innerText;
      addToCart(name, price);
    });
  });

  const cards = document.querySelectorAll(".product-card img");
  cards.forEach(img => {
    img.addEventListener("click", function () {
      const card = img.closest(".product-card");
      const name = card.querySelector("h3").innerText;
      const price = card.querySelector("p").innerText;
      showProductDetail(img.src, name, price);
    });
  });

  updateCartIcon();
  loadUser();
};

// Show product detail popup
function showProductDetail(image, name, price) {
  const detailModal = document.createElement("div");
  detailModal.className = "modal";
  detailModal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <img src="${image}" style="width: 100%; height: auto; margin-bottom: 1rem;">
      <h2>${name}</h2>
      <p style="font-weight: bold;">${price}</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec leo eu erat gravida blandit.</p>
    </div>
  `;
  document.body.appendChild(detailModal);
}

// Show cart summary popup
function showCart() {
  const modal = document.createElement("div");
  modal.className = "modal";
  let items = cart.map(item => `<p>${item.productName} x${item.quantity} - ₹${item.price * item.quantity}</p>`).join('');
  let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>Cart Summary</h2>
      ${items || '<p>Your cart is empty.</p>'}
      <hr>
      <h3>Total: ₹${total}</h3>
      <button onclick="checkout()">Proceed to Checkout</button>
    </div>
  `;
  document.body.appendChild(modal);
}

document.querySelector(".cart-icon").addEventListener("click", showCart);

// Checkout logic with order summary
function checkout() {
  const modal = document.querySelector(".modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Order Confirmed ✅</h2>
      <p>Thank you for your purchase!</p>
      <p>Your order of ₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} has been placed successfully.</p>
      <button onclick="modal.remove()">Close</button>
    </div>
  `;
  cart = [];
  saveCart();
  updateCartIcon();
}

// Registration/Login (localStorage only)
function registerUser() {
  const name = prompt("Enter your name:");
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  if (name && email && password) {
    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    alert("User registered successfully.");
  }
}

function loadUser() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const nav = document.getElementById("navbar");
    if (nav && !document.getElementById("user-greeting")) {
      const greet = document.createElement("span");
      greet.id = "user-greeting";
      greet.style.marginLeft = "1rem";
      greet.textContent = `👋 Hi, ${user.name}`;
      nav.appendChild(greet);
    }
  }
}

// Dark/Light mode toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// Load theme
(function applyTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
})();
