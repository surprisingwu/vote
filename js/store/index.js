var SET_LIST_ITEM = 'SET_LIST_ITEM'
var state = {
    voteItem: {}
}
var mutations = {
    SET_LIST_ITEM: function(state, voteItem){
        state.voteItem = voteItem
    }
}
var getters = {
    voteItem: function(state) {
        return state.voteItem
    }
}

var vuexStore = new Vuex.Store({
    state: state,
    mutations: mutations,
    getters: getters,
})