// app.js

const DEMO_FAILURE_MODE = false; // Set to true to simulate a checkout failure or other demo breaks

const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "Test@123";

const productsData = [
    { id: "1", name: "Wireless Mouse", price: 29.99, description: "Ergonomic wireless mouse with 2.4GHz connectivity.", image: "https://via.placeholder.com/200?text=Mouse" },
    { id: "2", name: "Mechanical Keyboard", price: 89.99, description: "RGB mechanical keyboard with blue switches.", image: "https://via.placeholder.com/200?text=Keyboard" },
    { id: "3", name: "USB-C Hub", price: 39.99, description: "7-in-1 USB-C hub with HDMI and card reader.", image: "https://via.placeholder.com/200?text=Hub" },
    { id: "4", name: "Bluetooth Headphones", price: 129.99, description: "Noise-cancelling over-ear headphones.", image: "https://via.placeholder.com/200?text=Headphones" },
    { id: "5", name: "Laptop Stand", price: 49.99, description: "Adjustable aluminum laptop stand.", image: "https://via.placeholder.com/200?text=Stand" },
    { id: "6", name: "Webcam", price: 59.99, description: "1080p HD webcam with built-in microphone.", image: "https://via.placeholder.com/200?text=Webcam" }
];

// Utility functions
function getCart() {
    return JSON.parse(localStorage.getItem("cloudshop_cart")) || [];
}

function updateCart(cart) {
    localStorage.setItem("cloudshop_cart", JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart(cart);
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    updateCart(cart);
    renderCart();
}

function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

function updateCartCount() {
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
        const cart = getCart();
        const count = cart.reduce((c, item) => c + item.quantity, 0);
        cartCountEl.textContent = count;
    }
}

// Page logic
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    // Login logic
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const errorEl = document.getElementById("login-error");
            const successEl = document.getElementById("login-success");

            errorEl.style.display = "none";
            successEl.style.display = "none";

            if (email === TEST_EMAIL && password === TEST_PASSWORD) {
                localStorage.setItem("cloudshop_user", email);
                successEl.style.display = "block";
                successEl.textContent = "Login successful! Redirecting...";
                setTimeout(() => window.location.href = "products.html", 1000);
            } else {
                errorEl.style.display = "block";
                errorEl.textContent = "Invalid email or password.";
            }
        });
    }

    // Products page logic
    const productsContainer = document.getElementById("products-container");
    if (productsContainer) {
        renderProducts(productsData);

        const searchBtn = document.getElementById("search-submit");
        if (searchBtn) {
            searchBtn.addEventListener("click", () => {
                const query = document.getElementById("search-box").value.toLowerCase();
                const filtered = productsData.filter(p => p.name.toLowerCase().includes(query));
                renderProducts(filtered);
            });
        }
    }

    // Cart page logic
    const cartContainer = document.getElementById("cart-container");
    if (cartContainer) {
        renderCart();
    }

    // Checkout logic
    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
        const cart = getCart();
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before checkout.");
            window.location.href = "products.html";
            return;
        }

        placeOrderBtn.addEventListener("click", (e) => {
            e.preventDefault();
            
            if (DEMO_FAILURE_MODE) {
                alert("Simulated failure: Checkout processing error.");
                return;
            }

            const fullName = document.getElementById("full-name").value;
            if (!fullName) {
                alert("Please fill in the required fields.");
                return;
            }

            const orderId = "ORD-" + Math.floor(Math.random() * 1000000);
            const total = calculateTotal(cart);

            const orderInfo = {
                orderId,
                fullName,
                total,
                items: cart
            };

            localStorage.setItem("cloudshop_order", JSON.stringify(orderInfo));
            localStorage.removeItem("cloudshop_cart");
            window.location.href = "confirmation.html";
        });
    }

    // Confirmation logic
    const confirmationBox = document.getElementById("order-confirmation");
    if (confirmationBox) {
        const order = JSON.parse(localStorage.getItem("cloudshop_order"));
        if (!order) {
            confirmationBox.innerHTML = "<p>No order found.</p>";
            return;
        }

        document.getElementById("conf-order-id").textContent = order.orderId;
        document.getElementById("conf-name").textContent = order.fullName;
        document.getElementById("conf-total").textContent = "$" + order.total;
    }
});

function renderProducts(products) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    if (products.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }
    products.forEach(product => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <p>${product.description}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        container.appendChild(div);
    });

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            addToCart(e.target.getAttribute("data-id"));
        });
    });
}

function renderCart() {
    const container = document.getElementById("cart-container");
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("cart-total").textContent = "0.00";
        return;
    }

    container.innerHTML = "";
    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart('${item.id}')">Remove</button>
        `;
        container.appendChild(div);
    });

    document.getElementById("cart-total").textContent = calculateTotal(cart);
}
