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
const GAME_OVER = 'YOU WIN'
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
const BULLET_RATE = 300 // fire rate in milliseconds

// Positions & Timer
let score = 0
let gameStart = false
let gameOver = false
let enemyFleet = {}
let fleetCenterX
let fleetCenterY
let fleetMovementTimer = 0
let playerCenterX
let playerCenterY
let bullets = []
let bulletTimer = BULLET_RATE
let bulletCooldown = false

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
  reloadBullet()
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

  // Start game if space is pressed
  if (gameStart === false && e.key === ' ') gameStart = true
  
  // Only fire when bullet is not on cooldown
  if (e.key === ' ' && bulletCooldown === false) {
    bullets.push([playerCenterX, playerCenterY - PLAYER_HEIGHT/2]) // add a bullet (coordinates) to array
    bulletCooldown = true // set bullet on cooldown
  }
}

// Reload Bullet
function reloadBullet() {

  // Begin bullet reload
  if (bulletCooldown === true) {
    bulletTimer -= 1000/FRAMES_PER_SECOND
  }

  // After reload time, set cooldown to false and reset bullet timer
  if (bulletTimer < 0) {
    bulletCooldown = false
    bulletTimer = BULLET_RATE
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
    bulletDetection()
  }
}

// Move Bullet
function moveBullet() {
  for (let bullet of bullets) {
    bullet[1] -= BULLET_VELOCITY_Y
  }
}

// Detect bullet offscreen or collision
function bulletDetection() {

  // Check each bullet in array
  for (let i = 0; i < bullets.length; ++i) {

    let selectedBullet = bullets[i]

    // If offscreen, delete bullet and continue
    if (selectedBullet[1] < 0) {
      bullets.splice(i, 1)
      continue // no need to check collision against enemy ships
    }

    // Check collision against each enemy ship
    for (let enemy in enemyFleet) {

      // Collision by matching coordinates
      if (selectedBullet[0] < enemyFleet[enemy][0] + ENEMY_WIDTH/2 &&
        selectedBullet[0] > enemyFleet[enemy][0] - ENEMY_WIDTH/2 &&
        selectedBullet[1] - BULLET_HEIGHT/2 < enemyFleet[enemy][1] + ENEMY_HEIGHT/2) {

          delete enemyFleet[enemy] // delete enemy ship from object
          bullets.splice(i, 1) // delete bullet
          score += SCORE_INCREMENT // increase score
          break // no need to check the remaining enemy ships
      }
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

  if (!gameStart) displayInstructions() // displays instructions
  else displayScore() // displays score

  if (score === SCORE_INCREMENT * FLEET_ROWS * FLEET_COLUMNS) displayGameOver() // when score equals # of enemy ships
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
  for (let bullet of bullets) {
    colorRect(bullet[0], bullet[1], BULLET_WIDTH, BULLET_HEIGHT, 'white')
  }
}

// Display Instructions
function displayInstructions() {
  canvasContext.font = '20px Arial'
  canvasContext.textAlign = "center";
  canvasContext.fillStyle = 'white'
  canvasContext.fillText(INSTRUCTIONS, canvas.width/2, 500)
}

// Display Game Over Message
function displayGameOver() {
  canvasContext.font = '35px Arial'
  canvasContext.textAlign = "center";
  canvasContext.fillStyle = GAME_OVER_COLOR
  canvasContext.fillText(GAME_OVER, canvas.width/2, canvas.height/2)
}

// Display Score
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