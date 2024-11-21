const playButton = document.getElementById('play-button');
const gameArea = document.getElementById("game-area")
const player = document.getElementById('player');
const characterSelect = document.getElementById('character-select');
const beyonce = document.querySelectorAll(`#beyonce`)[0]
const toggleTheme = document.getElementById('toggle-theme');
const audio = document.getElementById('audio');
const volumeSlider = document.getElementById('volume');
const difficultySlider = document.getElementById('difficulty-slider');
const difficultyValue = document.getElementById('difficulty-value');


const playerSpeed = 35
const speeds = {
    easy: 0.5, // Baja velocidad
    normal: 1, // Velocidad normal
    impossible: 2 // Alta velocidad
};
const disableGameControls = () => {
    window.removeEventListener('keydown', movePlayer);
    audio.pause();
}
const startGame = () => {
    gameArea.style.display = 'block';
    playButton.style.display = 'none';

    // Iniciar la música y la lógica del juego
    audio.play();
    isPlaying = true;
    window.addEventListener('keydown', movePlayer);
    gameLoop(); // Comenzar el ciclo del juego
};

let isPlaying = false;
let playerPosition = { x: 0, y: 0 }
let beyoncePosition = { x: 300, y: 300 }
let beyonceSpeed = speeds.normal

playButton.addEventListener('click', startGame);

difficultySlider.addEventListener('keydown', function(event) {
    // Prevenir que el slider se mueva con las teclas de flecha
    event.preventDefault();
});

characterSelect.addEventListener('keydown', function(event) {
    // Prevenir que las teclas de flecha cambien la opción seleccionada
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
    }
});

/**
 * Esta función detecta cuando Beyonce ya te alcanzó
 */
function changeCharacter() {
    // Eliminar todas las clases que cambian el fondo del personaje
    player.classList.remove('blue', 'beyonce', 'green', 'red');
    
    // Obtener el valor seleccionado y agregar la clase correspondiente
    const selectedCharacter = characterSelect.value;
    player.classList.add(selectedCharacter);
}

function detectCollision () {
    const deltaX = Math.abs(playerPosition.x - beyoncePosition.x)
    const deltaY = Math.abs(playerPosition.y - beyoncePosition.y)

    if (deltaX <= 50 && deltaY <= 50) {
        if(confirm('Has sido atrapado! Mejor suerte la próxima vez')) {
            playerPosition.x = Math.floor(Math.random() * (gameArea.clientWidth - 70))
            playerPosition.y = Math.floor(Math.random() * (gameArea.clientHeight - 70))
        } else {
            alert('Perdiste :(')
            isPlaying = false
            audio.pause()
        }
    }
}

function gameLoop () {
    if (!isPlaying) return;  // Si el juego no está activo, no hacer nada

    moveBeyonce();
    requestAnimationFrame(gameLoop);
}

function moveBeyonce () {
    updateDifficulty();

    if (beyoncePosition.x < playerPosition.x) 
        beyoncePosition.x += beyonceSpeed
    else if (beyoncePosition.x > playerPosition.x)
        beyoncePosition.x -= beyonceSpeed

    if (beyoncePosition.y < playerPosition.y) 
        beyoncePosition.y += beyonceSpeed
    else if (beyoncePosition.y > playerPosition.y)
        beyoncePosition.y -= beyonceSpeed

    updatePosition()
    if (isPlaying)
        detectCollision()
}

function movePlayer (event) {
    if (!isPlaying) return;

    switch (event.key) {
        case 'ArrowUp':
            if (playerPosition.y >= 25) 
                playerPosition.y -= playerSpeed;
            break;
        case 'ArrowDown':
            if(playerPosition.y < gameArea.clientHeight - 70)
                playerPosition.y += playerSpeed;
            break;
        case 'ArrowLeft':
            if (playerPosition.x >= 25) 
                playerPosition.x -= playerSpeed;
            break;
        case 'ArrowRight':
            if(playerPosition.x < gameArea.clientWidth - 70)
                playerPosition.x += playerSpeed;
            break;
    }

    updatePosition();
}

function updateDifficulty() {
    const value = difficultySlider.value;

    // Actualizar el texto del valor del slider
    if (value <= 33) {
        beyonceSpeed = speeds.easy;
        difficultyValue.textContent = "Fácil";
    } else if (value <= 66) {
        beyonceSpeed = speeds.normal;
        difficultyValue.textContent = "Normal";
    } else {
        beyonceSpeed = speeds.impossible;
        difficultyValue.textContent = "Imposible";
    }
}


function updatePosition () {
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
    beyonce.style.transform = `translate(${beyoncePosition.x}px, ${beyoncePosition.y}px)`;
}
audio.volume = volumeSlider.value;

difficultySlider.addEventListener('input', updateDifficulty);

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

toggleTheme.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', toggleTheme.checked);
});

characterSelect.addEventListener('change', changeCharacter);

audio.loop = true;

window.addEventListener('keydown', movePlayer)
window.addEventListener('load', () => {
    audio.play()
    gameLoop()
    updateDifficulty();
    changeCharacter();
})