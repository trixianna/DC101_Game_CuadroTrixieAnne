    let currMoleTile;
    let currPlantTile;
    let score = 0;
    let gameOver = false;
    let gameStarted = false;

    let highScoreEndless = localStorage.getItem("highScoreEndless") || 0;
    let highScoreChallenge = localStorage.getItem("highScoreChallenge") || 0;

    const startScreen = document.getElementById("startScreen");
    const gameScreen = document.getElementById("gameScreen");
    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");

    const gameOverScreen = document.getElementById("gameOverScreen");
    const finalScore = document.getElementById("finalScore");
    const playAgainBtn = document.getElementById("playAgainBtn");

    // ===== MODE SELECTION =====
    const modeEndlessBtn = document.getElementById("modeEndless");
    const modeChallengeBtn = document.getElementById("modeChallenge");

    modeEndlessBtn.addEventListener("click", () => {
        gameMode = "endless";
        modeEndlessBtn.classList.add("selected");
        modeChallengeBtn.classList.remove("selected");
    });

    modeChallengeBtn.addEventListener("click", () => {
        gameMode = "challenge";
        modeChallengeBtn.classList.add("selected");
        modeEndlessBtn.classList.remove("selected");
    });



    // ====== TIMER VARIABLES ======
    const timerDisplay = document.getElementById("timer"); // <h2 id="timer"> in HTML
    let timer = 30;
    let timerInterval;
    let gameMode = "endless"; // can be "endless" or "challenge"    

    let hitSound = new Audio("./sfx_hit.wav");
    let bgMusic = new Audio("./bgm_mole.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    let gameOverSound = new Audio("./game_over.wav");

    let moleInterval;
    let plantInterval;

    // ================= START BUTTON =================
    startBtn.addEventListener("click", startGame);
    playAgainBtn.addEventListener("click", () => {
        gameOverScreen.style.display = "none";
        restartGame();
    });

    const backHomeBtn = document.getElementById("backHomeBtn");

    backHomeBtn.addEventListener("click", () => {
        // Hide Game Over screen
        gameOverScreen.style.display = "none";

        // Show Start Screen
        startScreen.style.display = "flex";
        gameScreen.style.display = "none";

        // Reset game variables
        gameOver = false;
        score = 0;
        currMoleTile = null;
        currPlantTile = null;
        clearInterval(moleInterval);
        clearInterval(plantInterval);
        clearInterval(timerInterval);

        // Reset high score display
        document.getElementById("highScore").innerText = "High Score: " + 
            (gameMode === "endless" ? highScoreEndless : highScoreChallenge);
    });


    function startGame() {
        startScreen.style.display = "none";
        gameScreen.style.display = "block";

        setGame(); // always set game
        gameStarted = true;

        score = 0;
        document.getElementById("score").innerText = "Score: 0";



        // ====== TIMER MODE ======
        if (gameMode === "challenge") {
            timer = 30;
            timerDisplay.innerText = "Time: " + timer;
            clearInterval(timerInterval); // reset old timer
            timerInterval = setInterval(() => {
                timer--;
                timerDisplay.innerText = "Time: " + timer;

                if (timer <= 0) {
                    clearInterval(timerInterval);
                    endGame(); // game over when time runs out
                }
            }, 1000);
        } else {
            timerDisplay.innerText = ""; // hide timer in endless mode
        }

        bgMusic.currentTime = 0;
        bgMusic.play();
    }
    // ================= GAME SETUP =================
    function setGame() {
        document.getElementById("board").innerHTML = "";
        document.getElementById("score").innerText = "Score: 0";
    document.getElementById("highScore").innerText = 
        "High Score: " + (gameMode === "endless" ? highScoreEndless : highScoreChallenge);

        for (let i = 0; i < 9; i++) {
            let tile = document.createElement("div");
            tile.id = i.toString();
            tile.addEventListener("click", selectTile);
            document.getElementById("board").appendChild(tile);
        }

        moleInterval = setInterval(setMole, 1000);
        plantInterval = setInterval(setPlant, 2000);

        restartBtn.addEventListener("click", restartGame);
    }

    // ================= GAME LOGIC =================
    function getRandomTile() {
        return Math.floor(Math.random() * 9).toString();
    }

    function setMole() {
        if (gameOver) return;

        if (currMoleTile) currMoleTile.innerHTML = "";

        let mole = document.createElement("img");
        mole.src = "./monty-mole.png";

        let num = getRandomTile();
        if (currPlantTile && currPlantTile.id === num) return;

        currMoleTile = document.getElementById(num);
        currMoleTile.appendChild(mole);
    }

    function setPlant() {
        if (gameOver) return;

        if (currPlantTile) currPlantTile.innerHTML = "";

        let plant = document.createElement("img");
        plant.src = "./piranha-plant.png";

        let num = getRandomTile();
        if (currMoleTile && currMoleTile.id === num) return;

        currPlantTile = document.getElementById(num);
        currPlantTile.appendChild(plant);
    }

    function selectTile(e) {
        const hammer = document.getElementById("hammer");

        hammer.style.left = e.clientX + "px";
        hammer.style.top = e.clientY + "px";

        hammer.classList.add("hit");
        setTimeout(() => hammer.classList.remove("hit"), 150);

        if (gameOver) return;

        if (!bgMusic.played.length) bgMusic.play();

        if (this === currMoleTile) {
            hitSound.currentTime = 0;
            hitSound.play();

            score += 10;
            document.getElementById("score").innerText = "Score: " + score;
        } 
        else if (this === currPlantTile) {
        endGame();
    }
    }

    function endGame() {
        gameOver = true;

        clearInterval(moleInterval);
        clearInterval(plantInterval);
        clearInterval(timerInterval);

        finalScore.innerText = "Final Score: " + score;
        gameOverScreen.style.display = "flex";

    if (gameMode === "endless" && score > highScoreEndless) {
        highScoreEndless = score;
        localStorage.setItem("highScoreEndless", highScoreEndless);
    } 
    else if (gameMode === "challenge" && score > highScoreChallenge) {
        highScoreChallenge = score;
        localStorage.setItem("highScoreChallenge", highScoreChallenge);
    }

    // Update the display
    document.getElementById("highScore").innerText = 
        "High Score: " + (gameMode === "endless" ? highScoreEndless : highScoreChallenge);

        

        if (bgMusic) bgMusic.pause();
        gameOverSound.play();
    }

    // ================= RESTART =================
    function restartGame() {
        gameOver = false;
        score = 0;
        currMoleTile = null;
        currPlantTile = null;

        clearInterval(moleInterval);
        clearInterval(plantInterval);           

        setGame();
        restartBtn.style.display = "none";

        bgMusic.currentTime = 0;
        bgMusic.play();

        if (gameMode === "challenge") {
        timer = 30;
        timerDisplay.innerText = "Time: " + timer;
    }
    }
