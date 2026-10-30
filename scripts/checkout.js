import { cart, removeFromCart, updateQuantity, calculateCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from '../utils/money.js';

function renderCheckout() {
  const itemsContainer = document.querySelector('.js-order-items');
  const summaryContainer = document.querySelector('.js-order-summary');

  document.querySelector('.js-item-count').textContent = calculateCartQuantity();

  // Empty cart
  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <p>Your cart is empty.</p>
      <a href="index.html">View products</a>
    `;
    summaryContainer.innerHTML = '';
    return;
  }

  let itemsHTML = '';
  let totalCents = 0;

  cart.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) return;   // skip if the product no longer exists

    totalCents += product.priceCents * cartItem.quantity;

    itemsHTML += `
      <div class="cart-item">
        <img class="cart-item-image" src="${product.image}" alt="${product.name}">

        <div class="cart-item-details">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">KES ${formatCurrency(product.priceCents)}</div>

          <div class="cart-item-controls">
            Quantity:
            <input class="quantity-input js-quantity-input"
              type="number" min="1" value="${cartItem.quantity}"
              data-product-id="${product.id}">
            <button class="delete-button js-delete"
              data-product-id="${product.id}">Delete</button>
          </div>
        </div>
      </div>
    `;
  });

  itemsContainer.innerHTML = itemsHTML;

  summaryContainer.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-row">
      <span>Items (${calculateCartQuantity()}):</span>
      <span>KES ${formatCurrency(totalCents)}</span>
    </div>
    <div class="summary-row total">
      <span>Order total:</span>
      <span>KES ${formatCurrency(totalCents)}</span>
    </div>
    <button class="place-order-button">Place your order</button>
  `;

  // Delete buttons
  document.querySelectorAll('.js-delete').forEach((button) => {
    button.addEventListener('click', () => {
      removeFromCart(button.dataset.productId);
      renderCheckout();
    });
  });

  // Quantity changes
  document.querySelectorAll('.js-quantity-input').forEach((input) => {
    input.addEventListener('change', () => {
      const newQuantity = Number(input.value);
      if (newQuantity < 1 || !Number.isInteger(newQuantity)) {
        renderCheckout();   // reject invalid input and reset the display
        return;
      }
      updateQuantity(input.dataset.productId, newQuantity);
      renderCheckout();
    });
  });
}

renderCheckout();