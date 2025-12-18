import { Vector2D } from '../utils/Vector2D.js'
import { BULLET_CONFIG } from '../utils/constants.js'

export class Bullet {
    constructor(x, y, angle) {
        this.position = new Vector2D(x, y)
        this.velocity = Vector2D.fromAngle(angle, BULLET_CONFIG.SPEED)
        this.radius = BULLET_CONFIG.SIZE / 2
        this.size = BULLET_CONFIG.SIZE
        this.color = BULLET_CONFIG.COLOR
        this.lifetime = BULLET_CONFIG.LIFETIME
        this.age = 0
        this.active = true
    }

    update(deltaTime) {
        this.position.add(this.velocity)
        this.age += deltaTime

        if (this.age >= this.lifetime) {
            this.active = false
        }
    }

    render(renderer) {
        if (!this.active) return

        renderer.drawCircle(this.position.x, this.position.y, this.radius * 2, 'rgba(255, 235, 59, 0.3)')

        renderer.drawCircle(this.position.x, this.position.y, this.radius, this.color, '#fdd835', 1)

        renderer.drawCircle(this.position.x, this.position.y, this.radius * 0.5, '#ffffff')
    }

    deactivate() {
        this.active = false
    }
}
