window.dark = false;

function darkMode() {
    dark = !dark;

    let headline = document.getElementById("headline");
    let copyright = document.getElementById("copyright");
    
    if(dark) {
        headline.style.color = "white";
        copyright.style.color = "white";
        document.body.style.background = "black";
    }
    else {
        headline.style.color = "black";
        copyright.style.color = "black";
        document.body.style.background = "white";
    }
}
