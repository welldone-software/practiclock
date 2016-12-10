import Promise from 'es6-promise'
import PseudoSyncSound from './PseudoSyncSound'

export default class M {
    static currentPlaying
    static currentName

    static isCurrentSound(name){
        return M.currentName === name
    }

    static isPlaying(name) {
        return M.isCurrentSound(name) && M.currentPlaying.isPlaying
    }

    /**
     * @name {string} music file name
     * @return promise that include stop of prev file and star new file
     */
    static play(name, cb, repeat) {
        let promise = Promise.resolve()
        if (name && M.currentName !== name) {
            if (M.currentName) {
                promise = M.stop()
            }
            promise = promise.then(()=>{
                M.currentPlaying = new PseudoSyncSound(name, cb, repeat)
                M.currentName = name
            })
        }
        return promise.then(()=> M.currentPlaying.play())
    }

    static stop() {
        return (M.currentPlaying ? M.currentPlaying.stop() : Promise.resolve({})).then(() => {
            M.currentPlaying = null
            M.currentName = null
        })
    }

    static pause() {
        return (M.currentPlaying ? M.currentPlaying.pause() : Promise.resolve({}))
    }
}