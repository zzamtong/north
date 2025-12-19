export const GAME_CONFIG = {
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 600,
    FPS: 60,
    BACKGROUND_COLOR: '#1a1a2e',
    DIFFICULTY: 'normal',
}

export const DIFFICULTY_CONFIG = {
    easy: {
        monsterSpawnInterval: 800,
        monsterSpeedMultiplier: 2.5,
        maxMonsters: 20,
    },
    normal: {
        monsterSpawnInterval: 600,
        monsterSpeedMultiplier: 3.5,
        maxMonsters: 25,
    },
    hard: {
        monsterSpawnInterval: 400,
        monsterSpeedMultiplier: 4,
        maxMonsters: 30,
    },
}

export const PLAYER_CONFIG = {
    SIZE: 50,
    SPEED: 4,
    MAX_HEALTH: 3,
    COLOR: '#4a90e2',
    SHOOT_COOLDOWN: 200,
    INVINCIBILITY_TIME: 1000,
}

export const MONSTER_CONFIG = {
    SPAWN_INTERVAL: 2000,
    MIN_SPEED: 1.5,
    MAX_SPEED: 3,
    SIZE: 45,
    MIN_ANGLE_DEVIATION: -30,
    MAX_ANGLE_DEVIATION: 30,
}

export const BULLET_CONFIG = {
    SIZE: 8,
    SPEED: 8,
    COLOR: '#ffeb3b',
    LIFETIME: 3000,
}

export const COIN_CONFIG = {
    SIZE: 50,
    SPAWN_INTERVAL: 5000,
    MAX_COINS: 5,
    POINTS: 10,
    ANIMATION_SPEED: 0.1,
}

export const UI_CONFIG = {
    HEART_SIZE: 25,
    HEART_SPACING: 10,
    HEART_MARGIN: 30,
    SCORE_FONT: '20px Arial',
    SCORE_COLOR: '#ffffff',
    ARROW_LENGTH: 30,
    ARROW_COLOR: '#ff6b6b',
}

export const PHYSICS_CONFIG = {
    FRICTION: 0.95,
    COLLISION_BUFFER: 2,
}
