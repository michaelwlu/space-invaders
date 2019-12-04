// Declare canvas
let canvas
let canvasContext

// Game Config
const FRAMES_PER_SECOND = 30
const FLEET_SIDE_MARGIN = 80
const FLEET_TOP_MARGIN = 70
const PLAYER_SIDE_MARGIN = 10
const PLAYER_BOT_MARGIN = 50
const INSTRUCTIONS = 'USE LEFT / RIGHT ARROWS TO MOVE'

// Enemy Config
let enemyHeight = 15
let enemyWidth = 30
let enemyVelocityX = 10
let enemyVelocityY = 0

// Enemy Fleet Config
let fleetRows = 6
let fleetColumns = 6
let fleetWidthRatio = 0.6 // ratio to canvas
let fleetHeightRatio = 0.5 // ratio to canvas
let fleetMovementRate = 1000

// Player Config
let playerHeight = 20
let playerWidth = 30
let playerVelocityX = 10 // horizontal movement per keydown

// Positions & Time
let fleetCenterX
let fleetCenterY
let fleetMovementTimer = 0
let enemyFleet = {}
let playerCenterX
let playerCenterY
let gameStart = false

// On Load
window.onload = function() {
  canvas = document.getElementById('gameCanvas')
  canvasContext = canvas.getContext('2d')

  positionFleet()
  positionPlayer()

  setInterval(runAll, 1000/FRAMES_PER_SECOND)

  document.addEventListener('keydown', movePlayer)
}

// Umbrella Run All
function runAll() {
  fleetMovementTimer += 1000/FRAMES_PER_SECOND
  moveEverything()
  drawEverything()
}

// Initial Enemy Fleet Position
function positionFleet() {
  
  fleetWidth = canvas.width * fleetWidthRatio
  fleetHeight = canvas.height * fleetHeightRatio

  // Fleet container position
  fleetCenterX = canvas.width/2
  fleetCenterY = FLEET_TOP_MARGIN + (fleetHeightRatio*canvas.height)/2

  // Build fleet array based on given rows/columns
  for (let i = 0; i < fleetRows; ++i) {
    for (let j = 0; j < fleetColumns; ++j) {

      // Spaces fleet out based on given fleet width/height
      let position = [
        i * (fleetWidth)/(fleetColumns-1) + (canvas.width/2 - fleetWidth/2) - enemyWidth/2,
        j * (fleetHeight)/(fleetRows-1) + FLEET_TOP_MARGIN - enemyHeight/2
      ]

      // Assign enemy designation/positions as key/value pairs
      enemyFleet[i*fleetRows + j] = position
    }
  }
}

// Initial Player Position
function positionPlayer() {
  playerCenterX = canvas.width/2
  playerCenterY = canvas.height - PLAYER_BOT_MARGIN
}

// Move Player
function movePlayer(e) {

  if (gameStart === false && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) gameStart = true // remove instructions once correct keys are pressed

  // Move player based on keydown, bound by side margins
  switch (e.key) {

    case 'ArrowLeft':
      if (playerCenterX > PLAYER_SIDE_MARGIN) playerCenterX -= playerVelocityX
      break

    case 'ArrowRight':
      if (playerCenterX < canvas.width - PLAYER_SIDE_MARGIN) playerCenterX += playerVelocityX
      break
  }
}

// Umbrella Move
function moveEverything() {
  if (gameStart) {
    moveFleet()
  }
}

// Move Enemy Fleet
function moveFleet() {
  
  // Limits fleet movement rate
  if (fleetMovementTimer > fleetMovementRate) {
    
    // Moves individual enemies
    for (let key in enemyFleet) {
      enemyFleet[key][0] += enemyVelocityX
    }

    // Moves fleet position
    fleetCenterX += enemyVelocityX

    // Changes fleet horizontal movement direction when at edge
    if (fleetCenterX - fleetWidth/2 < FLEET_SIDE_MARGIN || fleetCenterX + fleetWidth/2 > canvas.width - FLEET_SIDE_MARGIN) {
      enemyVelocityX *= -1
      fleetCenterY += enemyVelocityY // moves the fleet down based on Y speed
    }

    // Reset fleet movement timer
    fleetMovementTimer = 0
  }
}

// Umbrella Draw
function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, 'black') // black background

  drawFleet()
  drawPlayer()

  if (!gameStart) displayInstructions() // displays instructions
}

// Draw Enemy Fleet
function drawFleet() {

  // Draws individual enemies
  for (let key in enemyFleet) {
    let enemyPos = enemyFleet[key]

    colorRect(enemyPos[0], enemyPos[1], enemyWidth, enemyHeight, 'white')
  }
}

// Draw Player
function drawPlayer() {
  colorRect(playerCenterX-playerWidth/6, playerCenterY-playerHeight/2, playerWidth/3, playerHeight/2, 'white')
  colorRect(playerCenterX-playerWidth/2, playerCenterY, playerWidth, playerHeight/2, 'white')
}

// Display Instructions
function displayInstructions() {
  canvasContext.font = '20px Arial'
  canvasContext.textAlign = "center";
  canvasContext.fillText(INSTRUCTIONS, canvas.width/2, 500)
}

// Draw Rectangle
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor
  canvasContext.fillRect(leftX, topY, width, height)
}