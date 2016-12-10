import Promise from 'es6-promise'
import PseudoSyncSound from './PseudoSyncSound'

export default class M {
    static currentPlaying
    static currentName

    static isCurrentSound(name) {
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
            promise = promise.then(() => {
                M.currentPlaying = new PseudoSyncSound(name, cb, repeat)
                M.currentName = name
            })
        }
        return promise.then(() => M.currentPlaying.play())
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

    static playFiles(id, array, cb) {
        M.playlistId = id
        cb()
        return array
            .map(item => () => new Promise(resolve => {
                return M.isPlaylistPlaying(id) ? M.stop().then(()=>M.play(item.sound.file, resolve, item.repeat)) : Promise.resolve({})
            }))
            .reduce((promise, play) => promise.then(play), Promise.resolve({}))
            .then(() => M.isPlaylistPlaying(id) ? M.playlistId = null : false)
            .then(cb)
    }

    static isPlaylistPlaying(id) {
        return M.playlistId === id
    }
}