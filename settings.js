function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  
async function main() {
    if(localStorage.getItem('isConnected') != "true") window.location.pathname = "login.html";
    document.getElementById("userAvatar").src = localStorage.getItem("avatar");
    
    document.getElementById("pubCheckBox").addEventListener('change', (event) => {
        localStorage.setItem("pub", event.currentTarget.checked);
    });

    document.getElementById("viewCheckBox").addEventListener('change', (event) => {
        localStorage.setItem("view", event.currentTarget.checked);
    });
    document.getElementById("themeCheckBox").addEventListener('change', (event) => {
        localStorage.setItem("theme", event.currentTarget.checked);
    });

    pubState = localStorage.getItem("pub");
    viewState = localStorage.getItem("view");
    themeState = localStorage.getItem("theme");

    if(pubState == null) {
        localStorage.setItem("pub", true);
        pubState = true;
    }
    if(viewState == null) {
        localStorage.setItem("view", true);
        viewState = true;
    }
    if(themeState == null) {
        localStorage.setItem("theme", false);
        themeState = false;
    }

    document.getElementById("pubCheckBox").checked = (pubState == "true");
    document.getElementById("viewCheckBox").checked = (viewState == "true");
    document.getElementById("themeCheckBox").checked = (themeState == "true");
}

window.addEventListener('DOMCloontentLoaded', main());