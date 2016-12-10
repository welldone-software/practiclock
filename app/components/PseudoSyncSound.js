import Promise from 'es6-promise'
import Sound from 'react-native-sound'

export default class PseudoSyncSound {
    static sounds = {}
    constructor (fileName, finished, LOOPS_COUNT = 1) {
        this.fileName = fileName
        this.finished = finished || function(){}
        this.LOOPS_COUNT = LOOPS_COUNT
    }

    _lazyInit () {
        if ( !this.soundPromise ) {
            this.soundPromise = new Promise(resolve => {
                let cachedSound = PseudoSyncSound.sounds[this.fileName];
                if (cachedSound) {
                    this.sound = cachedSound;
                    resolve(cachedSound)
                } else {
                    this.sound = new Sound(this.fileName, Sound.MAIN_BUNDLE, () => {
                        PseudoSyncSound.sounds[this.fileName] = this.sound;
                        resolve(this.sound)
                    })
                }
            })
            this.soundPromise.then(() => {
                let trackDuration = this.sound.getDuration()
                this.duration = Math.round(this.LOOPS_COUNT * trackDuration * 1000)
            })
        }
        return this.soundPromise
    }

    _getLeftDuration () {
        let alreadyPlaying = Date.now() - this.playStarted
        return Math.max(this.duration - alreadyPlaying, 0)
    }

    _play () {
        if ( this.isPlaying ) {
            if ( !this.playStarted ) {
                this.playStarted = Date.now()
            }
            this.sound.play(() => {
                if ( this._getLeftDuration() ) {
                    this._play()
                } else {
                    this.stop()
                }
            })
        }
    }

    stop () {
        this.isPlaying = false
        this.finished()
        return this.pause().then(() => {
            this.sound.stop();
            // this.sound.release()
            this.soundPromise = null
            this.playStarted = null
        })
    }

    play () {
        this._lazyInit()
        this.isPlaying = true
        return this._lazyInit().then(() => this._play())
    }

    pause () {
        this.isPlaying = false
        return this._lazyInit().then(() => {
            if ( !this.isPlaying ) {
                this.sound.pause()
            }
        })
    }
}