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

async function showPopup(text) {
  popup = document.getElementsByClassName("popup")[0];
  popup.innerHTML = `<p>${text}</p>`;
  popup.style.top = "30px";
  await new Promise(res => setTimeout(res, 3000));
  popup.style.top = "-50vh";
}

async function share() {
  if(navigator.canShare) {
    navigator.share({title:"Partager", text:`Regardez cette vidéo ! ${window.location.href}`}).catch((e) => {showPopup(e);})
  } else {
    try {
      await navigator.clipboard.writeText(window.location.href);
      console.log('Content copied to clipboard');
      showPopup("Lien copié");
      /* Resolved - text copied to clipboard successfully */
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert("Aucun moyen de partager n'est supporté");
      /* Rejected - text failed to copy to the clipboard */
    }
  }
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
  if(localStorage.getItem('isConnected') != "true") window.location.pathname = "login.html";
  document.getElementById("userAvatar").src = localStorage.getItem("avatar");

    videoId = findGetParameter("v");
    const response = await fetch("http://127.0.0.1/videos.php?id="+videoId);
    movie = await response.json();
    if(movie.length==0) {
      window.location.href = "http://127.0.0.1:5500/new.html"
    }

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
    p.style.textAlign = "justify";

    document.getElementById("content").appendChild(h5);
    document.getElementById("content").appendChild(p);

    const response2 = await fetch("http://127.0.0.1/comments.php?get&video_id="+videoId);
    comments = await response2.json();

    comments.forEach(comment => {
      document.getElementById("commentList").innerHTML += `
      <div class="commentDiv">
          <div>
              <img src="${comment["user_avatar"]}"/>
              <h3>${comment["user_name"]}</h3>
          </div>
          <p>${comment["text"]}</p>
      </div>
      `;
    });

    source = document.createElement("source");
    source.src =`http://127.0.0.1:5500/pubs/pub${getRandomIntInclusive(1, 4)}.mp4`;
    document.getElementById("video").appendChild(source);
    document.getElementById("video").controls = false;

    auth_id = localStorage.getItem("userId");
    video_id = findGetParameter("v");
  
    const response3 = await fetch(`http://127.0.0.1/likes.php?get&auth_id=${auth_id}&video_id=${video_id}`);
    reponse = await response3.text();
    const response4 = await fetch(`http://127.0.0.1/likes.php?getVideo&video_id=${video_id}`);
    reponse2 = await response4.text();

    document.getElementById("likeText").innerText = reponse2;
  
    if(reponse == "1") {
      document.getElementById("likeIcon").style.color="red";
      document.getElementById("likeIcon").name="heart";
      document.getElementById("likeText").style.color="red";
    }
    if(reponse == "0") {
      document.getElementById("likeIcon").style.color="black";
      document.getElementById("likeIcon").name="heart-outline";
      document.getElementById("likeText").style.color="black";
    }


    if(localStorage.getItem("pub") == "false") {
      document.getElementById("pubSkip").style.display = "none"
      document.getElementById("pubInfo").style.display = "none"
      document.getElementById("pubPlay").style.display = "none"
      document.getElementById("time").style.display = "none"
      document.getElementById("video").pause()
      document.getElementById("video").innerHTML = ""
      main()
      document.getElementById("video").load()
      document.getElementById("video").play();
      return '';
    }

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

document.getElementById("shareButton").addEventListener("click", function() {share()});

document.getElementById("likeButton").addEventListener("click", async () => {
  auth_id = localStorage.getItem("userId");
  video_id = findGetParameter("v");

  const response = await fetch(`http://127.0.0.1/likes.php?get&auth_id=${auth_id}&video_id=${video_id}`);
  reponse = await response.text();
  if(reponse == "1") {
    const response = await fetch(`http://127.0.0.1/likes.php?remove&auth_id=${auth_id}&video_id=${video_id}`);
    reponse = await response.text();
    document.getElementById("likeIcon").style.color="black";
    document.getElementById("likeIcon").name="heart-outline";
    document.getElementById("likeText").style.color="black";

    likeNbr = parseInt(document.getElementById("likeText").innerText) - 1;
    document.getElementById("likeText").innerText = likeNbr
  }
  if(reponse == "0") {
    const response = await fetch(`http://127.0.0.1/likes.php?add&auth_id=${auth_id}&video_id=${video_id}`);
    reponse = await response.text();
    document.getElementById("likeIcon").style.color="red";
    document.getElementById("likeIcon").name="heart";
    document.getElementById("likeText").style.color="red";
    
    likeNbr = parseInt(document.getElementById("likeText").innerText) + 1;
    document.getElementById("likeText").innerText = likeNbr
  }
});

document.getElementById("commentForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  console.log("sumbitted")
  commentInput = document.getElementById("commentaireInput")
  if(commentInput.value != "") {
    const response2 = await fetch(`http://127.0.0.1/comments.php?add&video_id=${videoId}&auth_id=${localStorage.getItem("userId")}&text=${commentInput.value}`);
    location.reload();
  }
})