async function main() {
    const response = await fetch("https://gist.githubusercontent.com/deepakpk009/99fd994da714996b296f11c3c371d5ee/raw/28c4094ae48892efb71d5122c1fd72904088439b/media.json");
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
}

window.addEventListener('DOMContentLoaded', main());