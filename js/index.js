summerready = function() {
  var app = new Vue({
    el: '#app',
    router: vueRouter,
    store: vuexStore,
    data: {
      isShowArrow: true,
      options: {
        click: true
      },
      data: [
        {
          title: '用友金融2015年一季度优秀员工评选',
          avatar: '',
          name: '巫运廷',
          creatTime: '2017-12-31 09:42',
          state: 'voting'
        },
        {
          title: '用友大家庭成员们,动动手指投投票选出重庆最美新娘。',
          avatar: '',
          name: '巫运廷',
          creatTime: '2017-12-31 09:42',
          state: 'over'
        }
      ]
    },
    mounted: function() {},
    methods: {
      itemClick: function(item) {
        if (!event._constructed) {
          return
        }
        debugger
        this.$store.commit(SET_LIST_ITEM,item)
        this.$router.push({path: '/index/vote'})
      },
      goToPublish: function() {
        this.$router.push({path: '/index/publish'})
      }
    },
    components: {
      ListItem: components.ListItem
    }
  })
}
