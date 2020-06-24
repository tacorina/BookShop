function showCart() {
	let cart = JSON.parse(localStorage.getItem('booksList'));
	let cartStr = '';

	document.querySelector('.sk-cube-grid').style.display = 'none';
	document.querySelector('#cartContent').classList.remove('hidden');

	for (let i in cart) {
		cartStr += `
		
			<div id="content${i}">
			<div class="image"> 
				<a href="details.html?book=${cart[i].idBook}">
					<img src="${cart[i].image}" alt=""/>
				</a>
			</div>
			<div class="description">
				<a href="details.html?book=${cart[i].idBook}">
					<span>${cart[i].name}</span><br>
				</a>
				<span>${cart[i].author}</span><br>
				<span>${cart[i].price} Lei</span>
			</div>
			<div class="quantity">
				<button class="plus-btn" type="button" name="button" onclick="goUp(event,${i})">
					<img src="image/plus.svg" class="upDownbtn">
				</button>

				<input type="number" id="quantity" value="${
					cart[i].quantity
				}" min="1" max="100" />

				<button class="minus-btn" type="button" name="button" onclick="goDown(event,${i})">
					<img src="image/minus.svg" class="upDownbtn">
				</button>
			</div>
			
			<div class="subtotal" id="total${i}">Subtotal: ${
			cart[i].price * cart[i].quantity
		} Lei</div>
			<div class="delete"><button class="delBtn" onclick="deleteBook(${i})">Sterge</button></div>
		</div>
		`;
	}

	document.querySelector('#cartContent').innerHTML = cartStr;
	total();
}

function total() {
	let booksList = JSON.parse(localStorage.getItem('booksList'));
	let totalPrice = 0;
	let str = '';
	for (let i in booksList) {
		let subtotal = parseInt(booksList[i].subtotal);
		totalPrice = totalPrice + subtotal;
		console.log(subtotal);
	}
	str = `
	<div>Total: <span id="totalTotal">${totalPrice}</span></div>
				<div class="finalTouch">
					<button class="final">Spre finalizare</button>
				</div>
	`;
	console.log(totalPrice);
	document.querySelector('#sideContent').innerHTML = str;
}
function deleteBook(idx) {
	let booksList = JSON.parse(localStorage.getItem('booksList'));
	let name = booksList[idx].name;
	if (confirm('Cartea "' + name + '" va fi stearsa din cos.')) {
		window.localStorage.removeItem(`${idx}`);
		booksList.splice(idx, 1);
		localStorage.setItem('booksList', JSON.stringify(booksList));
		total();
		showCart();
	}
}

function goUp(event, idx) {
	let index = idx;
	let booksList = JSON.parse(localStorage.getItem('booksList'));
	let quantityBought = booksList[index].quantity + 1;

	if (quantityBought > booksList[index].stock) {
		alert('Se pare ca ati depasit cantitatea existenta in stoc!');
	} else {
		booksList[index].quantity = quantityBought;
		booksList[index].subtotal = quantityBought * booksList[index].price;

		localStorage.setItem('booksList', JSON.stringify(booksList));
		total();
		showCart();
	}
}

function goDown(event, idx) {
	let index = idx;
	let booksList = JSON.parse(localStorage.getItem('booksList'));
	let quantityBought = booksList[index].quantity - 1;

	if (quantityBought <= 0) {
		alert('Cantitate invalida.');
	} else {
		booksList[index].quantity = quantityBought;
		booksList[index].subtotal = quantityBought * booksList[index].price;

		localStorage.setItem('booksList', JSON.stringify(booksList));
		total();
		showCart();
	}
}

async function buy() {
	let booksList = JSON.parse(localStorage.getItem('booksList'));
	await Promise.all(
		booksList.map((book) => {
			let remainingStock = book.stock - book.quantity;
			let index = book.idBook;
			return fetch(
				`https://bookshop-3b7a8.firebaseio.com/${index}/stock.json`,
				{
					method: 'PUT',
					body: remainingStock,
				}
			);
		})
	);
}
