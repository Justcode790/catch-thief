
const muteBtn = document.getElementById("muteBtn");

let isMuted = false;
muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    bgM.muted = isMuted;
    
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
});

function startsMusic(){
    console.log("asdasadas");
    const bgM = document.getElementById("bgMusic");
    bgM.play();
}


function startTheGame(){
    const checkbox = document.getElementById("desc");
        if (checkbox.checked) {
            window.location.href = "./main.html";
        } else {
            alert("Please confirm that you read the game description before starting.");
        }
}

let level = 0;


function updateLevelDisplay(){
    document.querySelector("#levelbtn span").innerText=level;
}

const levelwiseTime = [3000,2500,2000,1500,1000,500,250,150,75,32,16];

const places = [
    "Delhi", "Mumbai", "Kolkata", "Chennai", "Jaipur",
    "Goa", "Lucknow", "Agra", "Shimla", "Pune"
];

let currentPlace = "";
let lastPlace = "";
let lastX = 0;
let lastY = 0;
let moveTimer;
let timerInterval;
let thiefDelay = 5000;

function getRandomPosition(containerWidth, containerHeight, elementWidth, elementHeight) {
    const maxX = containerWidth - elementWidth;
    const maxY = containerHeight - elementHeight;
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    return { x, y };
}


function playSound(id) {
    const sound = document.getElementById(id);
    const cloned = sound.cloneNode();  
    cloned.play();
}



function moveThief(level) {
    startsMusic();
    const thief = document.querySelector(".thief");
    const badge = thief.querySelector(".badge");
    const box = document.querySelector(".game_areana");

    const boxRect = box.getBoundingClientRect();
    const thiefRect = thief.getBoundingClientRect();

    lastPlace = currentPlace;
    lastX = parseInt(thief.style.left) || 0;
    lastY = parseInt(thief.style.top) || 0;

    const { x, y } = getRandomPosition(
        boxRect.width,
        boxRect.height,
        thiefRect.width,
        thiefRect.height
    );

    currentPlace = places[Math.floor(Math.random() * places.length)];
    badge.textContent = `📍 ${currentPlace}`;

    thief.style.position = "absolute";
    thief.style.left = `${x}px`;
    thief.style.top = `${y}px`;

    thiefDelay = Math.floor(Math.random() * (levelwiseTime[level] || 3000)) + 1500;

    startProgressBar(thiefDelay);

    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => {
        moveThief();
    }, thiefDelay);
}

window.onload = function () {
    input.focus();
    updateLevelDisplay();
    moveThief(level);
};

const btn = document.querySelector(".result_bar button");
const input = document.querySelector(".result_bar input");

function handleSubmit() {
    
    const guess = input.value.trim().toLowerCase();
    const police = document.querySelector(".police");
    const policeBadge = police.querySelector(".badge");

    const catchSound = document.getElementById("catchSound");

    if (!guess) {
        showCustomAlert("Please enter place name!");
        return;
    }

    policeBadge.textContent = guess || "Police";

    if (guess === currentPlace.toLowerCase()) {
        clearTimeout(moveTimer);
        clearInterval(timerInterval);

        const thief = document.querySelector(".thief");
        const thiefX = parseInt(thief.style.left);
        const thiefY = parseInt(thief.style.top);

        police.style.position = "absolute";
        police.style.left = `${thiefX}px`;
        police.style.top = `${thiefY}px`;

        const bgMusic = document.getElementById("bgMusic");
        bgMusic.pause();
        bgMusic.currentTime = 0;

        level++;
        updateLevelDisplay();

        playSound("catchSound");
        showPopup("🎉 You caught the thief!");
        
    } 
     else {
        level = 0;
        updateLevelDisplay();
        showCustomAlert("❌ Wrong place! Police didn’t move.");
    }

    input.value = "";
    input.focus();
}


function restartGame() {
    moveThief(level);
    updateLevelDisplay();
    
    const popup = document.getElementById("winnerPopup");
    popup.classList.add("hidden");
    input.focus();

    const bgMusic = document.getElementById("bgMusic");
    if(!isMuted) {
        bgMusic.play();
    }
}

btn.addEventListener("click", handleSubmit);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSubmit();
    }
});

function startProgressBar(duration) {
    const bar = document.getElementById("timerBar");
    let startTime = Date.now();

    clearInterval(timerInterval);
    //  good help
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percent = Math.max(0, 100 - (elapsed / duration) * 100);
        bar.style.width = percent + "%";

        if (percent <= 0) {
            clearInterval(timerInterval);
        }
    }, 100);
}

// Winner popup
function showPopup(message) {
    const popup = document.getElementById("winnerPopup");
    const popupMessage = document.getElementById("popupMessage");

    popupMessage.textContent = message;
    popup.classList.remove("hidden");
}




function exitGame() {
    window.location.href = "index.html";
}

// Stylish alert
function showCustomAlert(message, autoHide = true) {
    const alertBox = document.getElementById("customAlert");
    const alertText = document.getElementById("customAlertText");

    alertText.textContent = message;
    alertBox.classList.remove("hidden");

    if (autoHide) {
        setTimeout(() => {
            hideCustomAlert();
        }, 3000);
    }
}

function hideCustomAlert() {
    const alertBox = document.getElementById("customAlert");
    alertBox.classList.add("hidden");
}


