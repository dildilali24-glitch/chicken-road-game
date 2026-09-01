const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const upBtn = document.getElementById('upBtn');
const gameOverModal = document.getElementById('gameOver');
const gameOverMsg = document.getElementById('gameOverMsg');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');

// গেম ভেরিয়েবল
let chicken = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 40,
    width: 30,
    height: 30,
    speed: 5
};

let cars = [];
let score = 0;
let level = 1;
let gameRunning = true;
let carSpeed = 2;

// গেম শুরু করুন
function startGame() {
    cars = [];
    gameRunning = true;
    gameOverModal.classList.remove('show');
    
    // গাড়ি তৈরি করুন
    for (let i = 0; i < 3 + level; i++) {
        cars.push({
            x: Math.random() * canvas.width,
            y: 100 + i * 80,
            width: 50,
            height: 40,
            speed: carSpeed + (level * 0.5)
        });
    }
    
    gameLoop();
}

// গেম লুপ
function gameLoop() {
    if (!gameRunning) return;
    
    // ক্যানভাস পরিষ্কার করুন
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // মুরগি আঁকুন
    drawChicken();
    
    // গাড়ি আঁকুন এবং সরান
    drawCars();
    
    // সংঘর্ষ পরীক্ষা করুন
    checkCollisions();
    
    // লক্ষ্য পরীক্ষা করুন
    if (chicken.y < 50) {
        levelUp();
        return;
    }
    
    requestAnimationFrame(gameLoop);
}

// মুরগি আঁকুন
function drawChicken() {
    // শরীর
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(chicken.x, chicken.y, chicken.width, chicken.height);
    
    // মাথা
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(chicken.x + 15, chicken.y - 5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // চোখ
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(chicken.x + 12, chicken.y - 7, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // ঠোঁট
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(chicken.x + 17, chicken.y - 5, 6, 2);
}

// গাড়ি আঁকুন
function drawCars() {
    cars.forEach(car => {
        // গাড়ির শরীর
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(car.x, car.y, car.width, car.height);
        
        // জানালা
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(car.x + 5, car.y + 5, 12, 12);
        ctx.fillRect(car.x + 25, car.y + 5, 12, 12);
        
        // চাকা
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(car.x + 10, car.y + car.height, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(car.x + 40, car.y + car.height, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // গাড়ি সরান
        car.x += car.speed;
        if (car.x > canvas.width) {
            car.x = -car.width;
        }
    });
}

// সংঘর্ষ পরীক্ষা করুন
function checkCollisions() {
    cars.forEach(car => {
        if (chicken.x < car.x + car.width &&
            chicken.x + chicken.width > car.x &&
            chicken.y < car.y + car.height &&
            chicken.y + chicken.height > car.y) {
            endGame();
        }
    });
}

// গেম শেষ করুন
function endGame() {
    gameRunning = false;
    gameOverMsg.textContent = `খেলা শেষ! স্কোর: ${score} | লেভেল: ${level}`;
    gameOverModal.classList.add('show');
}

// লেভেল আপ করুন
function levelUp() {
    score += 100 * level;
    level++;
    carSpeed += 0.5;
    
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    
    // মুরগি রিসেট করুন
    chicken.y = canvas.height - 40;
    chicken.x = canvas.width / 2 - 15;
    
    startGame();
}

// মুরগি নিয়ন্ত্রণ করুন
function moveChicken() {
    if (gameRunning && chicken.y > 0) {
        chicken.y -= 40;
    }
}

// বাটন ক্লিক
upBtn.addEventListener('click', moveChicken);

// কীবোর্ড নিয়ন্ত্রণ
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === ' ') {
        moveChicken();
    }
});

// ক্যানভাস ক্লিক
canvas.addEventListener('click', moveChicken);

// টাচ নিয়ন্ত্রণ
let lastTouchY = 0;
canvas.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    if (lastTouchY - currentY > 50) {
        moveChicken();
        lastTouchY = currentY;
    }
});

// গেম শুরু করুন
startGame();

// গেম পুনরায় শুরু করুন
function restartGame() {
    score = 0;
    level = 1;
    carSpeed = 2;
    chicken.x = canvas.width / 2 - 15;
    chicken.y = canvas.height - 40;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    startGame();
}
