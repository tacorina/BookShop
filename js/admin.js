let admin = {};
let id = window.location.search.substr(6);

async function administrator() {
	let response = await fetch('https://bookshop-3b7a8.firebaseio.com/.json');
	admin = await response.json();

	drawAdmin();
}

function drawAdmin() {
	let str = '';
	let books = admin.books;
	for (let i in books) {
		if (books[i] === null) {
			continue;
		}
		str += `
			<tr >
				<td class="table-image"><img src="${books[i].image}" id="image" />
				</td>
				<td id="name">${books[i].name}</td>
				<td id="author">${books[i].author}</td>
				<td id="price">${books[i].price}</td>
				<td id="stock">${books[i].stock}</td>
				<td id="about">${books[i].about}</td>
				<td><button data-id="${i}" onclick="editBook(event)">Edit</button></td>
				<td><button data-id="${i}" onclick="deleteBook(event)">Delete</button>
				</td>
			</tr>
		`;
	}
	document.querySelector('table tbody').innerHTML = str;
}

function notNow() {
	document.querySelector('.new-book-box').classList.add('hidden');
	document.querySelector('#save-btn').classList.add('hidden');
}

function addNewBook(event) {
	document.querySelector('.new-book-box').classList.remove('hidden');
	document.querySelector('#save-btn').classList.remove('hidden');

	document.querySelector('#image').value = '';
	document.querySelector('#name').value = '';
	document.querySelector('#author').value = '';
	document.querySelector('#price').value = '';
	document.querySelector('#stock').value = '';
	document.querySelector('#description').value = '';
}

async function saveThisBook(id) {
	await fetch(`https://bookshop-3b7a8.firebaseio.com/books/${id}.json`, {
		method: 'POST',
		body: JSON.stringify({
			image: document.getElementById('image').value,
			name: document.getElementById('name').value,
			author: document.getElementById('author').value,
			price: document.getElementById('price').value,
			stock: document.getElementById('stock').value,
			description: document.getElementById('description').value,
		}),
	});
	window.location.assign('admin.html');
}

function saveMe() {
	const myPromise = saveThisBook();
	myPromise.then(function () {
		document.querySelector('.new-book-box').classList.add('hidden');
		document.querySelector('#save-btn').classList.add('hidden');
		administrator();
	});
}

let listOfBooks = [];

async function editBook() {
	document.querySelector('.new-book-box').classList.remove('hidden');
	document.querySelector('#save-btn').classList.remove('hidden');

	let id = event.target.dataset.id;
	let response = await fetch(
		'https://bookshop-3b7a8.firebaseio.com/books/.json'
	);

	listOfBooks = await response.json();

	document.querySelector('#image').value = listOfBooks[id].image;
	document.querySelector('#name').value = listOfBooks[id].name;
	document.querySelector('#author').value = listOfBooks[id].author;
	document.querySelector('#price').value = listOfBooks[id].price;
	document.querySelector('#stock').value = listOfBooks[id].stock;
	document.querySelector('#description').value = listOfBooks[id].about;
}

async function editThisBook() {
	event.preventDefault();
	// let id = event.target.dataset.id;

	let modifiedBook = {
		image: document.getElementById('image').value,
		name: document.getElementById('name').value,
		author: document.getElementById('author').value,
		price: document.getElementById('price').value,
		stock: document.getElementById('stock').value,
		about: document.getElementById('description').value,
	};
	await fetch(`https://bookshop-3b7a8.firebaseio.com/books/${id}.json`, {
		method: 'PUT',
		body: JSON.stringify(modifiedBook),
	});

	window.location.assign('admin.html');
	document.querySelector('.new-book-box').classList.add('hidden');
	document.querySelector('#save-btn').classList.add('hidden');
	administrator();
}

async function deleteBook(id) {
	await fetch(`https://bookshop-3b7a8.firebaseio.com/books/${id}.json`, {
		method: 'DELETE',
	});
	await administrator();
}
