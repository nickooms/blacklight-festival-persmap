function initMenuButton() {
	var menuButton = document.querySelector('.js-menu-button'),
		menu = document.querySelector('div#controls'),
		menuOverlay = document.querySelector('div#menu-overlay');
	//menu.style.display = 'none';
	menuButton.addEventListener('click', () => {
		menuButton.classList.toggle('menu-button--open');
		var menu = document.querySelector('div#controls'),
			menuOverlay = document.querySelector('div#menu-overlay');
		//menu.style.display = menu.style.display === 'none' ? '' : 'none';
		menu.classList.toggle('open');
		menuOverlay.classList.toggle('open');
	}, false);
}