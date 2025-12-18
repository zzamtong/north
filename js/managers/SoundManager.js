export class SoundManager {
    constructor() {
        this.sounds = {}
        this.currentMusic = null
        this.musicVolume = 0.3
        this.sfxVolume = 0.5
        this.isMuted = false
    }

    loadSound(key, path, isMusic = false) {
        const audio = new Audio(path)
        audio.preload = 'auto'

        if (isMusic) {
            audio.loop = true
            audio.volume = this.musicVolume
        } else {
            audio.volume = this.sfxVolume
        }

        this.sounds[key] = {
            audio: audio,
            isMusic: isMusic,
            isPlaying: false,
        }

        return audio
    }

    loadSounds(soundMap) {
        for (const [key, config] of Object.entries(soundMap)) {
            this.loadSound(key, config.path, config.isMusic)
        }
    }

    playMusic(key, fadeIn = true) {
        if (this.currentMusic === key) {
            const soundData = this.sounds[key]
            if (soundData && soundData.isPlaying) {
                return
            }
        }

        if (this.currentMusic && this.currentMusic !== key) {
            this.stopMusic(true)
        }

        const soundData = this.sounds[key]
        if (!soundData || !soundData.isMusic) return

        const audio = soundData.audio
        audio.loop = true

        if (!soundData.isPlaying) {
            audio.currentTime = 0
        }

        const playPromise = audio.play()
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    if (fadeIn) {
                        audio.volume = 0
                        this.fadeVolume(audio, this.musicVolume, 1000)
                    } else {
                        audio.volume = this.musicVolume
                    }
                })
                .catch((e) => console.error('[SoundManager] Audio play failed:', e))
        }

        soundData.isPlaying = true
        this.currentMusic = key
    }

    stopMusic(fadeOut = true) {
        if (!this.currentMusic) return

        const soundData = this.sounds[this.currentMusic]
        if (!soundData) return

        const audio = soundData.audio

        if (fadeOut) {
            this.fadeVolume(audio, 0, 500, () => {
                audio.pause()
                audio.currentTime = 0
                soundData.isPlaying = false
            })
        } else {
            audio.pause()
            audio.currentTime = 0
            soundData.isPlaying = false
        }

        this.currentMusic = null
    }

    playSound(key) {
        const soundData = this.sounds[key]
        if (!soundData || soundData.isMusic) return

        const audio = soundData.audio.cloneNode()
        audio.volume = this.sfxVolume
        audio.play().catch((e) => console.warn('Audio play failed:', e))
    }

    fadeVolume(audio, targetVolume, duration, callback) {
        const startVolume = audio.volume
        const volumeChange = targetVolume - startVolume
        const startTime = Date.now()

        const fade = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)

            audio.volume = startVolume + volumeChange * progress

            if (progress < 1) {
                requestAnimationFrame(fade)
            } else if (callback) {
                callback()
            }
        }

        fade()
    }

    stopAll() {
        for (const key in this.sounds) {
            const soundData = this.sounds[key]
            soundData.audio.pause()
            soundData.audio.currentTime = 0
            soundData.isPlaying = false
        }
        this.currentMusic = null
    }

    toggleMute() {
        this.isMuted = !this.isMuted

        for (const key in this.sounds) {
            const soundData = this.sounds[key]
            soundData.audio.muted = this.isMuted
        }

        return this.isMuted
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume))

        for (const key in this.sounds) {
            const soundData = this.sounds[key]
            if (soundData.isMusic) {
                soundData.audio.volume = this.musicVolume
            }
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume))
    }
}
