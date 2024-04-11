function findGetParameter(parameterName) {
    var result = null,
    tmp = [];
    var items = location.search.substring(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}


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
    searchQuery = findGetParameter("search");
    if(searchQuery == "" || searchQuery == null) {
        window.location.pathname = "tendance.html"
    }
    //const response = await fetch("https://raw.githubusercontent.com/minirius/codeflow/main/videos/videos.json");
    const response = await fetch("http://127.0.0.1/videos.php?search="+searchQuery);
    movies = await response.json();
    movies.forEach(movie => {
        index = movie["id"];
        description = movie["description"];
        /*if(description.length > 50) {
            description = description.substr(0, 50);
        }*/
        document.getElementById("tendances").innerHTML+= `
        <a class="videoContainer" href="video.html?v=${index}" onmouseover="show(${index})" onmouseout="hide(${index})">
            <img id="poster${index}" src="${movie["thumbnail"]}"/>
            <video id="video`+index+`" muted preload="metadata" onwaiting="console.log('Wait...')" onloadstart="console.log('load start...')" ondurationchange="document.getElementById('timecode`+index+`').innerHTML = Math.floor(this.duration / 60)+':'+Math.round(this.duration - Math.floor(this.duration / 60) * 60)">
                <source src="${movie["video"]}" />
            </video>
            <h5>${movie["titre"]}</h5>
            <p>${description}</p>
            <span class="progressbar"></span>
            <span class="timecode" id="timecode${index}">loading</span>
        </a>
        `;
    });

    document.getElementById("title").innerHTML += searchQuery;
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