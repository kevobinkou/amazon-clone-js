import { products } from '../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { addToCart, calculateCartQuantity } from '../data/cart.js';

let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}" alt="${product.name}">
      </div>

      <div class="product-name">${product.name}</div>

      <div class="product-rating">
        ${product.rating.stars} ★ (${product.rating.count})
      </div>

      <div class="product-price">KES ${formatCurrency(product.priceCents)}</div>

      <button class="add-to-cart-button js-add-to-cart"
        data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;
function updateCartQuantity() {
  document.querySelector('.js-cart-quantity').textContent = calculateCartQuantity();
}

updateCartQuantity();   // show the saved count on page load

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    addToCart(productId);
    updateCartQuantity();
  });
});