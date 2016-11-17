export const practices = {
    add: (data) => ({type: '@PRACTICES_ADD', payload: {data}}),
    edit: (id, data) => ({type: '@PRACTICES_EDIT', payload: {id, data}}),
    remove: (id) => {
        return (dispatch, getState) => {
            dispatch({
                type: '@PRACTICES_REMOVE',
                payload: {id}
            })

            getState().exercises.exercises.forEach(exercise => {
                const data = Object.keys(exercise.data).map(key => exercise.data[key]).filter(item => {
                    return item.id 
                           ? item.id !== id
                           : true 
                })

                if (data !== exercise.data) {
                    dispatch(exercises.edit(exercise.id, {...exercise, data: Object.assign({}, data)}))
                }
            })
        }
    }
}

export const exercises = {
    add: (data) => ({type: '@EXERCISES_ADD', payload: {data}}),
    edit: (id, data) => ({type: '@EXERCISES_EDIT', payload: {id, data}}),
    remove: (id) => ({type: '@EXERCISES_REMOVE', payload: {id}})
}
