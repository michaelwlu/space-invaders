let canvas
let canvasContext

// Game Config
const FRAMES_PER_SECOND = 30
const LEFT_MARGIN = 70
const RIGHT_MARGIN = 70
const TOP_MARGIN = 50
const INSTRUCTIONS = 'USE LEFT / RIGHT ARROWS TO MOVE'

// Enemy Config
let enemyHeight = 20
let enemyWidth = 20
let enemyXSpeed = 10
let enemyYSpeed = 0

// Enemy Fleet Config
let enemyRows = 6
let enemyColumns = 6
let enemyFleetWidth = 0.6 // ratio to canvas
let enemyFleetHeight = 0.5 // ratio to canvas

// Player Config
let playerHeight = 20
let playerWidth = 20
let playerMovement = 10

// Positions/Timer
let time = 0
let enemyFleetLeftX = LEFT_MARGIN + 0
let enemyFleetTopY = TOP_MARGIN + 0
let enemyMoveTimer = 0
let enemyFleet
let playerX = 400
let playerY = 550
let showInstructions = true

// On Load
window.onload = function() {
  canvas = document.getElementById('gameCanvas')
  canvasContext = canvas.getContext('2d')

  enemyFleet = createEnemies()
  setInterval(runAll, 1000/FRAMES_PER_SECOND)

  document.addEventListener('keydown', movePlayer)
}

function movePlayer(e) {
  if (showInstructions === true) showInstructions = false

  switch (e.key) {
    case 'ArrowLeft':
      if (playerX > LEFT_MARGIN) playerX -= playerMovement
      break
    case 'ArrowRight':
      if (playerX < (canvas.width - RIGHT_MARGIN)) playerX += playerMovement
      break
  }
}


// Umbrella Run All
function runAll() {
  enemyMoveTimer += 1000/FRAMES_PER_SECOND
  moveEverything()
  drawEverything()
}

// Initialize Enemy Fleet
function createEnemies() {
  let enemies = {}

  for (let i = 0; i < enemyRows; ++i) {
    for (let j = 0; j < enemyColumns; ++j) {
      let position = [i * (enemyFleetWidth * canvas.width)/(enemyColumns - 1) - enemyWidth/2, j * (enemyFleetHeight * canvas.height)/(enemyRows - 1) - enemyHeight/2]

      enemies[i*enemyRows + j] = position
    }
  }

  return enemies
}

// Umbrella Move
function moveEverything() {
  if (enemyMoveTimer > 1000) {
    moveFleet()
    enemyMoveTimer = 0
  }
}

// Move Enemy Fleet
function moveFleet() {
  for (let key in enemyFleet) {
    enemyFleet[key][0] += enemyXSpeed
  }

  enemyFleetLeftX += enemyXSpeed
  
  if (enemyFleetLeftX < LEFT_MARGIN || enemyFleetLeftX + (enemyFleetWidth * canvas.width) > canvas.width - RIGHT_MARGIN) {
    enemyXSpeed *= -1
    enemyFleetTopY += enemyYSpeed // for moving the fleet down
  }
}

// Umbrella Draw
function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, 'black')

  drawFleet()
  drawPlayer()

  if (showInstructions) displayInstructions()
}

// Draw Enemy Fleet
function drawFleet() {
  for (let key in enemyFleet) {
    let enemyPos = enemyFleet[key] 
    colorRect(LEFT_MARGIN + enemyPos[0],
      TOP_MARGIN + enemyPos[1], enemyWidth, enemyHeight, 'white')
  }
}

// Draw Player
function drawPlayer() {
  colorRect(playerX - playerWidth/2, playerY - playerHeight/2, playerWidth, playerHeight, 'white')
}

function displayInstructions() {
  canvasContext.font = '20px Arial'
  canvasContext.fillText(INSTRUCTIONS, 220, 500)
}

// HTML Canvas Draw Functions
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor
  canvasContext.fillRect(leftX, topY, width, height)
}