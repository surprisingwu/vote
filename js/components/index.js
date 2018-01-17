var components = {}
var mixins = {}
var SINGLE_CHOICE = '单选' // 单选
var MULTIPLE_CHOICE = '多选' // 多选
var UNDEFINED_TERM = '不定项' // 不定项
// header组件
components.Header = {
  template:
    ' <header class="mui-bar mui-bar-nav vote-header">\
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
    handleClick: function() {
      this.$emit('goBack')
    }
  }
}

//  scroll组件
components.ScrollWrapper = {
  template:
    '<div class="vote-scroll-wrapper" ref="scrollWrapper">\
        <div><slot></slot></div>     \
    </div>',
  mounted: function() {
    var scrollWrapper = this.$refs.scrollWrapper
    var _self = this
    setTimeout(function() {
      _self.scroll = new BScroll(scrollWrapper, {
        click: true
      })
    }, 20)
  }
}

// 列表每一项
components.ListItem = {
  template:
    ' <div class="vote-list-item">\
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
                        <i class="mui-icon mui-icon-arrowright vote-arrow-right" v-show="isShowArrow"></i>\
                    </div>\
                </div>',
  props: {
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    isShowArrow: {
      type: Boolean,
      default: true
    }
  },
  created: function() {
    console.log(this.item)
  },
  methods: {
    retType: function(type) {
      if (type === 'voting') {
        return 'vote-type-voting'
      }
      return 'vote-type-over'
    }
  }
}
// navTitle 组件
components.NavTitle = {
  template:
    '<div class="vote-nav-title">' +
    '<span class="vote-select-type">{{selectType}}</span>' +
    '<span class="vote-select-endtime">结束时间:{{endTime}}</span>' +
    '</div>',
  props: {
    selectType: {
      type: String,
      default: '单选'
    },
    endTime: {
      type: String,
      default: '2016-08-15 9:00'
    }
  }
}
// selectItem 组件 voteType: textVote||imageVote selectType
components.SelectList = {
  template:
    '<div class="vote-select-wrapper">\
            <ul class="vote-select-list">\
                <li class="vote-select-item border-1px" \
                    @click="goToDetail(item)"\
                    :class="{\'vote-select-styl\':item.isSelected}"\
                     v-for="(item,index) in data.list" :key="index">\
                    <div class="vote-operation-wrapper" @click.stop="selectItemHandler(index)"><span class="vote-operation-btn"></span></div>\
                    <span class="vote-select-content" v-if="data.voteType === \'textVote\'">{{item.text}}</span>\
                    <div class="vote-img-wrapper" else>\
                    <img :src="item.url" class="vote-select-img" width="55" height="55">\
                    <span class="vote-img-text" v-show="item.text">{{item.text}}</span>\
                </div>\
                    <i class="mui-icon mui-icon-arrowright vote-arrow-right"></i>\
                </li>\
            </ul>\
        </div>',
  props: {
    data: {
      type: Object,
      selectItems: [],
      default: function() {
        return {}
      }
    },
    selectType: {
      type: String,
      default: '单选'
    }
  },
  methods: {
    selectItemHandler: function(index) {
        var count = 0,list = this.data.list,isSelected = list[index].isSelected
       if (isSelected) {
        this.data.list[index].isSelected = false
        return
       }
       list.forEach(function(item,index){
           if (item.isSelected) {
               count++
           }
       })
      if(this.selectType === SINGLE_CHOICE) {
          if (count > 1) {
              mui.toast('您只能选一项!')
          }
      }
       this.data.list[index].isSelected  = true
    },
    goToDetail: function(item) {
        this.$router.push({path: 'vote/detail'})
    }
  }
}
components.VoteBtn = {
    template:'<div class="vote-btn-wrapper">\
        <div class="vote-btn" @click.pre.stop="btnClick">投票</div>\
    </div>',
    props: {
        text: {
            type: String,
            default: '投票'
        }
    },
    methods: {
        btnClick: function(){
            this.$emit('voteBtnClick')
        }
    }
}
components.PublishVote = {
  template: '<div>我是发布投票</div>'
}

// 投票
components.VoteDetail = {
  template:
    '<div class="vote-wrapper">\
                <vote-header @goBack="routerBack"></vote-header>\
                <scroll-wrapper>\
                    <list-item :item="getItem" :isShowArrow="isShowArrow"></list-item>\
                    <nav-title :select-type="getNavTitle"></nav-title>\
                    <select-list :data="data" :select-type="selectType"></select-list> \
                    <div class="vote-btn-container">\
                    <vote-btn @voteBtnClick="voteBtnClick"></vote-btn></div>           \
                </scroll-wrapper>\
                <transition name="vote-slide">\
                    <router-view></router-view>\
                </transition>\
                </div>',
  data: function() {
    return {
      detailData: {},
      isShowArrow: false,
      selectType: MULTIPLE_CHOICE, // 单选,多选(至少2个),不定项(至少一个)
      data: {
        voteType: 'imageVote',
        list: [
          { text: '巫运廷', isSelected: false,url: 'img/demo1.jpg'},
          { text: '巫运廷', isSelected: false,url: 'img/demo1.jpg'}
        ]
      }
    }
  },
  created: function() {
    if (!this.$store.getters || this.$store.getters === {}) {
      this.routerBack()
    }
    this.detailData = this.$store.getters.voteItem
  },
  computed: {
    getItem: function() {
      var item = this.isEmptyObject(this.$store.getters.voteItem)
        ? {}
        : this.$store.getters.voteItem
      this.detailData = item
      return item
    },
    getNavTitle: function(){
        return this.selectType === SINGLE_CHOICE?'单选':(this.selectType === MULTIPLE_CHOICE?'多选':'不定项')
    }
  },
  mounted: function() {},
  methods: {
    routerBack: function() {
      this.$router.back()
    },
    isEmptyObject: function(obj) {
      var key
      for (key in obj) {
        return false
      }
      return true
    },
    voteBtnClick: function() {
        console.log('投票逻辑')
    }
  },
  components: {
    VoteHeader: components.Header,
    ListItem: components.ListItem,
    ScrollWrapper: components.ScrollWrapper,
    NavTitle: components.NavTitle,
    SelectList: components.SelectList,
    VoteBtn: components.VoteBtn
  }
}
components.VoteitemDetail = {
    template: '<div class="vote-wrapper">\
    <vote-header @goBack="goBack"></vote-header>\
    <scroll-wrapper>\
        <h2 class="vote-item-title">{{title}}</h2>\
        <p class="vote-item-content">{{content}}</p>\
    </scroll-wrapper>\
    </div>',
    props: {
        title: {
            type: String,
            default: '大中华管理部  巫运廷'
        },
        content: {
            type: String,
            default: '大中华管理部  巫运廷'
        }
    },
    methods: {
        goBack: function(){
            this.$router.back()
        }
    },
    components: {
        VoteHeader: components.Header,
        ScrollWrapper: components.ScrollWrapper,
    }
}