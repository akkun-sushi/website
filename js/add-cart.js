function fetchCartContents() {
    fetch('/get_cart_contents')
        .then((response) => response.json())
        .then((data) => {
            updateCartContents(data);
        })
        .catch((error) => console.error(error));
}

function updateCartContents(cart) {
    const cartInfo = document.getElementById('cart-info');
    cartInfo.innerHTML = '';
    const cartRoot = document.createElement('div');
    cart.forEach((item) => {
    cartRoot.className = 'cartroot';
    cartRoot.innerHTML = `
        <div class="productbackground">
            <img class="productimage" src="${item.imgSrc}" alt="${item.title}">
        </div>
        <div class="productinfo">
            <p class="productname">${item.title}</p>
            <p class="discription">${item.discription}</p>
            <p class="price">${item.price}</p>
            <button class="deletebutton">Delete</button>
        </div>
    `;
    cartInfo.appendChild(cartRoot);
    }
    )
};

document.getElementById("deleteButton").addEventListener("click", (event) => {
    event.target.parentNode.parentNode.remove();
});

document.addEventListener('DOMContentLoaded', fetchCartContents);