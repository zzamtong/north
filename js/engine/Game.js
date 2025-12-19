import { Player } from '../entities/Player.js'
import { Physics } from './Physics.js'
import { Renderer } from './Renderer.js'
import { InputManager } from '../managers/InputManager.js'
import { AssetManager } from '../managers/AssetManager.js'
import { SpawnManager } from '../managers/SpawnManager.js'
import { SoundManager } from '../managers/SoundManager.js'
import { GAME_CONFIG } from '../utils/constants.js'

export class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.isRunning = false
        this.isPaused = false
        this.gameOver = false
        this.score = 0

        this.lastTime = 0
        this.deltaTime = 0
        this.fps = GAME_CONFIG.FPS
        this.frameInterval = 1000 / this.fps
        this.fpsTimer = 0
        this.frameCount = 0
        this.currentFps = 0

        this.initSystems()
    }

    initSystems() {
        this.renderer = new Renderer(this.canvas)

        this.physics = new Physics(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT)

        this.inputManager = new InputManager(this.canvas)

        this.assetManager = new AssetManager()

        this.soundManager = new SoundManager()

        this.spawnManager = new SpawnManager(this.physics, this.assetManager)

        this.player = new Player(GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2)
    }

    async loadAssets() {
        this.assetManager.loadImages({
            player: './assets/images/player.png',
            monster1: './assets/images/monster1.png',
            monster2: './assets/images/monster2.png',
            monster3: './assets/images/monster3.png',
            coin: './assets/images/coin.png',
        })

        this.soundManager.loadSounds({
            menu: { path: './assets/sounds/background_menu.mp3', isMusic: true },
            main: { path: './assets/sounds/background_main.mp3', isMusic: true },
            gameover: { path: './assets/sounds/background_gameover.mp3', isMusic: true },
            button_click: { path: './assets/sounds/effect_button_click.mp3', isMusic: false },
            hit: { path: './assets/sounds/effect_hit.mp3', isMusic: false },
            shot: { path: './assets/sounds/effect_shot.mp3', isMusic: false },
            death: { path: './assets/sounds/effect_death.mp3', isMusic: false },
            coin: { path: './assets/sounds/effect_coin.mp3', isMusic: false },
        })

        await this.assetManager.loadAll()

        const playerImage = this.assetManager.getImage('player')
        if (playerImage) {
            this.player.setImage(playerImage)
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true
            this.lastTime = performance.now()

            this.soundManager.playMusic('main')

            this.gameLoop()
        }
    }

    setDifficulty(difficulty) {
        if (this.spawnManager) {
            this.spawnManager.setDifficulty(difficulty)
        }
    }

    stop() {
        this.isRunning = false
    }

    pause() {
        this.isPaused = !this.isPaused
    }

    reset() {
        const wasGameOver = this.gameOver
        this.gameOver = false
        this.score = 0

        this.player.reset(GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2)

        this.spawnManager.reset()

        this.inputManager.reset()

        if (wasGameOver) {
            this.soundManager.playMusic('main')
        }
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return

        this.deltaTime = currentTime - this.lastTime
        this.lastTime = currentTime

        this.fpsTimer += this.deltaTime
        this.frameCount++
        if (this.fpsTimer >= 1000) {
            this.currentFps = this.frameCount
            this.frameCount = 0
            this.fpsTimer = 0
        }

        if (!this.isPaused && !this.gameOver) {
            this.update(this.deltaTime)
        }
        this.render()

        requestAnimationFrame((time) => this.gameLoop(time))
    }

    update(deltaTime) {
        this.player.update(deltaTime, this.inputManager)

        this.physics.constrainToBounds(this.player)

        if (this.inputManager.isShootKeyPressed()) {
            if (this.player.shoot(performance.now())) {
                this.soundManager.playSound('shot')
                this.spawnManager.spawnBullet(this.player.position.x, this.player.position.y, this.player.aimAngle)
            }
        }

        this.spawnManager.update(deltaTime)

        this.checkCollisions()

        if (!this.player.isAlive()) {
            if (!this.gameOver) {
                this.gameOver = true
                this.soundManager.playMusic('gameover')
            }
        }

        if (this.inputManager.isKeyPressed('r') && this.gameOver) {
            this.reset()
        }
    }

    checkCollisions() {
        const monsters = this.spawnManager.getMonsters()
        for (let i = monsters.length - 1; i >= 0; i--) {
            const monster = monsters[i]
            if (this.physics.checkCircleCollision(this.player, monster)) {
                if (this.player.takeDamage()) {
                    this.soundManager.playSound('hit')
                    monster.deactivate()
                    this.spawnManager.createExplosion(monster.position.x, monster.position.y, '#e74c3c', 8)
                }
            }
        }

        const bullets = this.spawnManager.getBullets()
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i]
            for (let j = monsters.length - 1; j >= 0; j--) {
                const monster = monsters[j]
                if (this.physics.checkCircleCollision(bullet, monster)) {
                    bullet.deactivate()
                    monster.deactivate()
                    this.score += 5

                    this.soundManager.playSound('death')
                    this.spawnManager.createExplosion(monster.position.x, monster.position.y, '#ff6b6b', 12)
                    break
                }
            }
        }

        const coins = this.spawnManager.getCoins()
        for (let i = coins.length - 1; i >= 0; i--) {
            const coin = coins[i]
            if (this.physics.checkCircleCollision(this.player, coin)) {
                this.score += coin.collect()

                this.soundManager.playSound('coin')
                this.spawnManager.createExplosion(coin.position.x, coin.position.y, '#ffd700', 8)
            }
        }
    }

    render() {
        this.renderer.clear(GAME_CONFIG.BACKGROUND_COLOR)

        this.renderer.drawGrid(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT)

        this.spawnManager.render(this.renderer)
        this.player.render(this.renderer)

        this.renderer.renderUI(this.player.health, this.player.maxHealth, this.score)

        if (this.gameOver) {
            this.renderer.renderGameOver(this.score)
        }

        if (this.isPaused && !this.gameOver) {
            this.renderer.drawTextWithStroke(
                'PAUSED',
                GAME_CONFIG.CANVAS_WIDTH / 2,
                GAME_CONFIG.CANVAS_HEIGHT / 2,
                'bold 48px Arial',
                '#4ecdc4',
                '#000000',
                'center'
            )
        }

        this.renderer.drawText(
            `FPS: ${this.currentFps}`,
            10,
            GAME_CONFIG.CANVAS_HEIGHT - 30,
            '14px monospace',
            '#4ecdc4'
        )
    }

    handleResize() {
        this.renderer.setupHighDPI()
    }
}
