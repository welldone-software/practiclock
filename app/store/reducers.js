// @flow
import {ActionConst} from 'react-native-router-flux'

export function navigation(state = { scene: {} }, action = {}) {
    switch (action.type) {
        case ActionConst.FOCUS:
            return {
                ...state,
                scene: action.scene,
            }
        // case REHYDRATE:
        //     const incoming = action.payload.navigation
        //     if (incoming) return { ...state, scene: incoming.scene }
        //     return state
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

            return {
                ...state,
                practices
            }
        case '@PRACTICES_REMOVE':
            return {
                ...state,
                practices: state.practices.filter(item => item.id !== payload.id)
            }
        default:
            return state
    }
}

export function sequences(state = { sequences: [] }, action = {}) {
    const {type, payload} = action

    switch (type) {
        case '@SEQUENCES_ADD':
            return {
                ...state,
                sequences: [
                    ...state.sequences, 
                    { 
                        ...payload.data,
                        id: Date.now()
                    }
                ]
            }
        case '@SEQUENCES_EDIT':
            const {id, data} = payload
            const sequences = [...state.sequences]
            const item = sequences.find(item => item.id === id)
            Object.assign(item, data)

            return {
                ...state,
                sequences
            }
        case '@SEQUENCES_REMOVE':
            return {
                ...state,
                sequences: state.sequences.filter(item => item.id !== payload.id)
            }
        default:
            return state
    }
}