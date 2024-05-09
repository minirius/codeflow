const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
;

function show(index) {
    video = document.getElementById(`video${index}`);
    poster = document.getElementById(`poster${index}`);
    poster.style.display = "none";
    video.style.display = "inline-block";
    video.play();
}

function hide(index) {
    video = document.getElementById(`video${index}`);
    poster = document.getElementById(`poster${index}`);
    poster.style.display = "inline-block";
    video.style.display = "none";
    video.pause();
    video.currentTime = 0;
}

async function main() {
    if(localStorage.getItem('isConnected') != "true") window.location.pathname = "login.html";
    document.getElementById("userAvatar").src = localStorage.getItem("avatar");
    //const response = await fetch("https://raw.githubusercontent.com/minirius/codeflow/main/videos/videos.json");
    const response = await fetch("http://127.0.0.1/videos.php");
    movies = await response.json();
    movies.forEach(movie => {
        index = movie["id"];
        description = movie["description"];
        console.log(movie)
        /*if(description.length > 50) {
            description = description.substr(0, 50);
        }*/

        parent = document.getElementById(movie["categorie"])
        if(!parent) {
            parentDiv = document.createElement("div");
            parentDiv.className = "categorie"
            parentDiv.id = movie["categorie"]

            title = document.createElement("h3");
            title.innerText = capitalize(movie["categorie"]);
            title.style.paddingLeft = "30px"

            document.getElementsByClassName("main")[0].appendChild(title)
            document.getElementsByClassName("main")[0].appendChild(parentDiv);
        }


        document.getElementById(movie["categorie"]).innerHTML+= `
        <a class="videoContainer videoContainerCategorie" href="video.html?v=${index}" onmouseover="show(${index})" onmouseout="hide(${index})">
            <img id="poster${index}" src="${movie["thumbnail"]}"/>
            <video id="video`+index+`" muted preload="metadata" ondurationchange="document.getElementById('timecode`+index+`').innerHTML = Math.floor(this.duration / 60)+':'+Math.round(this.duration - Math.floor(this.duration / 60) * 60)">
                <source src="${movie["video"]}" />
            </video>
            <h5>${movie["titre"]}</h5>
            <p>${description}</p>
            <span class="progressbar"></span>
            <span class="timecode" id="timecode${index}">loading</span>
        </a>
        `;
        /*div = document.createElement("div");
        div.className = "videoContainer"

        video = document.createElement("video");
        video.preload = "auto"
        video.onmouseover = function(e) {this.play()}
        video.onmouseout = function(e) {this.pause();this.currentTime=0;}
        video.onloadedmetadata = function(e) {
            timecode.innerHTML = this.duration;
        }

        source = document.createElement("source");
        source.src = movie["sources"][0];

        h5 = document.createElement("h5")
        h5.innerHTML = movie["title"];

        p = document.createElement("p")
        p.innerHTML = description;

        timecode = document.createElement("span");
        timecode.className = "timecode"

        video.appendChild(source);
        div.appendChild(video);
        div.appendChild(h5);
        div.appendChild(p);
        div.appendChild(timecode);
        document.getElementById("tendances").appendChild(div);*/
    });
}

window.addEventListener('DOMCloontentLoaded', main());
window.onblur = function(e) {
    //following two lines will cause the browser to ask the user if they
    //want to leave. The text of this dialog is controlled by the browser.
    let videos = document.querySelectorAll("video");
    videos.forEach((video) => {
        // We can only control playback without insteraction if video is mute
        video.pause();
    });

    e.preventDefault(); //per the standard
    e.returnValue = ''; //required for Chrome
    //else: user is allowed to leave without a warning dialog
};

document.getElementById("searchButton").addEventListener("click", function(e) {
    searchInput = document.getElementById("searchInput");
    if(searchInput.value != "") {
        window.location = "http://127.0.0.1:5500/search.html?search="+searchInput.value
    }
})