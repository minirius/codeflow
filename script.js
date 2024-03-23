function playPauseVideo() {
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
}

async function main() {
    const response = await fetch("https://raw.githubusercontent.com/minirius/codeflow/main/videos/videos.json");
    movies = await response.json();
    movies = movies["categories"][0]["videos"];
    movies.forEach(movie => {
        console.log("Titre: "+movie["title"]);
        console.log("Desc: "+movie["description"]);
        console.log("Link: "+movie["sources"][0]);
        description = movie["description"];
        /*if(description.length > 50) {
            description = description.substr(0, 50);
        }*/
        document.getElementById("tendances").innerHTML+= `
        <div class="videoContainer">
            <video preload="auto" onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0;">
                <source src="`+movie["sources"][0]+`#t=0.1" />
            </video>
            <h5>`+movie["title"]+`</h5>
            <p>`+description+`</p>
            <span class="timecode">3:01</span>
        </div>
        `;
    });

    // And you would kick this off where appropriate with:
    playPauseVideo();
}

window.addEventListener('DOMContentLoaded', main());