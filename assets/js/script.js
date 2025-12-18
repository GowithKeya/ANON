'use strict';

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function
const modalCloseFunc = function () { modal.classList.add('closed') }

// modal eventListener
if (modalCloseOverlay && modalCloseBtn) {
  modalCloseOverlay.addEventListener('click', modalCloseFunc);
  modalCloseBtn.addEventListener('click', modalCloseFunc);
}





// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
if (toastCloseBtn) {
  toastCloseBtn.addEventListener('click', function () {
    notificationToast.classList.add('closed');
  });
}





// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

  // mobile menu function
  const mobileMenuCloseFunc = function () {
    if (mobileMenu[i]) mobileMenu[i].classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }

  mobileMenuOpenBtn[i].addEventListener('click', function () {
    if (mobileMenu[i]) mobileMenu[i].classList.add('active');
    if (overlay) overlay.classList.add('active');
  });

  if (mobileMenuCloseBtn[i]) mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  if (overlay) overlay.addEventListener('click', mobileMenuCloseFunc);

}





// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {

    const clickedBtn = this.nextElementSibling.classList.contains('active');

    for (let i = 0; i < accordion.length; i++) {

      if (clickedBtn) break;

      if (accordion[i].classList.contains('active')) {

        accordion[i].classList.remove('active');
        accordionBtn[i].classList.remove('active');

      }

    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');

  });

}

// script.js
document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");

  const chatbotIcon = document.getElementById("chatbot-icon");
  const closeButton = document.getElementById("close-btn");

  // Toggle chatbot visibility when clicking the icon
  // Show chatbot when clicking the icon
  if (chatbotIcon) {
    chatbotIcon.addEventListener("click", function () {
      if (chatbotContainer) chatbotContainer.classList.remove("hidden");
      chatbotIcon.style.display = "none"; // Hide chat icon
    });
  }

  // Also toggle when clicking the close button
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      if (chatbotContainer) chatbotContainer.classList.add("hidden");
      if (chatbotIcon) chatbotIcon.style.display = "flex"; // Show chat icon again
    });
  }

  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (chatbotInput) {
    chatbotInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
      appendMessage("user", userMessage);
      chatbotInput.value = "";
      getBotResponse(userMessage);
    }
  }

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  async function getBotResponse(userMessage) {
    const apiKey = "sk-YOUR_API_KEY_HERE";
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5",
          messages: [{ role: "user", content: userMessage }],
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      const botMessage = data.choices[0].message.content;
      appendMessage("bot", botMessage);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      appendMessage("bot", "Sorry, something went wrong. Please try again.");
    }
  }
});


/**
 * Cart and Wishlist Functionality
 */

const cartWishlistManager = {
  init: function() {
    this.updateCounts();
    this.setupEventListeners();
    if (window.location.pathname.includes('cart.html')) {
      this.renderCart();
    }
    if (window.location.pathname.includes('wishlist.html')) {
      this.renderWishlist();
    }
  },

  getCart: function() {
    return JSON.parse(localStorage.getItem('anon-cart')) || [];
  },

  saveCart: function(cart) {
    localStorage.setItem('anon-cart', JSON.stringify(cart));
    this.updateCounts();
  },

  getWishlist: function() {
    return JSON.parse(localStorage.getItem('anon-wishlist')) || [];
  },

  saveWishlist: function(wishlist) {
    localStorage.setItem('anon-wishlist', JSON.stringify(wishlist));
    this.updateCounts();
  },

  addToCart: function(product) {
    let cart = this.getCart();
    const existingItem = cart.find(item => item.title === product.title);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    this.saveCart(cart);
    alert("Added to Cart!");
  },

  addToWishlist: function(product) {
    let wishlist = this.getWishlist();
    const existingItem = wishlist.find(item => item.title === product.title);
    
    if (!existingItem) {
      wishlist.push(product);
      this.saveWishlist(wishlist);
      alert("Added to Wishlist!");
    } else {
      alert("Already in Wishlist!");
    }
  },

  removeFromCart: function(title) {
    let cart = this.getCart();
    cart = cart.filter(item => item.title !== title);
    this.saveCart(cart);
    this.renderCart();
  },

  updateCartQuantity: function(title, change) {
    let cart = this.getCart();
    const item = cart.find(item => item.title === title);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(title);
        return;
      }
      this.saveCart(cart);
      this.renderCart();
    }
  },

  removeFromWishlist: function(title) {
    let wishlist = this.getWishlist();
    wishlist = wishlist.filter(item => item.title !== title);
    this.saveWishlist(wishlist);
    this.renderWishlist();
  },

  updateCounts: function() {
    const cart = this.getCart();
    const wishlist = this.getWishlist();
    
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const wishlistCount = wishlist.length;

    document.querySelectorAll('.header-user-actions .count, .mobile-bottom-navigation .count').forEach(el => {
      if (el.parentElement.href && el.parentElement.href.includes('cart.html')) {
        el.textContent = cartCount;
      } else if (el.parentElement.href && el.parentElement.href.includes('wishlist.html')) {
        el.textContent = wishlistCount;
      }
    });
  },

  extractProductData: function(element) {
    const showcase = element.closest('.showcase');
    if (!showcase) return null;

    const titleEl = showcase.querySelector('.showcase-title');
    const imgEl = showcase.querySelector('.product-img') || showcase.querySelector('.showcase-img');
    const priceEl = showcase.querySelector('.price');
    const delEl = showcase.querySelector('del');

    if (!titleEl || !priceEl) return null;

    const priceText = priceEl.textContent.replace(/[^0-9.]/g, '');
    const price = parseFloat(priceText);
    
    let originalPrice = null;
    if (delEl) {
       originalPrice = parseFloat(delEl.textContent.replace(/[^0-9.]/g, ''));
    }

    return {
      title: titleEl.textContent.trim(),
      image: imgEl ? imgEl.src : '',
      price: price,
      originalPrice: originalPrice,
      category: showcase.querySelector('.showcase-category') ? showcase.querySelector('.showcase-category').textContent.trim() : ''
    };
  },

  setupEventListeners: function() {
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-action') || e.target.closest('.add-cart-btn');
      if (!btn) return;

      const icon = btn.querySelector('ion-icon');
      
      // If it's the "Add to Cart" button in featured section or icon button
      if (btn.classList.contains('add-cart-btn') || (icon && icon.getAttribute('name') === 'bag-add-outline')) {
        e.preventDefault();
        const product = this.extractProductData(btn);
        if (product) this.addToCart(product);
      } else if (icon && icon.getAttribute('name') === 'heart-outline') {
        e.preventDefault();
        const product = this.extractProductData(btn);
        if (product) this.addToWishlist(product);
      }
    });
  },

  renderCart: function() {
    const tbody = document.querySelector('.cart-table tbody');
    const summaryWrapper = document.querySelector('.cart-summary-wrapper');
    
    if (!tbody) return;

    const cart = this.getCart();
    tbody.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const total = item.price * item.quantity;
      subtotal += total;
      const row = document.createElement('tr');
      row.innerHTML = `<td><div class="cart-product"><img src="${item.image}" class="cart-product-img"><div class="cart-product-info"><h4>${item.title}</h4><p>Price: &#8377;${item.price.toFixed(2)}</p></div></div></td><td>&#8377;${item.price.toFixed(2)}</td><td><div class="qty-input-group"><button class="qty-btn minus" data-title="${item.title}">-</button><input type="number" value="${item.quantity}" class="qty-input" readonly><button class="qty-btn plus" data-title="${item.title}">+</button></div></td><td><strong>&#8377;${total.toFixed(2)}</strong></td><td><button class="remove-btn" data-title="${item.title}"><ion-icon name="trash-outline"></ion-icon></button></td>`;
      tbody.appendChild(row);
    });

    tbody.querySelectorAll('.qty-btn.minus').forEach(btn => btn.addEventListener('click', () => this.updateCartQuantity(btn.dataset.title, -1)));
    tbody.querySelectorAll('.qty-btn.plus').forEach(btn => btn.addEventListener('click', () => this.updateCartQuantity(btn.dataset.title, 1)));
    tbody.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', () => this.removeFromCart(btn.dataset.title)));

    if (summaryWrapper) {
      const tax = subtotal * 0.18;
      const total = subtotal + tax;
      summaryWrapper.innerHTML = `<div class="cart-summary"><h3 class="summary-title">Cart Totals</h3><div class="summary-row"><span>Subtotal</span><span>&#8377;${subtotal.toFixed(2)}</span></div><div class="summary-row"><span>Shipping</span><span>Free</span></div><div class="summary-row"><span>Tax (18%)</span><span>&#8377;${tax.toFixed(2)}</span></div><div class="summary-total"><span>Total</span><span>&#8377;${total.toFixed(2)}</span></div><button class="checkout-btn">PROCEED TO CHECKOUT</button></div>`;
    }
  },

  renderWishlist: function() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    const wishlist = this.getWishlist();
    grid.innerHTML = wishlist.length === 0 ? '<p>Your wishlist is empty.</p>' : '';

    wishlist.forEach(item => {
      const card = document.createElement('div');
      card.className = 'showcase';
      card.innerHTML = `<div class="showcase-banner"><img src="${item.image}" width="300" class="product-img default"><div class="showcase-actions"><button class="btn-action remove-wishlist-btn" data-title="${item.title}"><ion-icon name="trash-outline"></ion-icon></button><button class="btn-action add-cart-from-wishlist-btn" data-title="${item.title}"><ion-icon name="bag-add-outline"></ion-icon></button></div></div><div class="showcase-content"><a href="#" class="showcase-category">${item.category}</a><a href="#"><h3 class="showcase-title">${item.title}</h3></a><div class="price-box"><p class="price">&#8377;${item.price.toFixed(2)}</p>${item.originalPrice ? `<del>&#8377;${item.originalPrice.toFixed(2)}</del>` : ''}</div></div>`;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.remove-wishlist-btn').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); this.removeFromWishlist(btn.dataset.title); }));
    grid.querySelectorAll('.add-cart-from-wishlist-btn').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); const item = wishlist.find(i => i.title === btn.dataset.title); if (item) { this.addToCart(item); this.removeFromWishlist(btn.dataset.title); } }));
  }
};

document.addEventListener('DOMContentLoaded', () => cartWishlistManager.init());
