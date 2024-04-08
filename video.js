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


async function main() {
    //const response = await fetch("https://raw.githubusercontent.com/minirius/codeflow/main/videos/videos.json");
    videoId = findGetParameter("v");
    const response = await fetch("http://127.0.0.1/videos.php?id="+videoId);
    movie = await response.json();
    source = document.createElement("source");
    source.src = movie["video"];
    document.getElementById("video").appendChild(source);
    document.getElementById("video").onmouseleave = function() {this.controls = false}
    document.getElementById("video").onmouseenter = function() {this.controls = true}
    document.getElementById("video").poster = movie["thumbnail"];
    document.getElementById("video").addEventListener("ended", function() {})

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

tempsRestant = 4;
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

    videoId = findGetParameter("v");
    const response = await fetch("http://127.0.0.1/videos.php?id="+videoId);
    movie = await response.json();

    document.getElementById("likeText").innerText = movie["likes"];
    document.getElementById("shareText").innerText = movie["shares"];

    document.getElementById("userImg").src = movie["avatar"];
    document.getElementById("userName").innerText = movie["name"];
    /*source = document.createElement("source");
    source.src = movie["sources"][0];
    document.getElementById("videoBlur").appendChild(source);*/

    h5 = document.createElement("h3");
    h5.innerHTML = movie["titre"];
    p = document.createElement("p");
    p.innerHTML = movie["description"];

    document.getElementById("content").appendChild(h5);
    document.getElementById("content").appendChild(p);

    const reponse2 = await fetch("http://127.0.0.1/comments.php?get&video_id="+videoId);
    comments = await response2.json();

    comments.forEach(comment => {
      document.getElementById("commentList").innerHTML += `
      <div class="commentDiv">
          <div>
              <img src="https://api.dicebear.com/8.x/thumbs/png?seed=Marius"/>
              <h3>Test</h3>
          </div>
          <p>Simple commentaire pour tester le layout</p>
      </div>
      `;
    });

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
      if(canSkip) {
        document.getElementById("pubSkip").style.display = "none"
        document.getElementById("pubInfo").style.display = "none"
        document.getElementById("time").style.display = "none"
        document.getElementById("video").pause()
        document.getElementById("video").innerHTML = ""
        main()
        document.getElementById("video").load()
      }
    }

    document.getElementById("video").addEventListener("ended", function() {
      document.getElementById("pubSkip").style.display = "none"
      document.getElementById("pubInfo").style.display = "none"
      document.getElementById("time").style.display = "none"
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