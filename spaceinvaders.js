let canvas
let canvasContext
let time = 0
const FRAMES_PER_SECOND = 30
const LEFT_MARGIN = 50
const RIGHT_MARGIN = 70
const TOP_MARGIN = 50

// Enemy array: 6 x 6

canvas = document.getElementById('gameCanvas')
canvasContext = canvas.getContext('2d')

let enemyHeight = 20
let enemyWidth = 20
let enemyXSpeed = 10
let enemyYSpeed = 1
let enemyRows = 6
let enemyColumns = 6
let enemyFleetWidth = canvas.width * 0.7
let enemyFleetHeight = canvas.height * 0.6
let enemyFleet = createEnemies()
let enemyFleetX = LEFT_MARGIN
let enemyFleetY = TOP_MARGIN
let enemyMoveTimer = 0

// Player

let playerX = 100
let playerY = 100

window.onload = function() {
  canvas = document.getElementById('gameCanvas')
  canvasContext = canvas.getContext('2d')

  setInterval(runAll, 1000/FRAMES_PER_SECOND)
}

function createEnemies() {
  let enemies = {}

  for (let i = 0; i < enemyRows; ++i) {
    for (let j = 0; j < enemyColumns; ++j) {
      let position = [i*enemyFleetWidth/(enemyColumns-1), j*enemyFleetHeight/(enemyRows-1)]

      enemies[i*enemyRows + j] = position
    }
  }

  return enemies
}

function runAll() {
  enemyMoveTimer += 1000/FRAMES_PER_SECOND
  moveEverything()
  drawEverything()
}

// Umbrella Move Function
function moveEverything() {
  if (enemyMoveTimer > 1000) {
    moveFleet()
    enemyMoveTimer = 0
  }
}

function moveFleet() {
  for (let key in enemyFleet) {
    enemyFleet[key][0] += enemyXSpeed
  }

  enemyFleetX += enemyXSpeed
  
  if (enemyFleetX < LEFT_MARGIN || enemyFleetX + enemyFleetWidth > canvas.width - RIGHT_MARGIN) {
    enemyXSpeed *= -1
    enemyFleetY += enemyYSpeed
  }
}

// Umbrella Draw Function
function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, 'black')

  drawFleet()
}

function drawFleet() {
  for (let key in enemyFleet) {
    let enemyPos = enemyFleet[key] 
    colorRect(LEFT_MARGIN + enemyPos[0],
      TOP_MARGIN + enemyPos[1], enemyWidth, enemyHeight, 'white')
  }
}

// Draw functions

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor
  canvasContext.fillRect(leftX, topY, width, height)
}