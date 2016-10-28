

// export const nav = {
//   push: (route, params) => ({type: 'NAV_PUSH', payload: {params, route}}),
//   pop: () => ({type: 'NAV_POP'}),
//   setTab: (tabKey) => ({type: 'NAV_SET_TAB', payload: tabKey})
// }

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
