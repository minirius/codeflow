function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    if(localStorage.getItem('isConnected') != "true") window.location.pathname = "login.html";
    document.getElementById("userAvatar").src = localStorage.getItem("avatar");

    userId = localStorage.getItem("userId");

    const response = await fetch(`http://127.0.0.1/users.php?id=${userId}`);
    profileInfo = await response.json();

    console.log(profileInfo);

    document.getElementById("profileAvatar").src = profileInfo["avatar"];
    document.getElementById("username").innerText = profileInfo["name"];
    document.getElementById("description").innerText = profileInfo["description"];

}

window.addEventListener('DOMCloontentLoaded', main());