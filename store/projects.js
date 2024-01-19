// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Projects from '@/static/content/project-list.json'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  projects: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  projects: state => state.projects
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// clearStore
  clearStore ({ commit }) {
    commit('CLEAR_STORE')
  },
  // /////////////////////////////////////////////////////////////// getProjects
  getProjects ({ commit }) {
    const includedProjects = []
    const len = Projects.length
    for (let i = 0; i < len; i++) {
      const project = Projects[i]
      if (project.name && project.description && project.icon && project.taxonomy) {
        const check = []
        if (Array.isArray(project.taxonomy)) {
          project.taxonomy.forEach((item) => {
            if (typeof item === 'object') {
              if (item.category && item.subcategories) {
                if (Array.isArray(item.subcategories)) {
                  check.push(item.subcategories.every(subcat => typeof subcat === 'string'))
                } else {
                  check.push(false)
                }
              } else {
                check.push(false)
              }
            } else {
              check.push(false)
            }
          })
        }
        if (check.length && check.every(Boolean)) {
          // includedProjects.push(this.$setProjectDefaults(project))
          includedProjects.push(project) // TODO: refactor set project defaults to match new data structure
        }
      }
    }
    commit('SET_PROJECTS', includedProjects)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.projects = []
  },
  SET_PROJECTS (state, payload) {
    state.projects = payload
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations
}
