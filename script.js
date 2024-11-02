let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currFolder = folder;
    let i = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let res = await i.text();
    let div = document.createElement("div");
    div.innerHTML = res;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songUL = document.querySelector(".songList").querySelector("ul");
    songUL.innerHTML=``;
    for await (const song of songs) {
        let li = document.createElement("li");
        li.innerHTML = `<div class="flex"><img class="invert" width="34" src="music.svg" alt="">
                        <div class="info">
                            <div>${song}</div>
                        </div>
                        </div>
                        <div class="playnow">
                            <img class="invert" src="play.svg" alt="">
                        </div>`;
        songUL.append(li);
    }

    // adding event liseners to each song;

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").querySelector("div").innerHTML);
        })
    })

}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "Svg/pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = track;

}


async function main() {

    await getsongs("songs/Chill");
    playMusic(songs[0], true);
    // console.log(songs);


    //adding event lisener to buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "Svg/pause.svg";
        }
        else {
            currentSong.pause()
            play.src = "Svg/play.svg";
        }

    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (((currentSong.currentTime) / (currentSong.duration)) * 100) + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        let a = document.querySelector(".lib");
        a.style.left = "0%";
        a.style.width = "60vw";
        a.style.backgroundColor = "#2a352a";
    })

    document.querySelector(".hamclose").addEventListener("click", () => {
        let b = document.querySelector(".lib");
        b.style.left = "-100%";
    })
    //previous and next
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(songs,index);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(songs,index);
        playMusic(songs[index + 1]);
    })

    document.querySelector(".volctrl").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        // e.target.value give a value out of 100 based on the range choosed
        //audio.volume take value between 0 to 1 therefore we divide by 100
    })

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async items => {
            // console.log(items.currentTarget.dataset.folder);            // if use items.target then it will give the dataset of only those which are being clicked but if we use currentTarget then it will give the dataset of ele on which event is Listen.
            await getsongs(`songs/${items.currentTarget.dataset.folder}`);
        })
    })
}


main()