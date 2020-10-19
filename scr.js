const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 500
canvas.height = 500

let image = new Image
image.src = "sprite.png"

let space = new Image
space.src = "bgimage.png"

const atlas = {
    ball: { x: 95, y: 79, width: 26, height: 26},
    red: { x: 71, y: 0, width: 66, height: 33 },
    blue: { x: 215, y: 0, width: 65, height: 35 },
    yellow: { x: 143, y: 39, width: 66, height: 34 },
    green: { x: 143, y: 0, width: 66, height: 33 },
    platform: { x: 151, y: 79, width: 129, height: 26 }
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 10,
    height: 10,
    speed: 150,
    angle: Math.PI / 4 + Math.random() * Math.PI / 2
}

const platform = { 
    x: canvas.width /2,
    y: canvas.height - 10,
    width: 100,
    height: 10,
    speed: 250,
    leftKey: false,
    rightKey: false

}

const blocks = []

//    { x: 50, y: 50, width: 50, height: 20 , color: 'red'},
//{ x: 100, y: 50, width: 50, height: 20, color: 'blue'},
//{ x: 150, y: 50, width: 50, height: 20, color: 'yellow'},
//{ x: 200, y: 50, width: 50, height: 20, color: 'green'},

for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 10; y++) {
        blocks.push({
            x: 50 + 50 * x,
            y: 50 + 20 * y,
            width: 50,
            height: 20,
            color: getRandomFrom(["yellow", "red", "blue", "green"])
        })
    }
}

const limits = [
    {x: 0, y: -20 , width: canvas.width, height:20 },
    {x: canvas.width, y: 0 , width: 20, height: canvas.height },
    {x: 0, y: canvas.height, width: canvas.width, height: 20 },
    {x: -20, y: 0, width: 20, height: canvas.height }
]

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        platform.leftKey = true
    }
    else
    if  (event.key === "ArrowRight") {
        platform.rightKey = true
    }
    else if (event.key === "Enter") {
        plaing = true

         Object.assign(ball, {
            x: canvas.width / 2,
            y: canvas.height - 50,
            width: 10,
            height: 10,
            speed: 150,
            angle: Math.PI / 4 + Math.random() * Math.PI / 2
        })
        
        Object.assign(platform, { 
            x: canvas.width /2,
            y: canvas.height - 10,
            width: 100,
            height: 10,
            speed: 250,
            leftKey: false,
            rightKey: false
        })
        
         blocks.splice(0, blocks.length - 1) 
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 10; y++) {
                blocks.push({
                    x: 50 + 50 * x,
                    y: 50 + 20 * y,
                    width: 50,
                    height: 20,
                    color: getRandomFrom(["yellow", "red", "blue", "green"])
                })
            }
        }
    }
 })

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
        platform.leftKey = false
    }
    else
    if  (event.key === "ArrowRight") {
        platform.rightKey = false
    }
 })


requestAnimationFrame (loop)

let pTimestamp = 0
let plaing = true
function loop (timestamp){
    requestAnimationFrame (loop)

    clearCanvas ()

    if (plaing) {

    const dTimestamp = Math.max(16,7, timestamp - pTimestamp)
    const secondPart = dTimestamp / 1000
    pTimestamp = timestamp

    ball.x += secondPart * ball.speed * Math.cos(ball.angle)
    ball.y -= secondPart * ball.speed * Math.sin(ball.angle)

    if (platform.leftKey) {
        platform.x = Math.max(0, platform.x - secondPart * platform.speed)
    }
    else 
    if (platform.rightKey) {
        platform.x = Math.min(canvas.width - platform.width, platform.x + secondPart * platform.speed)
    }

    for (const block of blocks) {
        if (isIntersection(block, ball)){
            toggleItem(blocks, block)

            const ctrl1 = {
                x: block.x - 10,
                y: block.y - 10,
                width: 10 + block.width,
                height: 10
            }

            const ctrl2 = {
                x: block.x + block.width,
                y: block.y - 10,
                width: 10,
                height: 10 + block.height
            }

            const ctrl3 = {
                x: block.x,
                y: block.y + block.height,
                width: block.width + 10,
                height: 10
            }

            const ctrl4 = {
                x: block.x - 10,
                y: block.y,
                width: 10,
                height: block.height + 10
            }

            if (isIntersection(ctrl1, ball) || isIntersection(ctrl3, ball)) {
                ball.angle = Math.PI * 2 - ball.angle
            }
            else 
            
            if (isIntersection(ctrl2, ball) || isIntersection(ctrl4, ball)) {
                const x = ball.x + ball.width / 2 
                const percent = (x - platform.x) / platform.width
                ball.angle = Math.PI - Math.PI * 8 / 10 * percent + 0.05
            }
            break
        }   
    }

    if(isIntersection(limits[0], ball)) {
        ball.angle = Math.PI * 2 - ball.angle
    }

    if(isIntersection(limits[1], ball) || isIntersection(limits[3], ball)) {
        ball.angle = Math.PI - ball.angle
    }

    if(isIntersection(platform, ball)) {
        ball.angle = Math.PI * 2 - ball.angle
    }
    if (isIntersection(limits[2], ball)) {
        plaing = false
    }
}

    drawBall(ball)
        
        for (const block of blocks) {
            drawBlock(block)
        }

        drawPlatform(platform)

        if (!plaing) {
            drawResult()
        }

}

function clearCanvas () {
    context.drawImage(space, 0, 0, canvas.width, canvas.height)
}

// drawRect(ball)
// drawRect(platform)

// for (const block of blocks) {
//     drawRect(block)
// }

function drawRect (param) {
    context.beginPath()
    context.rect (param.x, param.y, param.width, param.height)
    context.strokeStyle = 'red'
    context.stroke()
}
function isIntersection (blockA, blockB) {
    const pointsA = [
        { x: blockA.x, y: blockA.y },
        { x: blockA.x + blockA.width, y: blockA.y },
        { x: blockA.x, y: blockA.y + blockA.height },
        { x: blockA.x + blockA.width, y: blockA.y + blockA.height }
    ]

    for (const pointA of pointsA) {
        if (blockB.x <= pointA.x && pointA.x <= blockB.x + blockB.width && blockB.y <= pointA.y && pointA.y <= blockB.y + blockB.height) {
            return true
        }
    }
    const pointsB = [
        { x: blockB.x, y: blockB.y },
        { x: blockB.x + blockB.width, y: blockB.y },
        { x: blockB.x, y: blockB.y + blockB.height },
        { x: blockB.x + blockB.width, y: blockB.y + blockB.height }
    ]

    for (const pointB of pointsB) {
        if (blockA.x <= pointB.x && pointB.x <= blockA.x + blockA.width && blockA.y <= pointB.y && pointB.y <= blockA.y + blockA.height) {
            return true
        }
    }
    return false
}

function toggleItem (array , item) {
    if (array.includes(item)) {
        const index = array.indexOf(item)
        array.splice(index, 1)
    }
    else {
        array.push(item)
    }
}
// x.95 y.79  size 26 26
function drawBall (ball) {
    context.beginPath()
    context.drawImage(
        image,
        atlas.ball.x, atlas.ball.y, atlas.ball.width, atlas.ball.height,
        ball.x, ball.y, ball.width, ball.height
    )
}

function drawBlock (block) {
    context.drawImage(
        image,
        atlas[block.color].x, atlas[block.color].y, atlas[block.color].width, atlas[block.color].height,
        block.x, block.y, block.width, block.height
    )
}

function drawPlatform (platform) {
    context.drawImage(
        image,
        atlas.platform.x, atlas.platform.y, atlas.platform.width, atlas.platform.height,
        platform.x, platform.y, platform.width, platform.height
    )
}

function getRandomFrom (array) {
    const index = Math.floor (Math.random() * array.length)
    return array[index]
}

function drawResult () {
    context.beginPath()
    context.rect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "rgba(255, 255, 255, 0.5)"
    context.fill ()

    context.fillStyle = "black"
    context.font = "50px Arial"
    context.textAlign = "center"
    context.fillText("Game over ", canvas.width / 2, canvas.height / 2)

    context.fillStyle = "black"
    context.font = "30px Arial"
    context.textAlign = "center"
    context.fillText(" Press Enter to continue ", canvas.width / 2, canvas.height / 2 - 55)
}