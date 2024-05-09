async function main() {
    if(localStorage.getItem('isConnected') != "true") window.location.pathname = "login.html";
    document.getElementById("userAvatar").src = localStorage.getItem("avatar");

    auth_id = localStorage.getItem("userId");

    const response = await fetch("http://127.0.0.1/likes.php?getUser&auth_id="+auth_id);
    movies = await response.json();

    movies.forEach(movie => {
        index = movie["id"];
        description = movie["description"];

        document.getElementById("videoList").innerHTML+= `
        <div class="videoElement">
            <img src="${movie["thumbnail"]}" onclick="window.location.href='video.html?v=${index}'"></img>
            <div class="videoInfo">
                <h4>${movie["titre"]}</h4>
                <p>${description}</p>
            </div>
        </div>
        `;
    });
}

window.addEventListener('DOMCloontentLoaded', main());