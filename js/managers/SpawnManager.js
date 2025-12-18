import { Bullet } from '../entities/Bullet.js'
import { Monster } from '../entities/Monster.js'
import { Coin } from '../entities/Coin.js'
import { MONSTER_CONFIG, COIN_CONFIG, GAME_CONFIG, DIFFICULTY_CONFIG } from '../utils/constants.js'
import { randomFloat, randomInt } from '../utils/helpers.js'

export class SpawnManager {
    constructor(physics, assetManager) {
        this.physics = physics
        this.assetManager = assetManager

        this.bullets = []
        this.monsters = []
        this.coins = []
        this.particles = []

        this.monsterSpawnTimer = 0
        this.coinSpawnTimer = 0

        this.difficulty = GAME_CONFIG.DIFFICULTY
        this.difficultySettings = DIFFICULTY_CONFIG[this.difficulty]
    }

    setDifficulty(difficulty) {
        if (DIFFICULTY_CONFIG[difficulty]) {
            this.difficulty = difficulty
            this.difficultySettings = DIFFICULTY_CONFIG[difficulty]
        }
    }

    update(deltaTime) {
        this.monsterSpawnTimer += deltaTime
        const spawnInterval = this.difficultySettings.monsterSpawnInterval
        const maxMonsters = this.difficultySettings.maxMonsters

        if (this.monsterSpawnTimer >= spawnInterval && this.monsters.length < maxMonsters) {
            this.spawnMonster()
            this.monsterSpawnTimer = 0
        }

        this.coinSpawnTimer += deltaTime
        if (this.coinSpawnTimer >= COIN_CONFIG.SPAWN_INTERVAL && this.coins.length < COIN_CONFIG.MAX_COINS) {
            this.spawnCoin()
            this.coinSpawnTimer = 0
        }

        this.bullets.forEach((bullet) => bullet.update(deltaTime))
        this.monsters.forEach((monster) => monster.update(deltaTime))
        this.coins.forEach((coin) => coin.update(deltaTime))

        this.updateParticles(deltaTime)

        this.cleanup()
    }

    spawnBullet(x, y, angle) {
        const bullet = new Bullet(x, y, angle)
        this.bullets.push(bullet)
        return bullet
    }

    spawnMonster() {
        const spawnData = this.physics.getRandomWallSpawnPosition()
        const baseSpeed = randomFloat(MONSTER_CONFIG.MIN_SPEED, MONSTER_CONFIG.MAX_SPEED)
        const speed = baseSpeed * this.difficultySettings.monsterSpeedMultiplier
        const imageType = randomInt(1, 3)

        const monster = new Monster(spawnData.position, spawnData.direction, speed, imageType)

        const image = this.assetManager.getImage(`monster${imageType}`)
        if (image) {
            monster.setImage(image)
        }

        this.monsters.push(monster)
        return monster
    }

    spawnCoin() {
        const position = this.physics.getRandomPosition(50)
        const coin = new Coin(position)

        const image = this.assetManager.getImage('coin')
        if (image) {
            coin.setImage(image)
        }

        this.coins.push(coin)
        return coin
    }

    createExplosion(x, y, color = '#ff6b6b', particleCount = 10) {
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount
            const speed = randomFloat(1, 3)
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: randomFloat(2, 5),
                color: color,
                alpha: 1,
                lifetime: randomFloat(300, 600),
                age: 0,
            }
            this.particles.push(particle)
        }
    }

    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i]
            p.x += p.vx
            p.y += p.vy
            p.age += deltaTime
            p.alpha = 1 - p.age / p.lifetime
            p.size *= 0.98

            if (p.age >= p.lifetime || p.size < 0.5) {
                this.particles.splice(i, 1)
            }
        }
    }

    cleanup() {
        this.bullets = this.bullets.filter((bullet) => bullet.active)
        this.monsters = this.monsters.filter((monster) => monster.active)
        this.monsters = this.monsters.filter((monster) => !this.physics.isOutOfBounds(monster, 50))
        this.coins = this.coins.filter((coin) => coin.active)
    }

    render(renderer) {
        this.particles.forEach((particle) => {
            renderer.drawParticle(particle.x, particle.y, particle.size, particle.color, particle.alpha)
        })

        this.coins.forEach((coin) => coin.render(renderer))
        this.monsters.forEach((monster) => monster.render(renderer))
        this.bullets.forEach((bullet) => bullet.render(renderer))
    }

    reset() {
        this.bullets = []
        this.monsters = []
        this.coins = []
        this.particles = []
        this.monsterSpawnTimer = 0
        this.coinSpawnTimer = 0
    }

    getBullets() {
        return this.bullets
    }

    getMonsters() {
        return this.monsters
    }

    getCoins() {
        return this.coins
    }
}
