export class AssetManager {
    constructor() {
        this.images = {}
        this.sounds = {}
        this.loadingPromises = []
    }

    loadImage(key, path) {
        const promise = new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                this.images[key] = img
                resolve(img)
            }
            img.onerror = () => {
                console.warn(`Failed to load image: ${path}`)
                resolve(null)
            }
            img.src = path
        })

        this.loadingPromises.push(promise)
        return promise
    }

    loadImages(imageMap) {
        for (const [key, path] of Object.entries(imageMap)) {
            this.loadImage(key, path)
        }
    }

    loadSound(key, path) {
        const promise = new Promise((resolve, reject) => {
            const audio = new Audio()
            audio.preload = 'auto'

            audio.oncanplaythrough = () => {
                this.sounds[key] = audio
                resolve(audio)
            }

            audio.onerror = () => {
                console.warn(`Failed to load sound: ${path}`)
                resolve(null)
            }

            audio.src = path
        })

        this.loadingPromises.push(promise)
        return promise
    }

    loadSounds(soundMap) {
        for (const [key, path] of Object.entries(soundMap)) {
            this.loadSound(key, path)
        }
    }

    async loadAll() {
        try {
            await Promise.all(this.loadingPromises)
            console.log('All assets loaded successfully')
            return true
        } catch (error) {
            console.error('Error loading assets:', error)
            return false
        }
    }

    getImage(key) {
        return this.images[key] || null
    }

    getSound(key) {
        return this.sounds[key] || null
    }

    getLoadingProgress() {
        const total = this.loadingPromises.length
        const loaded = Object.keys(this.images).length + Object.keys(this.sounds).length
        return total > 0 ? loaded / total : 1
    }
}
