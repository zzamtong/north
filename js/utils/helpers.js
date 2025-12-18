export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min, max) {
    return Math.random() * (max - min) + min
}

export function degToRad(degrees) {
    return degrees * (Math.PI / 180)
}

export function radToDeg(radians) {
    return radians * (180 / Math.PI)
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

export function circleCollision(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1
    const dy = y2 - y1
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < r1 + r2
}

export function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh
}

export function rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2
}

export function randomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7']
    return colors[randomInt(0, colors.length - 1)]
}

export function randomPosition(margin, maxWidth, maxHeight) {
    return {
        x: randomFloat(margin, maxWidth - margin),
        y: randomFloat(margin, maxHeight - margin),
    }
}
