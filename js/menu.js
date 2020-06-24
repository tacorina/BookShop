let list = {};

async function showMain() {
	let library = await fetch('https://bookshop-3b7a8.firebaseio.com/.json');
	list = await library.json();

	document.querySelector('.sk-cube-grid').style.display = 'none';
	document.querySelector('#mainContent').classList.remove('hidden');

	draw();
}

function draw() {
	let str = '';
	let value = document.querySelector('#search').value;

	for (let i in list.books) {
		if (
			list.books[i].name.indexOf(value) > -1 ||
			list.books[i].author.indexOf(value) > -1
		) {
			str += `
				<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
					<div class="box">
						<a href="details.html?book=${i}">
							<img class="clearfix" src="${list.books[i].image}" alt="image" id="image"/>
						</a>
						<br />
						<div class="book">
							<span id="name"><b>${list.books[i].name}</b></span>
							<br />
							<span id="author">${list.books[i].author}</span>
							<br />
							
						</div>
						<div>
						<span id="price">${list.books[i].price} Lei</span>
						<a href="details.html?book=${i}"><button>Detalii</button></a>
						</div>
					</div>
				</div>
			`;
		}
	}
	document.querySelector('.main').innerHTML = str;
}
