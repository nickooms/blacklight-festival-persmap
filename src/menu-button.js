function initMenuButton() {
	var menuButton = document.querySelector('.js-menu-button'),
		menu = document.querySelector('div#controls');
	//menu.style.display = 'none';
	menuButton.addEventListener('click', () => {
		menuButton.classList.toggle('menu-button--open')
		var menu = document.querySelector('div#controls');
		//menu.style.display = menu.style.display === 'none' ? '' : 'none';
		menu.classList.toggle('open')
	}, false);
}