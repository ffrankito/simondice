const simonColors = ['red', 'blue', 'green', 'yellow'];
let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let isStrictMode = false;
let isGameRunning = false;
let startTime;
let penaltyTime = 10; // Puntos a restar por tiempo demorado
let playerName = ""
const btnStart = document.getElementById('btn-start');
const simonButtons = document.querySelectorAll('.simon-button');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const modal = document.getElementById('modal');
const finalScoreDisplay = document.getElementById('final-score');
const btnRestart = document.getElementById('btn-restart');
const timerDisplay = document.createElement('div');
const scoreDisplayElement = document.createElement('div');
const timerScoreContainer = document.createElement('div');
const btnSortDate = document.getElementById('btn-sort-date');
const btnSortScore = document.getElementById('btn-sort-score');
const rankingList = document.getElementById('ranking-list');
timerScoreContainer.classList.add('timer-score-container');
timerDisplay.textContent = 'Tiempo: 0s';
scoreDisplayElement.textContent = 'Puntaje: 0';
const FLASH_DURATION = 100; // Duración del destello en milisegundos
const DELAY_BETWEEN_FLASHES = 100; // Retraso entre destellos en milisegundos
const BUTTON_SIZE_SCALE = 1.1; // Tamaño al destellar

timerScoreContainer.appendChild(timerDisplay);
timerScoreContainer.appendChild(scoreDisplayElement);

const gameContainer = document.querySelector('.game-container');
gameContainer.insertBefore(timerScoreContainer, document.getElementById('simon-container'));
const elapsedTime = 0
let gameStartTime;
let gameTimer;
let penzalizacion;
let tiempo = 0;
let tiempofinal;
function startGameTimer() {
  
  intervalId = setInterval(() => {
    tiempo += 1; // Incrementar el tiempo en 1 segundo
    timerDisplay.textContent = 'Tiempo: ' + tiempo + 's'; // Actualizar el contenido del elemento HTML
  }, 1000); // 1000 milisegundos = 1 segundo
}



function playSimonSequence() {
  isGameRunning = false;
  playerSequence = [];

  const randomColor = simonColors[Math.floor(Math.random() * simonColors.length)];
  sequence.push(randomColor);

  let i = 0;
  const intervalId = setInterval(() => {
    const color = sequence[i];
    flashButton(color, true);
    setTimeout(() => {
      unflashButton(color, true);
    }, FLASH_DURATION);
    i++;
    if (i >= sequence.length) {
      clearInterval(intervalId);
      setTimeout(() => {
        isGameRunning = true;
        startTime = Date.now();
        playerSequence = []; // Limpiar la secuencia del jugador al iniciar la partida
      }, DELAY_BETWEEN_FLASHES);
    }
  }, FLASH_DURATION + DELAY_BETWEEN_FLASHES); // Intervalo entre destellos: FLASH_DURATION + DELAY_BETWEEN_FLASHES ms
}

function flashButton(color, isShowSequence) {
  const button = document.getElementById(color);
  button.style.backgroundColor = isShowSequence ? 'white' : color; // Cambiar el color de fondo al mostrar la secuencia
  button.style.opacity = 1; // Asegurarse de que la opacidad esté al 100%
  button.classList.add('active'); // Agregar clase para cambio de tamaño al destellar

  setTimeout(() => {
    unflashButton(color, isShowSequence); // Agregar parámetro para indicar si se debe volver a mostrar en su color original
  }, isShowSequence ? FLASH_DURATION : FLASH_DURATION - 150); // 150ms menos para que vuelva a su color antes del destello completo
}
function unflashButton(color, isShowSequence) {
  const button = document.getElementById(color);
  button.style.backgroundColor = isShowSequence ? color : 'transparent'; // Cambiar el color de fondo al mostrar la secuencia
  button.style.opacity = isShowSequence ? 1 : 0.7; // Asegurarse de que la opacidad esté al 100% si se muestra en su color original
  button.classList.remove('active'); // Eliminar clase para cambio de tamaño al destellar

  if (!isShowSequence && isGameRunning) {
    // Volver a encender el botón después de mostrarlo en blanco
    setTimeout(() => {
      button.style.backgroundColor = color;
      button.style.opacity = 1;
    }, 200); // 200ms de retardo antes de volver a encenderlo
  }
}

function handleSimonButtonClick(event) {
  if (!isGameRunning) return;

  const color = event.target.id;
  playerSequence.push(color);

  if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
    // Player made a mistake
    endGame();
  } else {
    // Player's sequence is correct so far
    flashButton(color);
    if (playerSequence.length === sequence.length) {
      // Player completed the sequence
      score += sequence.length;
      scoreDisplayElement.textContent = `Puntaje: ${score}`;
      level++;
      levelDisplay.textContent = ` ${level}`;
      playSimonSequence();
    }
  }
}

function endGame() {

  const finalScore = Math.max(score, 0); // Asegurarse de que el puntaje final no sea negativo
  finalScoreDisplay.textContent = `Puntaje Final: ${finalScore}`;
  modal.style.display = 'block';
  saveGameResult(); // Guardar el resultado de la partida
  tiempo = 0 
  clearInterval(intervalId);
  timerDisplay.textContent = 'Tiempo: 0s'
  
}

function restartGame() {
  sequence = [];
  playerSequence = [];
  level = 1;
  score = 0;
  scoreDisplayElement.textContent = 'Puntaje: 0';
  levelDisplay.textContent = ' 1';
  finalScoreDisplay.textContent = '';
  modal.style.display = 'none';
  isGameRunning = true;
  playSimonSequence();
  startGameTimer(); // Iniciar el temporizador al reiniciar el juego
}

btnStart.addEventListener('click', () => {
  playerName = prompt('Ingresa tu nombre:');
  if (!playerName) return;  
  if (!isGameRunning) {
    
    restartGame();
  }
});

simonButtons.forEach(button => {
  button.addEventListener('click', handleSimonButtonClick);
});

btnRestart.addEventListener('click', restartGame);

window.addEventListener('beforeunload', () => {
  if (isGameRunning) {
    stopGameTimer(); // Detener el temporizador antes de salir de la página
  }
});

// Extra buttons to display and clear game results
const btnShowResults = document.createElement('button');
btnShowResults.textContent = 'Mostrar Resultados';
btnShowResults.addEventListener('click', displayGameResults);
document.body.appendChild(btnShowResults);

const btnClearResults = document.createElement('button');
btnClearResults.textContent = 'Limpiar Resultados';
btnClearResults.addEventListener('click', () => {
  localStorage.removeItem('gameResults');
  alert('Resultados limpiados.');
});
document.body.appendChild(btnClearResults);

function saveGameResult() {
  
  penzalizacion = score * (0.05)
  ScoreFinal = score - penzalizacion
  const gameResult = {
    name: playerName,
    score: Math.max(score, 0), // Asegurarse de que el puntaje final no sea negativo
    level: level,
    date: new Date().toLocaleString(),
    Puntaje: ScoreFinal,
  };

  let gameResults = localStorage.getItem('gameResults');
  if (gameResults) {
    gameResults = JSON.parse(gameResults);
  } else {
    gameResults = [];
  }

  gameResults.push(gameResult);
  localStorage.setItem('gameResults', JSON.stringify(gameResults));
}

function displayGameResults() {
  const gameResults = JSON.parse(localStorage.getItem('gameResults'));
  if (!gameResults || gameResults.length === 0) {
    alert('Aún no hay resultados guardados.');
    return;
  }

  const resultDisplay = gameResults.map(result => {
    return `${result.name} - Puntaje: ${result.score} - Nivel: ${result.level} - Fecha: ${result.date} - Puntaje con Penalizacion: ${result.Puntaje}` ;
  }).join('\n');

  alert('Resultados:\n' + resultDisplay);
}
const btnPause = document.getElementById('btn-pause');
let isGamePaused = false;

function pauseGame() {
  if (isGameRunning && !isGamePaused) {
    isGamePaused = true;
    stopGameTimer(); // Detener el temporizador
    btnPause.textContent = 'Continuar Juego';
  } else if (isGameRunning && isGamePaused) {
    isGamePaused = false;
    startGameTimer(); // Continuar el temporizador
    btnPause.textContent = 'Pausar Juego';
  }
}
btnSortDate.addEventListener('click', () => {
  renderRanking(sortByDate());
});

btnSortScore.addEventListener('click', () => {
  renderRanking(sortByScore());
});

function sortByDate() {
  let gameResults = getGameResultsFromLocalStorage();
  gameResults.sort((a, b) => new Date(b.date) - new Date(a.date));
  return gameResults;
}

function sortByScore() {
  let gameResults = getGameResultsFromLocalStorage();
  gameResults.sort((a, b) => b.score - a.score);
  return gameResults;
}

function renderRanking(gameResults) {
  rankingList.innerHTML = ''; // Limpiar la lista antes de volver a renderizar

  gameResults.forEach((result, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${result.name} - Puntaje: ${result.score}, Nivel: ${result.level}, Fecha: ${result.date}, Puntaje con Penalizacion: ${result.Puntaje}`;
    rankingList.appendChild(listItem);
  });
}

function getGameResultsFromLocalStorage() {
  let gameResults = localStorage.getItem('gameResults');
  if (gameResults) {
    return JSON.parse(gameResults);
  } else {
    return [];
  }
}

// Mostrar el ranking inicialmente ordenado por puntaje
renderRanking(sortByScore());
btnPause.addEventListener('click', pauseGame);