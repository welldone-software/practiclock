// @flow
import {ActionConst} from 'react-native-router-flux'

export function navigation(state = { scene: {} }, action = {}) {
    switch (action.type) {
        case ActionConst.FOCUS:
            return {
                ...state,
                scene: action.scene,
            }
        default:
            return state
    }
}

export function practices(state = { practices: [] }, action = {}) {
    const {type, payload} = action

    switch (type) {
        case '@PRACTICES_ADD':
            return {
                ...state,
                practices: [
                    ...state.practices,
                    {
                        ...payload.data,
                        id: Date.now()
                    }
                ]
            }
        case '@PRACTICES_EDIT':
            const {id, data} = payload
            const practices = [...state.practices]
            const item = practices.find(item => item.id === id)
            Object.assign(item, data)
            delete item.isPlaying
            delete item.onPlay

            return {
                ...state,
                practices
            }
        case '@PRACTICES_REMOVE':
            return {
                ...state,
                practices: state.practices.filter(item => item.id !== payload.id).map(item => {
                    delete item.isPlaying
                    delete item.onPlay
                    return item
                })
            }
        case '@PRACTICES_ORDER':
            return {
                ...state,
                practices: payload.data
            }
        default:
            return state
    }
}

export function exercises(state = { exercises: [] }, action = {}) {
    const {type, payload} = action

    switch (type) {
        case '@EXERCISES_ADD':
            return {
                ...state,
                exercises: [
                    ...state.exercises,
                    {
                        ...payload.data,
                        id: Date.now()
                    }
                ]
            }
        case '@EXERCISES_EDIT':
            const {id, data} = payload
            const exercises = [...state.exercises]
            const item = exercises.find(item => item.id === id)
            Object.assign(item, data)

            return {
                ...state,
                exercises
            }
        case '@EXERCISES_REMOVE':
            return {
                ...state,
                exercises: state.exercises.filter(item => item.id !== payload.id)
            }
        case '@EXERCISES_ORDER':
            return {
                ...state,
                exercises: payload.data
            }
        default:
            return state
    }
}
