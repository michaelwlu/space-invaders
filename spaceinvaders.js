/* Recurse Center Pair Programming Task:

Write a game of Space Invaders that has computer-controller enemies that move left and right automatically and a human-controlled player that you can move left and right with the arrow keys.

During your interview, you can add the ability to shoot bullets at the enemies and track your score.

*/

// HTML Canvas
let canvas
let canvasContext

// Game Config
const FRAMES_PER_SECOND = 30
const FLEET_SIDE_MARGIN = 80
const FLEET_TOP_MARGIN = 100
const PLAYER_SIDE_MARGIN = 10
const PLAYER_BOT_MARGIN = 50
const INSTRUCTIONS = 'LEFT / RIGHT ARROWS TO MOVE  |  SPACE TO FIRE'
const GAME_OVER = 'GG EZ'
const GAME_OVER_COLOR = 'white'
const SCORE_INCREMENT = 100
const SCORE_COLOR = '#99ff99'

// Enemy/Fleet Config
let enemyVelocityX = 15
let enemyVelocityY = 0 // adjusts fleet moving down
const ENEMY_HEIGHT = 15
const ENEMY_WIDTH = 30
const ENEMY_COLOR = '#ffcccc'
const FLEET_ROWS = 6
const FLEET_COLUMNS = 6
const FLEET_WIDTH_RATIO = 0.6 // ratio to canvas
const FLEET_HEIGHT_RATIO = 0.5 // ratio to canvas
const FLEET_MOVE_RATE = 1000 // how often fleet moves (in milliseconds)

// Player Config
const PLAYER_HEIGHT = 20
const PLAYER_WIDTH = 30
const PLAYER_COLOR = '#99ccff'
const PLAYER_VELOCITY_X = 10 // horizontal movement per keydown
const BULLET_VELOCITY_Y = 20
const BULLET_HEIGHT = 10
const BULLET_WIDTH = 3

// Positions & Timer
let fleetCenterX
let fleetCenterY
let enemyFleet = {}
let playerCenterX
let playerCenterY
let fleetMovementTimer = 0
let gameStart = false
let gameOver = false
let bulletCooldown = false
let bulletX
let bulletY
let score = 0

// On Load
window.onload = function() {
  canvas = document.getElementById('gameCanvas')
  canvasContext = canvas.getContext('2d')

  positionFleet()
  positionPlayer()

  setInterval(runAll, 1000/FRAMES_PER_SECOND)

  document.addEventListener('keydown', movePlayer)
  document.addEventListener('keydown', fireBullet)
}

// Umbrella Run All
function runAll() {
  fleetMovementTimer += 1000/FRAMES_PER_SECOND
  moveEverything()
  drawEverything()
}

// Initial Enemy Fleet Position
function positionFleet() {
  
  fleetWidth = canvas.width * FLEET_WIDTH_RATIO
  fleetHeight = canvas.height * FLEET_HEIGHT_RATIO

  // Fleet container position
  fleetCenterX = canvas.width/2
  fleetCenterY = FLEET_TOP_MARGIN + (FLEET_HEIGHT_RATIO*canvas.height)/2

  // Build fleet array based on given rows/columns
  for (let i = 0; i < FLEET_ROWS; ++i) {
    for (let j = 0; j < FLEET_COLUMNS; ++j) {

      // Spaces fleet out based on given fleet width/height
      let position = [
        i * (fleetWidth)/(FLEET_COLUMNS-1) + (canvas.width/2 - fleetWidth/2),
        j * (fleetHeight)/(FLEET_ROWS-1) + FLEET_TOP_MARGIN
      ]

      // Assign enemy designation/positions as key/value pairs
      enemyFleet[i*FLEET_ROWS + j] = position
    }
  }
}

// Initial Player Position
function positionPlayer() {
  playerCenterX = canvas.width/2
  playerCenterY = canvas.height - PLAYER_BOT_MARGIN
}

// Fire Bullet
function fireBullet(e) {
  if (e.key === ' ' && bulletCooldown === false) {
    bulletX = playerCenterX
    bulletY = playerCenterY - PLAYER_HEIGHT/2
    bulletCooldown = true
  }
}

// Move Player
function movePlayer(e) {

  if (gameStart === false && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) gameStart = true // remove instructions once correct keys are pressed

  // Move player based on keydown, bound by side margins
  switch (e.key) {

    case 'ArrowLeft':
      if (playerCenterX > PLAYER_SIDE_MARGIN) playerCenterX -= PLAYER_VELOCITY_X
      break

    case 'ArrowRight':
      if (playerCenterX < canvas.width - PLAYER_SIDE_MARGIN) playerCenterX += PLAYER_VELOCITY_X
      break
  }
}

// Umbrella Move
function moveEverything() {
  if (gameStart) {
    moveFleet()
    moveBullet()
    offScreenBullet()
    collisionDetection()
  }
}

// Move Bullet
function moveBullet() {
  if (bulletCooldown) {
    bulletY -= BULLET_VELOCITY_Y
  }
}

function resetBullet() {
  bulletCooldown = false
  bulletX = null
  bulletY = null
}

// Check Bullet
function offScreenBullet() {
  if (bulletY < 0) {
    resetBullet()
  }
}

// Collision Detection
function collisionDetection() {
  for (let enemy in enemyFleet) {
    if (bulletX < enemyFleet[enemy][0] + ENEMY_WIDTH/2 &&
      bulletX > enemyFleet[enemy][0] - ENEMY_WIDTH/2 &&
      bulletY - BULLET_HEIGHT/2 < enemyFleet[enemy][1] + ENEMY_HEIGHT/2) {
        delete enemyFleet[enemy]
        score += SCORE_INCREMENT
        resetBullet()
    }
  }
}

// Move Enemy Fleet
function moveFleet() {
  
  // Limits fleet movement rate
  if (fleetMovementTimer > FLEET_MOVE_RATE) {
    
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
  drawBullet()

  if (!gameStart) displayInstructions()
  else displayScore() // displays instructions

  if (score === SCORE_INCREMENT * FLEET_ROWS * FLEET_COLUMNS) displayGameOver()
}

// Draw Enemy Fleet
function drawFleet() {

  // Draws individual enemies
  for (let key in enemyFleet) {
    let enemyPos = enemyFleet[key]

    colorRect(enemyPos[0] - ENEMY_WIDTH/2, enemyPos[1] - ENEMY_HEIGHT/2, ENEMY_WIDTH, ENEMY_HEIGHT, ENEMY_COLOR)
  }
}

// Draw Player
function drawPlayer() {
  colorRect(playerCenterX-PLAYER_WIDTH/6, playerCenterY-PLAYER_HEIGHT/2, PLAYER_WIDTH/3, PLAYER_HEIGHT/2, PLAYER_COLOR)
  colorRect(playerCenterX-PLAYER_WIDTH/2, playerCenterY, PLAYER_WIDTH, PLAYER_HEIGHT/2, PLAYER_COLOR)
}

// Draw Bullet
function drawBullet() {
  if (bulletCooldown) {
    colorRect(bulletX, bulletY, BULLET_WIDTH, BULLET_HEIGHT, 'white')
  }
}

// Display Instructions
function displayInstructions() {
  canvasContext.font = '20px Arial'
  canvasContext.textAlign = "center";
  canvasContext.fillStyle = 'white'
  canvasContext.fillText(INSTRUCTIONS, canvas.width/2, 500)
}

function displayGameOver() {
  canvasContext.font = '50px Arial'
  canvasContext.textAlign = "center";
  canvasContext.fillStyle = GAME_OVER_COLOR
  canvasContext.fillText(GAME_OVER, canvas.width/2, canvas.height/2)
}

function displayScore() {
  canvasContext.font = '20px Arial'
  canvasContext.textAlign = "center";
  canvasContext.fillStyle = SCORE_COLOR
  canvasContext.fillText(score, canvas.width/2, 50)
}

// Draw Rectangle
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor
  canvasContext.fillRect(leftX, topY, width, height)
}