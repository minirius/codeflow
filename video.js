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

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
            document.getElementById("video").onmouseleave = function() {this.controls = false}
            document.getElementById("video").onmouseenter = function() {this.controls = true}
            document.getElementById("video").poster = movie["miniature"]
            document.getElementById("video").addEventListener("ended", function() {})
            document.getElementById("video").addEventListener("timeupdate", function() {})

            /*source = document.createElement("source");
            source.src = movie["sources"][0];
            document.getElementById("videoBlur").appendChild(source);*/

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

tempsRestant = 9;
canSkip = false;

function allowSkip() {
  setTimeout(() => {
    if(tempsRestant == 0) {
      canSkip = true;
      document.getElementById("pubSkip").innerHTML = "Passer l'annonce"
      document.getElementById("pubSkip").style.cursor = "pointer"
      document.getElementById("pubSkip").style.opacity = "100%"
    } else {
      document.getElementById("pubSkip").innerHTML = `${tempsRestant} sec `;
      tempsRestant -= 1;
      allowSkip()
    }
  }, 1000);
}

async function pub() {
    source = document.createElement("source");
    source.src =`http://127.0.0.1:5500/pubs/pub${getRandomIntInclusive(1, 4)}.mp4`;
    document.getElementById("video").appendChild(source);
    document.getElementById("video").controls = false;

    document.getElementById("pubPlay").onclick = function() {
      document.getElementById("video").play()
      document.getElementById("pubPlay").style.display = "none"
      document.getElementById("pubSkip").style.display = "inline-block"
      allowSkip()
    }

    document.getElementById("pubSkip").onclick = function() {
      document.getElementById("pubSkip").style.display = "none"
      document.getElementById("pubInfo").style.display = "none"
      document.getElementById("video").pause()
      document.getElementById("video").innerHTML = ""
      document.getElementById("content").innerHTML = ""
      main()
      document.getElementById("video").load()
    }

    document.getElementById("video").addEventListener("ended", function() {
      document.getElementById("pubSkip").style.display = "none"
      document.getElementById("pubInfo").style.display = "none"
      document.getElementById("time").style.width = "0px"
      document.getElementById("video").pause()
      document.getElementById("video").innerHTML = ""
      main()
      document.getElementById("video").load()
      document.getElementById("video").play();
    })

    document.getElementById("video").addEventListener("timeupdate", (event) => {
      percentage = (document.getElementById("video").currentTime / document.getElementById("video").duration ) * 100
      document.getElementById("time").style.width = `calc(${percentage}% - 40px)`
      console.log(parseInt(document.getElementById("video").currentTime))
  });
}

window.addEventListener('DOMContentLoaded', pub());