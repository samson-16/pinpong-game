var back= document.getElementById("back");
back.onclick=function(){
    window.open("Home.html", "_self");
}



const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');

// Audio files
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "WHITE"
};

const user = {
    x: 0, 
    y: (canvas.height - 100) / 2, 
    width: 16,
    height: 100,
    score: 0,
    color: "#93FF33",
    upPressed: false,
    downPressed: false
};


const player2 = {
    x: canvas.width - 16, // - width of paddle
    y: (canvas.height - 100) / 2, // -100 the height of paddle
    width: 16,
    height: 100,
    score: 0,
    color: "#93FF33",
    upPressed: false,
    downPressed: false
};


const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "#93FF33"
};


function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}


function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}


canvas.addEventListener("mousemove", movePaddle);
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);

// Move paddle on mouse move
function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}


function handleKeyDown(evt) {
    if (evt.key === "ArrowUp") {
        player2.upPressed = true;
    } else if (evt.key === "ArrowDown") {
        player2.downPressed = true;
    }
}

function handleKeyUp(evt) {
    if (evt.key === "ArrowUp") {
        player2.upPressed = false;
    } else if (evt.key === "ArrowDown") {
        player2.downPressed = false;
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// Draw net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Draw text
function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// Collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Update game logic
function update() {
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Simple AI to control player2 paddle
    if (player2.upPressed && player2.y > 0) {
        player2.y -= 7;
    } else if (player2.downPressed && (player2.y < canvas.height - player2.height)) {
        player2.y += 7;
    }

    
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : player2;
    if (collision(ball, player)) {

        hit.play();
        
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        
        // Calculate angle in radian
        let angleRad = (Math.PI / 4) * collidePoint;
        
        // X direction of the ball when it's hit
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // Speed up the ball
        ball.speed += 0.1;
    }


    if (ball.x - ball.radius < 0) {
        player2.score++;
        comScore.play();
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        userScore.play();
        resetBall();
    }
}


function render() {
   
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
   
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    
  
    drawText(player2.score, 3 * canvas.width / 4, canvas.height / 5);
    
   
    drawNet();
    

    drawRect(user.x, user.y, user.width, user.height, user.color);
    
  
    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
    
  
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}


function game() {
    update();
    render();
    if (player1.score === 5) {
        alert("You win!");
        reset();
    } else if (player2.score === 5) {
        alert("You lose!");
        reset();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

let framePerSecond = 50;
let loop = setInterval(game, 1000 / framePerSecond);
