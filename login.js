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

        const response = await fetch(`http://127.0.0.1/login.php?name=${username.value}&pass=${password.value}`);
        responseText = await response.text();
        if(responseText == "error") {
            document.getElementById('errorBox').style.display = "inline-block";
        } else {
            reponse = JSON.parse(responseText);
            console.log(reponse)
            localStorage.setItem("isConnected", true);
            localStorage.setItem("username", reponse["name"]);
            localStorage.setItem("avatar", reponse["avatar"]);
            localStorage.setItem("userId", reponse["id"]);
            window.location.reload();
        }
    });
}

window.addEventListener('DOMCloontentLoaded', main());