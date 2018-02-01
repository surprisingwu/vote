summerready = function() {
  var app = new Vue({
    el: '#app',
    router: vueRouter,
    data: {
      isError: false,
      isShowArrow: true,
      pageIndex: 1,
      options: {
        click: true,
        pullUpLoad: {
          threshold: 0,
          txt: {
            more: '',
            noMore: ''
          }
        }
      },
      data: []
    },
    created: function(){
     this.getData()
    },
    mounted: function() {},
    methods: {
      openRequestAgain: function(){},
      onPullingUp: function(){
        this.$refs.scroll.forceUpdate(false)
      },
      getData: function(){
        _.setConfig(
          '10.4.121.30',
          '8130',
          'com.ifbpmob.jrpt.controller.VoteController'
        )
        _.getData({
          appid: 'voteonline',
          action: 'handler',
          params: {
            transtype: "getvote",
            user_id: "wuyta",
            pageindex: 1
          }
        },this.callback,this.callErr
      )
      },
      callback: function(data) {
        data = data.result.data
        this.data = data
      },
      callErr: function(err){
        this.isError = true
        mui.alert("网络异常,请稍候重试!")
      },
      itemClick: function(item) {
        if (!event._constructed) {
          return
        }
        _.setStorage('selectedItem',JSON.stringify(item))
        this.$router.push({path: '/vote'})
      },
      goToPublish: function() {
        this.$router.push({path: '/publish'})
      }
    },
    components: {
      ListItem: voteComponents.ListItem,
      NetErrImg: voteComponents.NetErrImg
    }
  })
}
