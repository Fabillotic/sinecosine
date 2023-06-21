window.dark = false;

function darkMode() {
    window.dark = !window.dark;

    let headline = document.getElementById("headline");
    
    if(window.dark) {
        headline.style.color = "white";
        document.body.style.background = "black";
    }
    else {
        headline.style.color = "black";
        document.body.style.background = "white";
    }
}
