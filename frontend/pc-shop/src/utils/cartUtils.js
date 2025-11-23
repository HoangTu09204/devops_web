// src/utils/cartUtils.js

export const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?._id || 'guest';
};

export const getCart = () => {
  const userId = getUserId();
  return JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
};

export const saveCart = (cart) => {
  const userId = getUserId();
  localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
};

export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find(item => item._id === product._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
};
