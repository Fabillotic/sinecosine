window.dark = false;

function toggleDarkMode() {
	window.dark = !window.dark;
	updateDarkMode();
}

function updateDarkMode() {
	let headline = document.getElementById("headline");
	let button = document.getElementById("dark");

	if(window.dark) {
		headline.style.color = "white";
		document.body.style.background = "black";
		button.innerHTML = "Light mode";
	}
	else {
		headline.style.color = "black";
		document.body.style.background = "white";
		button.innerHTML = "Dark mode";
	}
}
