import { Vector2D } from '../utils/Vector2D.js'
import { COIN_CONFIG } from '../utils/constants.js'

export class Coin {
    constructor(position) {
        this.position = position.clone()
        this.radius = COIN_CONFIG.SIZE / 2
        this.size = COIN_CONFIG.SIZE
        this.active = true
        this.points = COIN_CONFIG.POINTS
        this.image = null

        this.animationTime = 0
    }

    setImage(image) {
        this.image = image
    }

    update(deltaTime) {
        this.animationTime += deltaTime * COIN_CONFIG.ANIMATION_SPEED
    }

    render(renderer) {
        if (!this.active) return

        renderer.drawCircle(this.position.x, this.position.y + 5, this.radius * 0.8, 'rgba(0, 0, 0, 0.2)')

        if (this.image && this.image.complete) {
            renderer.drawImage(this.image, this.position.x, this.position.y, this.size, this.size, 0)
        }
    }

    collect() {
        this.active = false
        return this.points
    }
}
