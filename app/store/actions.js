export const practices = {
    add: (data) => ({type: '@PRACTICES_ADD', payload: {data}}),
    edit: (id, data) => ({type: '@PRACTICES_EDIT', payload: {id, data}}),
    remove: (id) => ({type: '@PRACTICES_REMOVE', payload: {id}})
}

export const exercises = {
    add: (data) => ({type: '@EXERCISES_ADD', payload: {data}}),
    edit: (id, data) => ({type: '@EXERCISES_EDIT', payload: {id, data}}),
    remove: (id) => ({type: '@EXERCISES_REMOVE', payload: {id}})
}
