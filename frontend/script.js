const words = ["JAVA", "CODE", "SLAY", "GITHUB", "SCRIPT", "HTML", "DATA", "BACKEND"];
let score = 0;
let activeWords = [];
let isGameOver = false;

// Replace with your Render URL after Phase 4
const BACKEND_URL = "https://word-slayer.onrender.com/api/v1/scores/slay";

function createWord() {
    if (isGameOver) return;
    const text = words[Math.floor(Math.random() * words.length)];
    const el = document.createElement('div');
    el.className = 'word';
    el.innerText = text;
    el.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    el.style.top = '0px';
    document.getElementById('game-container').appendChild(el);
    activeWords.push({ text, el, top: 0 });
    setTimeout(createWord, 1500);
}

function update() {
    if (isGameOver) return;
    activeWords.forEach((obj, i) => {
        obj.top += 2; 
        obj.el.style.top = obj.top + 'px';
        if (obj.top > window.innerHeight - 120) endGame();
    });
    requestAnimationFrame(update);
}

document.getElementById('word-input').addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase();
    const index = activeWords.findIndex(w => w.text === val);
    if (index > -1) {
        score += 10;
        document.getElementById('score').innerText = score;
        activeWords[index].el.remove();
        activeWords.splice(index, 1);
        e.target.value = '';
    }
});

function endGame() {
    isGameOver = true;
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('final-score').innerText = score;
    saveScore(score);
}

async function saveScore(val) {
    try {
        await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: "Slayer", value: val })
        });
    } catch (e) { console.log("Backend offline, score not saved."); }
}

createWord();
update();