import { Game } from './engine/Game.js'
import { GAME_CONFIG } from './utils/constants.js'

class GameApp {
    constructor() {
        this.canvas = null
        this.game = null
        this.loadingScreen = null
        this.disclaimerScreen = null
        this.menuScreen = null
        this.screenSizeWarning = null
        this.isGameStarted = false
        this.audioInitialized = false
        this.minWidth = 900
        this.minHeight = 900
    }

    async init() {
        this.screenSizeWarning = document.getElementById('screenSizeWarning')
        this.loadingScreen = document.getElementById('loading')
        this.disclaimerScreen = document.getElementById('disclaimerScreen')
        this.menuScreen = document.getElementById('menuScreen')

        if (!this.checkScreenSize()) {
            this.showScreenSizeWarning()
            this.setupResizeListener()
            return
        }

        this.showLoading()

        this.canvas = document.getElementById('gameCanvas')
        this.setupCanvas()

        this.game = new Game(this.canvas)

        await this.game.loadAssets()

        this.hideLoading()
        this.showDisclaimer()

        this.setupEventListeners()

        console.log('Game initialized successfully!')
    }

    setupCanvas() {
        const container = document.querySelector('.game-container')
        const rect = container.getBoundingClientRect()

        this.canvas.style.width = `${GAME_CONFIG.CANVAS_WIDTH}px`
        this.canvas.style.height = `${GAME_CONFIG.CANVAS_HEIGHT}px`
    }

    setupEventListeners() {
        const disclaimerBtn = document.getElementById('disclaimerBtn')
        if (disclaimerBtn) {
            disclaimerBtn.addEventListener('click', () => {
                if (this.game && this.game.soundManager) {
                    this.game.soundManager.playSound('button_click')
                }
                this.hideDisclaimer()
                this.showMenu()
            })
        }

        const easyBtn = document.getElementById('easyBtn')
        const normalBtn = document.getElementById('normalBtn')
        const hardBtn = document.getElementById('hardBtn')

        if (easyBtn) {
            easyBtn.addEventListener('click', () => {
                if (this.game && this.game.soundManager) {
                    this.game.soundManager.playSound('button_click')
                }
                this.setDifficulty('easy')
                this.updateDifficultyButtons('easy')
            })
        }

        if (normalBtn) {
            normalBtn.addEventListener('click', () => {
                if (this.game && this.game.soundManager) {
                    this.game.soundManager.playSound('button_click')
                }
                this.setDifficulty('normal')
                this.updateDifficultyButtons('normal')
            })
        }

        if (hardBtn) {
            hardBtn.addEventListener('click', () => {
                if (this.game && this.game.soundManager) {
                    this.game.soundManager.playSound('button_click')
                }
                this.setDifficulty('hard')
                this.updateDifficultyButtons('hard')
            })
        }

        const startBtn = document.getElementById('startBtn')
        const muteBtn = document.getElementById('muteBtn')

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.game && this.game.soundManager) {
                    this.game.soundManager.playSound('button_click')
                }
                this.startGame()
            })
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', () => {                if (this.game && this.game.soundManager) {
                    this.game.soundManager.playSound('button_click')
                }                const isMuted = this.game.soundManager.toggleMute()
                muteBtn.textContent = isMuted ? '사운드 끔' : '사운드 켬'
            })
        }

        window.addEventListener('resize', () => {
            if (this.game) {
                this.game.handleResize()
            }
        })

        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'p' && this.game && this.isGameStarted) {
                this.game.pause()
            }
        })

        this.canvas.addEventListener('click', () => {
            this.canvas.focus()
        })

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.game && this.isGameStarted && !this.game.isPaused) {
                this.game.pause()
            }
        })
    }

    startGame() {
        if (!this.isGameStarted) {
            this.hideMenu()
            this.game.start()
            this.isGameStarted = true
        }
    }

    setDifficulty(difficulty) {
        if (this.game) {
            this.game.setDifficulty(difficulty)
        }
    }

    updateDifficultyButtons(difficulty) {
        const buttons = document.querySelectorAll('.difficulty-btn')
        buttons.forEach((btn) => {
            btn.classList.remove('active')
        })

        const activeBtn = document.getElementById(`${difficulty}Btn`)
        if (activeBtn) {
            activeBtn.classList.add('active')
        }
    }

    showMenu() {
        if (this.menuScreen) {
            this.menuScreen.classList.remove('hidden')
            if (this.game && this.game.soundManager && !this.audioInitialized) {
                this.game.soundManager.playMusic('menu')
                this.audioInitialized = true
            }
        }
    }

    hideMenu() {
        if (this.menuScreen) {
            this.menuScreen.classList.add('hidden')
        }
    }

    showDisclaimer() {
        if (this.disclaimerScreen) {
            this.disclaimerScreen.classList.remove('hidden')
        }
    }

    hideDisclaimer() {
        if (this.disclaimerScreen) {
            this.disclaimerScreen.classList.add('hidden')
        }
    }

    showLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex'
        }
    }

    hideLoading() {
        if (this.loadingScreen) {
            setTimeout(() => {
                this.loadingScreen.style.opacity = '0'
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none'
                }, 300)
            }, 500)
        }
    }
    checkScreenSize() {
        return window.innerWidth >= this.minWidth && window.innerHeight >= this.minHeight
    }

    showScreenSizeWarning() {
        if (this.screenSizeWarning) {
            this.screenSizeWarning.classList.remove('hidden')
            const resolutionEl = document.getElementById('currentResolution')
            if (resolutionEl) {
                resolutionEl.textContent = `${window.innerWidth}x${window.innerHeight}px`
            }
        }
    }

    hideScreenSizeWarning() {
        if (this.screenSizeWarning) {
            this.screenSizeWarning.classList.add('hidden')
        }
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            const resolutionEl = document.getElementById('currentResolution')
            if (resolutionEl) {
                resolutionEl.textContent = `${window.innerWidth}x${window.innerHeight}px`
            }

            if (this.checkScreenSize() && !this.isGameStarted) {
                this.hideScreenSizeWarning()
                this.init()
            }
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new GameApp()
    app.init().catch((error) => {
        console.error('Failed to initialize game:', error)
        alert('게임을 로드하는 중 오류가 발생했습니다.')
    })
})
