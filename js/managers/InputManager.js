export class InputManager {
    constructor(canvas) {
        this.canvas = canvas
        this.keys = {}
        this.mousePosition = null
        this.mouseDown = false

        this.setupKeyboardListeners()
        this.setupMouseListeners()
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true

            const gameKeys = [' ', 'w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright']
            if (gameKeys.includes(e.key.toLowerCase())) {
                e.preventDefault()
            }
        })

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false
        })
    }

    setupMouseListeners() {
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect()
            this.mousePosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }
        })

        document.addEventListener('mousedown', (e) => {
            this.mouseDown = true
        })

        document.addEventListener('mouseup', (e) => {
            this.mouseDown = false
        })

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault()
            const rect = this.canvas.getBoundingClientRect()
            const touch = e.touches[0]
            this.mousePosition = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            }
        })

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault()
            const rect = this.canvas.getBoundingClientRect()
            const touch = e.touches[0]
            this.mousePosition = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            }
            this.mouseDown = true
        })

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault()
            this.mouseDown = false
        })
    }

    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false
    }

    isShootKeyPressed() {
        return this.keys[' '] || this.mouseDown
    }

    reset() {
        this.keys = {}
        this.mouseDown = false
    }
}
