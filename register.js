function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function main() {

    if(localStorage.getItem("isConnected") == "true") {
        window.location.pathname = "categories.html"
    }

    document.getElementById("loginForm").addEventListener('submit', async (event) => {
        event.preventDefault();
        username = document.getElementById("username");
        password = document.getElementById("password");
        description = document.getElementById("description");

        const response = await fetch(`http://127.0.0.1/register.php?name=${username.value}&pass=${password.value}&description=${description.value}`);
        responseText = await response.text();
        window.location.pathname = "login.html";
    });
}

window.addEventListener('DOMCloontentLoaded', main());