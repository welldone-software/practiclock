export const practices = {
    add: (data) => ({type: '@PRACTICES_ADD', payload: {data}}),
    edit: (id, data) => ({type: '@PRACTICES_EDIT', payload: {id, data}}),
    remove: (id) => ({type: '@PRACTICES_REMOVE', payload: {id}})
}

export const sequences = {
    add: (data) => ({type: '@SEQUENCES_ADD', payload: {data}}),
    edit: (id, data) => ({type: '@@SEQUENCES_EDIT', payload: {id, data}}),
    remove: (id) => ({type: '@@SEQUENCES_REMOVE', payload: {id}})
}
