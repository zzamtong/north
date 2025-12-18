import { Vector2D } from '../utils/Vector2D.js'
import { MONSTER_CONFIG } from '../utils/constants.js'
import { randomFloat } from '../utils/helpers.js'

export class Monster {
    constructor(position, direction, speed, imageType = 1) {
        this.position = position.clone()
        this.velocity = direction.clone().normalize().multiply(speed)
        this.radius = MONSTER_CONFIG.SIZE / 2
        this.size = MONSTER_CONFIG.SIZE
        this.active = true
        this.imageType = imageType // 1, 2, 3
        this.image = null

        this.rotationAngle = 0
        this.rotationSpeed = randomFloat(-0.05, 0.05)

        this.wobbleOffset = 0
        this.wobbleSpeed = randomFloat(0.05, 0.1)
    }

    setImage(image) {
        this.image = image
    }

    update(deltaTime) {
        this.position.add(this.velocity)

        this.rotationAngle += this.rotationSpeed

        this.wobbleOffset += this.wobbleSpeed
    }

    render(renderer) {
        if (!this.active) return

        renderer.drawCircle(this.position.x + 3, this.position.y + 3, this.radius, 'rgba(0, 0, 0, 0.3)')

        if (this.image && this.image.complete) {
            const wobble = Math.sin(this.wobbleOffset) * 2
            renderer.drawImage(
                this.image,
                this.position.x,
                this.position.y + wobble,
                this.size,
                this.size,
                this.rotationAngle
            )
        }
    }

    deactivate() {
        this.active = false
    }

    getExplosionData() {
        return {
            position: this.position.clone(),
            color: '#e74c3c',
            particleCount: 10,
        }
    }
}
