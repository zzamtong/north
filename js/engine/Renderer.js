import { UI_CONFIG } from '../utils/constants.js'

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.pixelRatio = window.devicePixelRatio || 1

        this.setupHighDPI()
    }

    setupHighDPI() {
        const rect = this.canvas.getBoundingClientRect()
        this.canvas.width = rect.width * this.pixelRatio
        this.canvas.height = rect.height * this.pixelRatio
        this.ctx.scale(this.pixelRatio, this.pixelRatio)
    }

    clear(color = '#1a1a2e') {
        const width = this.canvas.width / this.pixelRatio
        const height = this.canvas.height / this.pixelRatio

        this.ctx.fillStyle = color
        this.ctx.fillRect(0, 0, width, height)

        this.drawWarzoneBg(width, height)

        this.drawGameBorder(width, height)
    }

    drawGameBorder(width, height) {
        this.ctx.strokeStyle = '#3a3a3a'
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(0, 0, width, height)
    }

    drawWarzoneBg(width, height) {
        const groundColor1 = '#252525'
        const groundColor2 = '#212121'
        const pixelSize = 10

        for (let x = 0; x < width; x += pixelSize) {
            for (let y = 0; y < height; y += pixelSize) {
                const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
                const rand = seed - Math.floor(seed)
                this.ctx.fillStyle = rand < 0.5 ? groundColor1 : groundColor2
                this.ctx.fillRect(x, y, pixelSize, pixelSize)
            }
        }

        const debrisCount = 15
        for (let i = 0; i < debrisCount; i++) {
            const x = (Math.sin(i * 100) * 0.5 + 0.5) * width
            const y = (Math.cos(i * 150) * 0.5 + 0.5) * height
            const size = 2 + (i % 2)

            this.ctx.fillStyle = '#2d2d2d'
            this.ctx.fillRect(Math.floor(x), Math.floor(y), size, size)
        }

        this.ctx.strokeStyle = '#1a1a1a'
        this.ctx.lineWidth = 1

        const crackCount = 5
        for (let i = 0; i < crackCount; i++) {
            const startX = (i / crackCount) * width
            const startY = (Math.sin(i * 50) * 0.3 + 0.5) * height

            this.ctx.beginPath()
            this.ctx.moveTo(startX, startY)

            const segments = 3 + (i % 3)
            let currentX = startX
            let currentY = startY

            for (let j = 0; j < segments; j++) {
                currentX += (Math.random() - 0.5) * 50
                currentY += (Math.random() - 0.5) * 50
                this.ctx.lineTo(currentX, currentY)
            }

            this.ctx.stroke()
        }
    }

    drawGrid(width, height) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
        this.ctx.lineWidth = 0.5

        const gridSize = 50

        for (let x = 0; x <= width; x += gridSize) {
            this.ctx.beginPath()
            this.ctx.moveTo(x, 0)
            this.ctx.lineTo(x, height)
            this.ctx.stroke()
        }

        for (let y = 0; y <= height; y += gridSize) {
            this.ctx.beginPath()
            this.ctx.moveTo(0, y)
            this.ctx.lineTo(width, y)
            this.ctx.stroke()
        }
    }

    drawCircle(x, y, radius, color, strokeColor = null, lineWidth = 2) {
        this.ctx.fillStyle = color
        this.ctx.beginPath()
        this.ctx.arc(x, y, radius, 0, Math.PI * 2)
        this.ctx.fill()

        if (strokeColor) {
            this.ctx.strokeStyle = strokeColor
            this.ctx.lineWidth = lineWidth
            this.ctx.stroke()
        }
    }

    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, width, height)
    }

    drawImage(image, x, y, width, height, rotation = 0) {
        this.ctx.save()
        this.ctx.translate(x, y)
        if (rotation) {
            this.ctx.rotate(rotation)
        }
        this.ctx.drawImage(image, -width / 2, -height / 2, width, height)
        this.ctx.restore()
    }

    drawArrow(x, y, angle, length, color, startOffset = 0) {
        const headLength = 12
        const headWidth = 10
        const endX = x + Math.cos(angle) * length
        const endY = y + Math.sin(angle) * length

        this.ctx.fillStyle = color

        this.ctx.beginPath()
        this.ctx.moveTo(endX, endY)
        this.ctx.lineTo(
            endX - headLength * Math.cos(angle - Math.PI / 6),
            endY - headLength * Math.sin(angle - Math.PI / 6)
        )
        this.ctx.lineTo(
            endX - headLength * Math.cos(angle + Math.PI / 6),
            endY - headLength * Math.sin(angle + Math.PI / 6)
        )
        this.ctx.closePath()
        this.ctx.fill()
    }

    drawHeart(x, y, size, filled = true) {
        this.ctx.save()
        this.ctx.translate(x, y)

        const topCurveHeight = size * 0.3

        this.ctx.beginPath()
        this.ctx.moveTo(0, topCurveHeight)

        this.ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight)

        this.ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.3, 0, size)

        this.ctx.bezierCurveTo(
            0,
            (size + topCurveHeight) / 1.3,
            size / 2,
            (size + topCurveHeight) / 2,
            size / 2,
            topCurveHeight
        )

        this.ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight)

        this.ctx.closePath()

        if (filled) {
            this.ctx.fillStyle = '#ff6b6b'
            this.ctx.fill()
        } else {
            this.ctx.strokeStyle = '#555'
            this.ctx.lineWidth = 2
            this.ctx.stroke()
        }

        this.ctx.restore()
    }

    drawText(text, x, y, font = '20px Arial', color = '#ffffff', align = 'left') {
        this.ctx.font = font
        this.ctx.fillStyle = color
        this.ctx.textAlign = align
        this.ctx.textBaseline = 'top'
        this.ctx.fillText(text, x, y)
    }

    drawTextWithStroke(text, x, y, font = '20px Arial', color = '#ffffff', strokeColor = '#000000', align = 'left') {
        this.ctx.font = font
        this.ctx.textAlign = align
        this.ctx.textBaseline = 'top'

        this.ctx.strokeStyle = strokeColor
        this.ctx.lineWidth = 3
        this.ctx.strokeText(text, x, y)

        this.ctx.fillStyle = color
        this.ctx.fillText(text, x, y)
    }

    renderUI(health, maxHealth, score) {
        const margin = UI_CONFIG.HEART_MARGIN
        const size = UI_CONFIG.HEART_SIZE
        const spacing = UI_CONFIG.HEART_SPACING

        for (let i = 0; i < maxHealth; i++) {
            const x = margin + i * (size + spacing)
            const y = margin
            this.drawHeart(x, y, size, i < health)
        }

        this.drawTextWithStroke(
            `Score: ${score}`,
            this.canvas.width / this.pixelRatio - margin,
            margin,
            UI_CONFIG.SCORE_FONT,
            UI_CONFIG.SCORE_COLOR,
            '#000000',
            'right'
        )
    }

    renderGameOver(score) {
        const width = this.canvas.width / this.pixelRatio
        const height = this.canvas.height / this.pixelRatio

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        this.ctx.fillRect(0, 0, width, height)

        this.drawTextWithStroke(
            '전투에서 패배하였습니다.',
            width / 2,
            height / 2 - 50,
            'bold 48px Arial',
            '#ff6b6b',
            '#000000',
            'center'
        )

        this.drawTextWithStroke(
            `최종 실적: ${score}`,
            width / 2,
            height / 2 + 10,
            '24px Arial',
            '#ffffff',
            '#000000',
            'center'
        )

        this.drawTextWithStroke(
            '다시 시작하려면 새로고침 하십시오.',
            width / 2,
            height / 2 + 50,
            '18px Arial',
            '#4ecdc4',
            '#000000',
            'center'
        )
    }

    drawParticle(x, y, size, color, alpha = 1) {
        this.ctx.save()
        this.ctx.globalAlpha = alpha
        this.drawCircle(x, y, size, color)
        this.ctx.restore()
    }
}
