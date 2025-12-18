import { Vector2D } from '../utils/Vector2D.js'
import { PHYSICS_CONFIG } from '../utils/constants.js'

export class Physics {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
    }

    checkCircleCollision(entity1, entity2) {
        const dx = entity2.position.x - entity1.position.x
        const dy = entity2.position.y - entity1.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDistance = entity1.radius + entity2.radius

        return distance < minDistance
    }

    checkCollisions(entities1, entities2, callback) {
        const collisions = []

        for (let i = 0; i < entities1.length; i++) {
            for (let j = 0; j < entities2.length; j++) {
                if (this.checkCircleCollision(entities1[i], entities2[j])) {
                    collisions.push({ entity1: entities1[i], entity2: entities2[j] })
                    if (callback) {
                        callback(entities1[i], entities2[j])
                    }
                }
            }
        }

        return collisions
    }

    constrainToBounds(entity, padding = 0) {
        const minX = padding + entity.radius
        const maxX = this.gameWidth - padding - entity.radius
        const minY = padding + entity.radius
        const maxY = this.gameHeight - padding - entity.radius

        let hitBoundary = false

        if (entity.position.x < minX) {
            entity.position.x = minX
            entity.velocity.x = 0
            hitBoundary = true
        } else if (entity.position.x > maxX) {
            entity.position.x = maxX
            entity.velocity.x = 0
            hitBoundary = true
        }

        if (entity.position.y < minY) {
            entity.position.y = minY
            entity.velocity.y = 0
            hitBoundary = true
        } else if (entity.position.y > maxY) {
            entity.position.y = maxY
            entity.velocity.y = 0
            hitBoundary = true
        }

        return hitBoundary
    }

    isOutOfBounds(entity, margin = 0) {
        return (
            entity.position.x < -margin ||
            entity.position.x > this.gameWidth + margin ||
            entity.position.y < -margin ||
            entity.position.y > this.gameHeight + margin
        )
    }

    getRandomWallSpawnPosition() {
        const wall = Math.floor(Math.random() * 4)
        let position, targetDirection

        switch (wall) {
            case 0:
                position = new Vector2D(Math.random() * this.gameWidth, -20)
                targetDirection = new Vector2D((Math.random() - 0.5) * 0.8, 1)
                break
            case 1:
                position = new Vector2D(this.gameWidth + 20, Math.random() * this.gameHeight)
                targetDirection = new Vector2D(-1, (Math.random() - 0.5) * 0.8)
                break
            case 2:
                position = new Vector2D(Math.random() * this.gameWidth, this.gameHeight + 20)
                targetDirection = new Vector2D((Math.random() - 0.5) * 0.8, -1)
                break
            case 3:
                position = new Vector2D(-20, Math.random() * this.gameHeight)
                targetDirection = new Vector2D(1, (Math.random() - 0.5) * 0.8)
                break
        }

        return {
            position,
            direction: targetDirection.normalize(),
        }
    }

    applyFriction(velocity, friction = PHYSICS_CONFIG.FRICTION) {
        velocity.multiply(friction)

        if (Math.abs(velocity.x) < 0.01) velocity.x = 0
        if (Math.abs(velocity.y) < 0.01) velocity.y = 0

        return velocity
    }

    getRandomPosition(margin = 50) {
        return new Vector2D(
            margin + Math.random() * (this.gameWidth - margin * 2),
            margin + Math.random() * (this.gameHeight - margin * 2)
        )
    }

    getAngleBetween(from, to) {
        return Math.atan2(to.y - from.y, to.x - from.x)
    }

    reflect(velocity, normal) {
        const dot = velocity.x * normal.x + velocity.y * normal.y
        return new Vector2D(velocity.x - 2 * dot * normal.x, velocity.y - 2 * dot * normal.y)
    }
}
