const wordBank = ["SYNTAX", "JAVA", "REST", "DOCKER", "SLAYER", "API", "FRONTEND", "BACKEND", "SPRING", "DEPLOY"];
let score = 0;
let activeWords = [];
let isGameOver = false;
let fallSpeed = 2; // Starts at 2px

const BACKEND_URL = "https://word-slayer.onrender.com/api/v1/scores/slay";

function createWord() {
    if (isGameOver) return;
    const text = wordBank[Math.floor(Math.random() * wordBank.length)];
    const el = document.createElement('div');
    el.className = 'word';
    el.innerText = text;
    el.style.left = Math.random() * (window.innerWidth - 150) + 'px';
    el.style.top = '-50px';
    document.getElementById('game-container').appendChild(el);
    activeWords.push({ text, el, top: -50 });
    
    // Make it harder over time
    const spawnRate = Math.max(500, 1500 - (score * 5)); 
    setTimeout(createWord, spawnRate);
}

function update() {
    if (isGameOver) return;
    
    activeWords.forEach((obj, i) => {
        obj.top += fallSpeed + (score / 100); // Gradual speed increase
        obj.el.style.top = obj.top + 'px';
        
        if (obj.top > window.innerHeight - 150) {
            triggerGameOver();
        }
    });
    requestAnimationFrame(update);
}

document.getElementById('word-input').addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase();
    const index = activeWords.findIndex(w => w.text === val);
    
    if (index > -1) {
        // Visual Feedback: Shake the screen on slay
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 200);

        score += 10;
        document.getElementById('score').innerText = score;
        
        // Remove word
        activeWords[index].el.remove();
        activeWords.splice(index, 1);
        e.target.value = '';
    }
});

function triggerGameOver() {
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
    } catch (e) { console.warn("Backend link failed, but game continues!"); }
}

createWord();
update();