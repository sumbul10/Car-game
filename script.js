/* =====================================================
   ROAD RUSH GAME
===================================================== */

(() => {

    "use strict";


    /* =================================================
       ELEMENTS
    ================================================= */

    const road =
        document.getElementById("road");

    const player =
        document.getElementById("player");

    const scoreDisplay =
        document.getElementById("score");

    const livesDisplay =
        document.getElementById("lives");

    const speedDisplay =
        document.getElementById("speed");

    const startScreen =
        document.getElementById("startScreen");

    const gameOverScreen =
        document.getElementById("gameOver");

    const finalScore =
        document.getElementById("finalScore");

    const bestScoreDisplay =
        document.getElementById("bestScore");

    const startBtn =
        document.getElementById("startBtn");

    const restartBtn =
        document.getElementById("restartBtn");

    const leftBtn =
        document.getElementById("leftBtn");

    const rightBtn =
        document.getElementById("rightBtn");


    /* =================================================
       GAME VARIABLES
    ================================================= */

    let gameRunning = false;

    let score = 0;

    let lives = 3;

    let speed = 4;

    let playerLane = 1;

    let enemies = [];

    let enemyTimer = null;

    let scoreTimer = null;

    let animationId = null;


    /*
        0 = LEFT
        1 = CENTER
        2 = RIGHT
    */


    /* =================================================
       LANE POSITION
    ================================================= */

    function getLanePosition(lane) {

        const roadWidth =
            road.clientWidth;

        const laneWidth =
            roadWidth / 3;

        const carWidth =
            player.offsetWidth;

        return (
            lane * laneWidth +
            laneWidth / 2 -
            carWidth / 2
        );

    }


    /* =================================================
       UPDATE PLAYER
    ================================================= */

    function updatePlayerPosition() {

        player.style.left =
            `${getLanePosition(playerLane)}px`;

    }


    /* =================================================
       MOVE LEFT
    ================================================= */

    function moveLeft() {

        if (!gameRunning) {
            return;
        }

        if (playerLane > 0) {

            playerLane--;

            updatePlayerPosition();

        }

    }


    /* =================================================
       MOVE RIGHT
    ================================================= */

    function moveRight() {

        if (!gameRunning) {
            return;
        }

        if (playerLane < 2) {

            playerLane++;

            updatePlayerPosition();

        }

    }


    /* =================================================
       KEYBOARD CONTROLS
    ================================================= */

    function keyboardHandler(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            event.preventDefault();

            moveLeft();

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            event.preventDefault();

            moveRight();

        }

    }


    document.addEventListener(
        "keydown",
        keyboardHandler
    );


    /* =================================================
       MOBILE CONTROLS
    ================================================= */

    leftBtn.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            moveLeft();

        }
    );


    rightBtn.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            moveRight();

        }
    );


    /* =================================================
       CREATE ENEMY
    ================================================= */

    function createEnemy() {

        if (!gameRunning) {
            return;
        }


        const enemy =
            document.createElement("div");


        enemy.className =
            "enemy-car";


        const lane =
            Math.floor(
                Math.random() * 3
            );


        const laneWidth =
            road.clientWidth / 3;


        const enemyWidth = 58;


        const leftPosition =
            lane * laneWidth +
            laneWidth / 2 -
            enemyWidth / 2;


        enemy.style.left =
            `${leftPosition}px`;


        enemy.style.top =
            "-120px";


        /* Random colors */

        const colors = [

            ["#1e40af", "#3b82f6"],

            ["#047857", "#10b981"],

            ["#7c3aed", "#a855f7"],

            ["#b45309", "#f59e0b"],

            ["#be123c", "#f43f5e"]

        ];


        const randomColor =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        enemy.style.background =
            `linear-gradient(
                90deg,
                ${randomColor[0]},
                ${randomColor[1]},
                ${randomColor[0]}
            )`;


        road.appendChild(enemy);


        enemies.push({

            element: enemy,

            lane: lane,

            y: -120

        });

    }


    /* =================================================
       COLLISION
    ================================================= */

    function checkCollision(
        first,
        second
    ) {

        return (

            first.left <
            second.right &&

            first.right >
            second.left &&

            first.top <
            second.bottom &&

            first.bottom >
            second.top

        );

    }


    /* =================================================
       GAME LOOP
    ================================================= */

    function updateGame() {

        if (!gameRunning) {
            return;
        }


        const playerRect =
            player.getBoundingClientRect();


        for (
            let i = enemies.length - 1;
            i >= 0;
            i--
        ) {

            const enemy =
                enemies[i];


            enemy.y += speed;


            enemy.element.style.top =
                `${enemy.y}px`;


            const enemyRect =
                enemy.element.getBoundingClientRect();


            /* Collision */

            if (
                checkCollision(
                    playerRect,
                    enemyRect
                )
            ) {

                enemy.element.remove();

                enemies.splice(i, 1);

                loseLife();

                continue;

            }


            /* Enemy passed player */

            if (
                enemy.y >
                road.clientHeight + 120
            ) {

                enemy.element.remove();

                enemies.splice(i, 1);

                score += 10;

                updateScore();

            }

        }


        animationId =
            requestAnimationFrame(
                updateGame
            );

    }


    /* =================================================
       SCORE
    ================================================= */

    function updateScore() {

        scoreDisplay.textContent =
            score;

    }


    /* =================================================
       LOSE LIFE
    ================================================= */

    function loseLife() {

        lives--;

        livesDisplay.textContent =
            lives;


        /* Screen shake */

        road.animate(
            [
                {
                    transform:
                        "translateX(0)"
                },

                {
                    transform:
                        "translateX(-8px)"
                },

                {
                    transform:
                        "translateX(8px)"
                },

                {
                    transform:
                        "translateX(-5px)"
                },

                {
                    transform:
                        "translateX(0)"
                }
            ],
            {
                duration: 250
            }
        );


        if (lives <= 0) {

            endGame();

        }

    }


    /* =================================================
       DIFFICULTY
    ================================================= */

    function increaseDifficulty() {

        if (!gameRunning) {
            return;
        }


        score++;

        updateScore();


        /*
            Speed increases with score
        */

        speed =
            4 +
            Math.floor(
                score / 100
            );


        const speedLevel =
            Math.max(
                1,
                Math.floor(
                    speed / 4
                )
            );


        speedDisplay.textContent =
            `${speedLevel}x`;

    }


    /* =================================================
       CLEAR ENEMIES
    ================================================= */

    function clearEnemies() {

        enemies.forEach(
            enemy => {

                enemy.element.remove();

            }
        );


        enemies = [];

    }


    /* =================================================
       START GAME
    ================================================= */

    function startGame() {

        /* Stop previous timers */

        clearInterval(enemyTimer);

        clearInterval(scoreTimer);

        cancelAnimationFrame(
            animationId
        );


        /* Reset */

        gameRunning = true;

        score = 0;

        lives = 3;

        speed = 4;

        playerLane = 1;


        clearEnemies();


        /* UI */

        scoreDisplay.textContent =
            "0";

        livesDisplay.textContent =
            "3";

        speedDisplay.textContent =
            "1x";


        updatePlayerPosition();


        /* Screens */

        startScreen.classList.add(
            "hidden"
        );

        gameOverScreen.classList.add(
            "hidden"
        );


        /* Create enemies */

        enemyTimer =
            setInterval(
                createEnemy,
                850
            );


        /* Score timer */

        scoreTimer =
            setInterval(
                increaseDifficulty,
                1000
            );


        /* Start animation */

        updateGame();

    }


    /* =================================================
       END GAME
    ================================================= */

    function endGame() {

        gameRunning = false;


        clearInterval(enemyTimer);

        clearInterval(scoreTimer);

        cancelAnimationFrame(
            animationId
        );


        /* Best score */

        const oldBest =
            Number(
                localStorage.getItem(
                    "roadRushBest"
                )
            ) || 0;


        if (score > oldBest) {

            localStorage.setItem(
                "roadRushBest",
                score
            );

        }


        const bestScore =
            Math.max(
                score,
                oldBest
            );


        finalScore.textContent =
            score;


        bestScoreDisplay.textContent =
            bestScore;


        gameOverScreen.classList.remove(
            "hidden"
        );

    }


    /* =================================================
       BUTTON EVENTS
    ================================================= */

    startBtn.addEventListener(
        "click",
        startGame
    );


    restartBtn.addEventListener(
        "click",
        startGame
    );


    /* =================================================
       RESIZE
    ================================================= */

    window.addEventListener(
        "resize",
        updatePlayerPosition
    );


    /* =================================================
       INITIAL
    ================================================= */

    updatePlayerPosition();


})();