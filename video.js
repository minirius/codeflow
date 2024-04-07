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

class VideoWithBackground {
    video;
    canvas;
    step;
    ctx;
  
    constructor(videoId, canvasId) {
      this.video = document.getElementById(videoId);
      this.canvas = document.getElementById(canvasId);
  
      window.addEventListener("load", this.init, false);
      window.addEventListener("unload", this.cleanup, false);

      console.log(document.getElementById(videoId).offsetHeight);
      document.getElementById(canvasId).style.height = document.getElementById(videoId).offsetHeight+50
    }
  
    draw = () => {
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    };
  
    drawLoop = () => {
      this.draw();
      this.step = window.requestAnimationFrame(this.drawLoop);
    };
  
    drawPause = () => {
      window.cancelAnimationFrame(this.step);
      this.step = undefined;
    };
  
    init = () => {
      this.ctx = this.canvas.getContext("2d");
      this.ctx.filter = "blur(1px)";
  
      this.video.addEventListener("loadeddata", this.draw, false);
      this.video.addEventListener("seeked", this.draw, false);
      this.video.addEventListener("play", this.drawLoop, false);
      this.video.addEventListener("pause", this.drawPause, false);
      this.video.addEventListener("ended", this.drawPause, false);
    };
  
    cleanup = () => {
      this.video.removeEventListener("loadeddata", this.draw);
      this.video.removeEventListener("seeked", this.draw);
      this.video.removeEventListener("play", this.drawLoop);
      this.video.removeEventListener("pause", this.drawPause);
      this.video.removeEventListener("ended", this.drawPause);
    };
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
    
    const el = new VideoWithBackground('video', 'videoBlur');

    /*playing = false;

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
    });*/
}

window.addEventListener('DOMContentLoaded', main());