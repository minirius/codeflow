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

async function main() {
    //const response = await fetch("https://raw.githubusercontent.com/minirius/codeflow/main/videos/videos.json");
    const response = await fetch("http://127.0.0.1:5500/videos/videos.json");
    movies = await response.json();
    movies = movies["categories"][0]["videos"];
    videoId = findGetParameter("v");
    console.log(videoId);
    movies.forEach(movie => {
        if(videoId == movie["id"]) {
            source = document.createElement("source");
            source.src = movie["sources"][0];
            document.getElementById("video").appendChild(source);

            source = document.createElement("source");
            source.src = movie["sources"][0];
            document.getElementById("videoBlur").appendChild(source);

            h5 = document.createElement("h3");
            h5.innerHTML = movie["title"];
            p = document.createElement("p");
            p.innerHTML = movie["description"];

            document.getElementById("content").appendChild(h5);
            document.getElementById("content").appendChild(p);
        }

    });

    playing = false;

    document.getElementById("video").addEventListener("play", function() {
        playing = true;
        document.getElementById("videoBlur").play()
    })

    document.getElementById("video").addEventListener("pause", function() {
        playing = false;
        document.getElementById("videoBlur").pause()
    })

    document.getElementById("video").addEventListener("timeupdate", (event) => {
        if(!playing) {
            document.getElementById("videoBlur").currentTime = document.getElementById("video").currentTime
        }
    });
}

window.addEventListener('DOMContentLoaded', main());