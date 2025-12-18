export class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    clone() {
        return new Vector2D(this.x, this.y)
    }

    add(vector) {
        this.x += vector.x
        this.y += vector.y
        return this
    }

    subtract(vector) {
        this.x -= vector.x
        this.y -= vector.y
        return this
    }

    multiply(scalar) {
        this.x *= scalar
        this.y *= scalar
        return this
    }

    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar
            this.y /= scalar
        }
        return this
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    normalize() {
        const mag = this.magnitude()
        if (mag > 0) {
            this.divide(mag)
        }
        return this
    }

    distance(vector) {
        const dx = this.x - vector.x
        const dy = this.y - vector.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    angle() {
        return Math.atan2(this.y, this.x)
    }

    static fromAngle(angle, magnitude = 1) {
        return new Vector2D(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude)
    }

    static angleBetween(from, to) {
        return Math.atan2(to.y - from.y, to.x - from.x)
    }

    static add(v1, v2) {
        return new Vector2D(v1.x + v2.x, v1.y + v2.y)
    }

    static subtract(v1, v2) {
        return new Vector2D(v1.x - v2.x, v1.y - v2.y)
    }

    static distance(v1, v2) {
        return v1.distance(v2)
    }

    static lerp(v1, v2, t) {
        return new Vector2D(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t)
    }
}
