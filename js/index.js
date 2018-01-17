summerready = function() {
  var app = new Vue({
    el: '#app',
    router: vueRouter,
    store: vuexStore,
    data: {
      isShowArrow: true,
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
    mounted: function() {
      setTimeout(function() {
        mui.init({
          pullRefresh: {
            container: '#refreshContainer',
            down: {
              height: '50px',
              auto: false,
              height: 60,
              contentdown: '下拉可以刷新',
              contentover: '释放立即刷新',
              contentrefresh: '正在刷新...',
              auto: false,
              callback: function() {
                console.log(1)
                setTimeout(function() {
                  mui('#refreshContainer')
                    .pullRefresh()
                    .endPulldownToRefresh()
                  mui.toast('刷新成功')
                }, 1000)
              }
            },
            up: {
              height: 50,
              auto: false,
              contentrefresh: '正在加载...',
              contentnomore: '没有更多数据了',
              callback: function() {
                setTimeout(function() {
                  // 没有更多数据的时候传true
                  mui('#refreshContainer')
                    .pullRefresh()
                    .endPullupToRefresh(false)
                }, 1000)
              }
            }
          }
        })
      }, 20)
    },
    methods: {
      itemClick: function(item) {
        this.$store.commit(SET_LIST_ITEM,item)
        this.$router.push({path: 'index/vote'})
      }
    },
    components: {
      ListItem: components.ListItem
    }
  })
}
