import { Vector2D } from '../utils/Vector2D.js'
import { PLAYER_CONFIG } from '../utils/constants.js'

export class Player {
    constructor(x, y) {
        this.position = new Vector2D(x, y)
        this.velocity = new Vector2D(0, 0)
        this.radius = PLAYER_CONFIG.SIZE / 2
        this.size = PLAYER_CONFIG.SIZE
        this.speed = PLAYER_CONFIG.SPEED
        this.health = PLAYER_CONFIG.MAX_HEALTH
        this.maxHealth = PLAYER_CONFIG.MAX_HEALTH
        this.image = null

        this.lastShootTime = 0
        this.shootCooldown = PLAYER_CONFIG.SHOOT_COOLDOWN
        this.aimAngle = 0

        this.isInvincible = false
        this.invincibilityTimer = 0

        this.blinkTimer = 0
    }

    setImage(image) {
        this.image = image
    }

    update(deltaTime, inputManager) {
        this.handleMovement(inputManager)

        const mousePos = inputManager.mousePosition
        if (mousePos) {
            this.aimAngle = Math.atan2(mousePos.y - this.position.y, mousePos.x - this.position.x)
        }

        this.position.add(this.velocity)

        if (this.isInvincible) {
            this.invincibilityTimer -= deltaTime
            this.blinkTimer += deltaTime

            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false
                this.blinkTimer = 0
            }
        }
    }

    handleMovement(inputManager) {
        const direction = new Vector2D(0, 0)

        if (inputManager.keys['w'] || inputManager.keys['arrowup']) {
            direction.y -= 1
        }
        if (inputManager.keys['s'] || inputManager.keys['arrowdown']) {
            direction.y += 1
        }
        if (inputManager.keys['a'] || inputManager.keys['arrowleft']) {
            direction.x -= 1
        }
        if (inputManager.keys['d'] || inputManager.keys['arrowright']) {
            direction.x += 1
        }

        if (direction.magnitude() > 0) {
            direction.normalize()
            this.velocity = direction.multiply(this.speed)
        } else {
            this.velocity.multiply(0.8) 
        }
    }

    canShoot(currentTime) {
        return currentTime - this.lastShootTime >= this.shootCooldown
    }

    shoot(currentTime) {
        if (this.canShoot(currentTime)) {
            this.lastShootTime = currentTime
            return true
        }
        return false
    }

    takeDamage() {
        if (!this.isInvincible && this.health > 0) {
            this.health--
            this.isInvincible = true
            this.invincibilityTimer = PLAYER_CONFIG.INVINCIBILITY_TIME
            return true
        }
        return false
    }

    isAlive() {
        return this.health > 0
    }

    render(renderer) {
        if (this.isInvincible && Math.floor(this.blinkTimer / 100) % 2 === 0) {
            return
        }

        if (this.image && this.image.complete) {
            renderer.drawImage(this.image, this.position.x, this.position.y, this.size, this.size, 0)
        }

        renderer.drawArrow(this.position.x, this.position.y, this.aimAngle, this.radius + 20, '#ff6b6b', this.radius)
    }

    reset(x, y) {
        this.position = new Vector2D(x, y)
        this.velocity = new Vector2D(0, 0)
        this.health = this.maxHealth
        this.isInvincible = false
        this.invincibilityTimer = 0
        this.lastShootTime = 0
    }
}
