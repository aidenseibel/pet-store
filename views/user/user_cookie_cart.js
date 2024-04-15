// user_cart_cookie.js

// Function to get a cookie by name
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return '';
}

// Function to set a cookie
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
}

// Function to add an item to the cart
function addToCart(itemId) {
    let cart = getCartFromCookie();
    cart.push(itemId);
    setCartToCookie(cart);
    // Optional: Reload the page to reflect the updated cart
    window.location.reload();
}

// Function to retrieve the cart from the cookie
function getCartFromCookie() {
    const cartCookie = getCookie('cart');
    return cartCookie ? JSON.parse(cartCookie) : [];
}

// Function to save the cart to the cookie
function setCartToCookie(cart) {
    setCookie('cart', JSON.stringify(cart), 7); // Expires in 7 days
}
