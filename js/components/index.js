var components = {}
var mixins = {}
mixins.retType = {
    methods: {
        retType: function(type) {
        if (type === 'voting') {
          return 'vote-type-voting'
        }
        return 'vote-type-over'
      }
    }
}

components.Header = {
    template: ' <header class="mui-bar mui-bar-nav vote-header">\
                    <i class="mui-icon mui-icon-back vote-icon-back" @click="handleClick"></i>\
                    <h1 class="mui-title vote-header-title">{{title}}</h1>\
                </header>',
    props: {
        title: {
            type: String,
            default: '投票'
        }
    },
    methods: {
        handleClick: function(){
            this.$emit('goBack')
        }
    }            
}
components.ScrollWrapper = {
    template: '<div class="vote-scroll-wrapper" ref="scrollWrapper">\
        <div><slot></slot></div>     \
    </div>',
    mounted: function(){
        var scrollWrapper = this.$refs.scrollWrapper
        var _self = this
        setTimeout(function(){
            _self.scroll = new BScroll(scrollWrapper,{
                click: true
            })
        },20)
    }
}
components.ListItem = {
    mixins: [mixins.retType],
    template: ' <div class="vote-list-item">\
                    <div class="vote-about-creator">\
                        <img src="img/demo1.jpg" alt="" width="35" height="35" class="vote-avatar" />\
                        <div class="vote-creator-msg">\
                            <h2 class="vote-creator-name">{{item.name}}</h2>\
                             <span class="vote-create-time">{{item.creatTime}}</span>\
                        </div>\
                        <i class="vote-type-common" :class="retType(item.state)"></i>\
                    </div>\
                    <div class="vote-content">\
                        <div class="vote-theme">{{item.title}}</div>\
                    </div>\
                </div>',
    props: {
        item: {
            type: Object,
            default: {}
        }
    },
    created: function(){
        console.log(this.item)
    }            
}
components.PublishVote = {
    template: '<div>我是发布投票</div>'
  }
components.VoteDetail = {
  template: '<div class="vote-wrapper">\
                <vote-header @goBack="routerBack"></vote-header>\
                <scroll-wrapper>\
                    <list-item :item="detailData"></list-item>\
                </scroll-wrapper></div>',
  data: function() {
    return {
      detailData: {}
    }
  },
  created: function() {
    this.detailData = this.$store.state
  },
  mounted: function() {

  },
  methods:{
    routerBack: function(){
        this.$router.back()
    }
  },
  components: {
      VoteHeader: components.Header,
      ListItem: components.ListItem,
      ScrollWrapper: components.ScrollWrapper
  }
}
