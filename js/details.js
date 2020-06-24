let book = {};

let id = window.location.search.substr(6);

async function details() {
	let library = await fetch(
		`https://bookshop-3b7a8.firebaseio.com/books/.json`
	);
	book = await library.json();

	document.querySelector('.sk-cube-grid').style.display = 'none';
	document.querySelector('#mainContent').classList.remove('hidden');

	draw();
}

function draw() {
	let bookDetails = '';

	bookDetails += `
		<img src="${book[id].image}" id="image" />
							<div class="bookDetails">
								<b><span id="name">${book[id].name}</span></b> <br />
								<span id="author">${book[id].author}</span>
								<p><b>Pret:</b> <span id="price">${book[id].price}</span> Lei</p>
								<p><b>Produse in stoc:</b> <span id="stock">${book[id].stock}</span> buc</p>
								<label
									>Cantitate: <input type="number" id="quantity" value="1"
								/></label>
								<button class="goCart" onclick="buyIt();">Adauga in cos</button>
								<p id="about">${book[id].about}</p>
	`;
	document.querySelector('.main').innerHTML = bookDetails;
}
function buyIt() {
	let booksList;
	let quantity = Number(document.querySelector('#quantity').value);
	let image = book[id].image;
	let name = book[id].name;
	let author = book[id].author;
	let price = book[id].price;
	let stock = book[id].stock;
	let subtotal = quantity * price;

	let cartStr = localStorage.getItem('booksList');

	if (localStorage.getItem('booksList') === null) {
		booksList = [];
	} else {
		booksList = JSON.parse(cartStr);
	}

	let checkStock = false;
	for (let i in booksList) {
		if (booksList[i].idBook === id) {
			// de aflat cum verific stocul
			let newQuantity = booksList[i].quantity + quantity;
			if (newQuantity >= stock) {
				alert('Se pare ca ati depasit cantitatea existenta in stoc!');
				checkStock = true;
			} else {
				booksList[i].quantity = newQuantity;
				localStorage.setItem('booksList', JSON.stringify(booksList));
				alert('' + name + 'se afla acum in cos');
				checkStock = true;
			}
		}
	}

	if (checkStock === false) {
		if (quantity > stock) {
			alert('Se pare ca ati depasit cantitatea existenta in stoc!');
		} else {
			let bookBought = {
				image: image,
				name: name,
				author: author,
				quantity: quantity,
				idBook: id,
				price: price,
				subtotal: subtotal,
				stock: stock,
			};
			booksList.push(bookBought);

			localStorage.setItem('booksList', JSON.stringify(booksList));
			alert('' + name + ', se afla acum in cos');
		}
	}
}
