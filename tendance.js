/*function playPauseVideo() {
    let videos = document.querySelectorAll("video");
    videos.forEach((video) => {
        // We can only control playback without insteraction if video is mute
        video.muted = true;
        // Play is a promise so we need to check we have it
        let playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then((_) => {
                let observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (
                                entry.intersectionRatio !== 1 &&
                                !video.paused
                            ) {
                                video.pause();
                            } else if (video.paused) {
                                video.play();
                            }
                        });
                    },
                    { threshold: 0.2 }
                );
                observer.observe(video);
            });
        }
    });
}*/

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
    //const response = await fetch("https://raw.githubusercontent.com/minirius/codeflow/main/videos/videos.json");
    const response = await fetch("http://127.0.0.1/videos.php");
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