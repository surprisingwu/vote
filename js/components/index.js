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
      this.$router.back()
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
    '<span class="vote-select-endtime">{{rightText}}</span>' +
    '</div>',
  props: {
    selectType: {
      type: String,
      default: '单选'
    },
    rightText: {
      type: String,
      default: '结束时间: 2016-08-15 9:00'
    }
  }
}
components.VoteProgress = {
  template: '<div class="vote-progress-bar" ref="progressBar"></div>',
  props: {
    percentage: {
      type: Number,
      default: 1
    }
  },
  mounted: function() {
    var _self = this
    setTimeout(function() {
      _self.renderWidth()
    }, 20)
  },
  computed: {
    getValue: function() {
      return Number((this.percentage * 100).toFixed(0))
    }
  },
  methods: {
    renderWidth: function() {
      var progressBar = this.$refs.progressBar
      progressBar.style.width = this.getValue + '%'
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
                    <div class="vote-img-wrapper" v-else>\
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
      if (!event._constructed) {
        return
      }
      var count = 0,
        list = this.data.list,
        isSelected = list[index].isSelected
      if (isSelected) {
        this.data.list[index].isSelected = false
        return
      }
      list.forEach(function(item, index) {
        if (item.isSelected) {
          count++
        }
      })
      if (this.selectType === SINGLE_CHOICE) {
        if (count > 1) {
          mui.toast('您只能选一项!')
        }
        return
      }
      this.data.list[index].isSelected = true
    },
    goToDetail: function(item) {
      if (!event._constructed) {
        return
      }
      this.$router.push({ path: '/index/vote/detail' })
    }
  }
}
components.VoteResult = {
  template:
    '<div class="vote-select-wrapper">\
                  <ul class="vote-select-list">\
                  <li class="vote-result-item border-1px" @click="goToDetail(item)"  v-for="(item,index) in data.list" :key="index">\
            <div class="vote-result-textvote-wrapper" v-if="data.voteType === \'textVote\'">\
              <div class="vote-content">\
                <span class="text">{{item.text}}</span>\
                <div class="vote-progress-wrapper"><vote-progress :percentage="item.ticket/data.total"></vote-progress></div>\
                </div>\
              <div class="vote-total">{{item.ticket}}票</div> \
              </div>\
            <div class="vote-result-voteimage-wrapper" v-else></div>\
            <i class="mui-icon mui-icon-arrowright vote-arrow-right"></i></li></ul></div>',
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  components: {
    VoteProgress: components.VoteProgress
  },
  methods: {
    goToDetail: function(item) {
      if (!event._constructed) {
        return
      }
      this.$router.push({ path: '/index/vote/detail' })
    }
  }
}
components.VoteBtn = {
  template:
    '<div class="vote-btn-wrapper">\
        <div class="vote-btn" @click.pre.stop="btnClick">投票</div>\
    </div>',
  props: {
    text: {
      type: String,
      default: '投票'
    }
  },
  methods: {
    btnClick: function() {
      if (!event._constructed) {
        return
      }
      this.$emit('voteBtnClick')
    }
  }
}
components.VoteTab = {
  template:
    '<div class="vote-tab-container"><ul class="vote-tab-list border-1px">\
  <li class="vote-tab-item" v-for="(item,index) in text" @click="itemClick(index)">\
  <span class="text" :class="{\'vote-tab-active\': index===currentIndex}">{{item}}</span>\
  </li></ul></div>',
  props: {
    text: {
      type: Array,
      default: function() {
        return ['文字投票', '图片投票']
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    itemClick: function(i) {
      this.$emit('tabitemclick', i)
    }
  }
}
components.VoteTitleInpt = {
  template:
    '<div class="vote-title-inpt">\
  <textarea :placeHolder="placeText" v-model="value" class="vote-textarea"></textarea>\
  </div>',
  props: {
    placeText: {
      type: String,
      default: '输入投票主题, 2－80字...'
    }
  },
  data: function() {
    return {
      value: ''
    }
  }
}
components.VoteAddItem = {
  template:
    '<div class="vote-add-container" @click="addClick">\
              <i class="vote-add-backg mui-icon mui-icon-plusempty"></i><span class="text">{{text}}</span>\
            </div>',
  props: {
    text: {
      type: String,
      default: '添加一个选项'
    }
  },
  methods: {
    addClick: function(){
      if (!event._constructed) {
        return
      }
      this.$emit('addclick')
    }
  }
}
components.VoteTextList = {
  template:
    '<div class="vote-text-container"><ul class="mui-table-view">\
                <li class="mui-table-view-cell vote-text-item border-1px" v-for="(item,i) in data" :key="i">\
                  <div class="mui-slider-right mui-disabled" @click.stop="deleteItem(i)">\
                    <a class="mui-btn mui-btn-red">删除</a>\
                  </div>\
                <div class="mui-slider-handle vote-txt-content">\
                   <input v-model="item.val" class="vote-txt-input" type="text" :placeholder="getPlaceHolder(i)"/>\
                </div>\
              </li></ul><vote-add-item @addclick="addItemClick"></vote-add-item></div>',
  data: function() {
    return {
      data: [
        {val: ''}
      ]
    }
  },
  methods: {
    getPlaceHolder: function(i){
      return '选项'+_.num2Chinese(i)+',最多30个字符'
    },
    addItemClick: function(){
      var temp = {val: ''}
      this.data.push(temp)
    },
    deleteItem: function(i){
      if (!event._constructed) {
        return
      }
      this.data.splice(i,1)
    }
  },
  components: {
    VoteAddItem: components.VoteAddItem
  }
}
components.PublishVote = {
  template:
    '<div class="vote-wrapper">\
  <vote-header title="发布投票"></vote-header><div class="vote-scroll-wrapper"><cube-scroll :data="data" :options="options">\
  <vote-tab @tabitemclick="tabItemClick" :currentIndex="currentIndex"></vote-tab>\
  <div class="vote-title-wrapper"><vote-title-inpt></vote-title-inpt></div>\
  <vote-text-list></vote-text-list>\
  </cube-scroll></div>\
  </div>',
  data: function() {
    return {
      currentIndex: 0,
      options: {
        click: true
      }
    }
  },
  methods: {
    tabItemClick: function(i) {
      this.currentIndex = i
    }
  },
  components: {
    VoteHeader: components.Header,
    ScrollWrapper: components.ScrollWrapper,
    VoteTab: components.VoteTab,
    VoteTitleInpt: components.VoteTitleInpt,
    VoteTextList: components.VoteTextList
  }
}

// 投票
components.VoteDetail = {
  template:
    '<div class="vote-wrapper">\
                <vote-header></vote-header>\
                <div class="vote-scroll-wrapper">\
                <cube-scroll :data="data" :options="options">\
                    <list-item :item="getItem" :isShowArrow="isShowArrow"></list-item>\
                    <nav-title :select-type="getNavTitle" :right-text="navRightText"></nav-title>\
                     <select-list :data="data" :select-type="selectType" v-if="!isSubmit"></select-list> \
                    <vote-result v-else  :data="sumitData"></vote-result>\
                    <div class="vote-btn-container">\
                    <vote-btn @voteBtnClick="voteBtnClick" v-if="isHaveSubmit"></vote-btn></div>           \
                    </cube-scroll></div>\
                <transition name="vote-slide">\
                    <router-view></router-view>\
                </transition>\
                </div>',
  data: function() {
    return {
      isHaveSubmit: true,
      options: {
        click: true
      },
      detailData: {},
      isShowArrow: false,
      selectType: MULTIPLE_CHOICE, // 单选,多选(至少2个),不定项(至少一个)
      isSubmit: false,
      navRightText: '结束时间: 2016-08-15 9:00', // 投票后,改变
      data: {
        voteType: 'textVote',
        list: [
          { text: '我是特别厉害的,你们怕不怕', isSelected: false },
          { text: '2017年,是一个跨越比较大的一年', isSelected: false }
        ]
      },
      // data: {
      //   voteType: 'imageVote',
      //   isAnonymity: 'true', // 是否匿名(匿名看不到投票的详情)
      //   list: [
      //     { text: '巫运廷', isSelected: false, url: 'img/demo1.jpg' },
      //     { text: '巫运廷', isSelected: false, url: 'img/demo1.jpg' }
      //   ]
      // },
      sumitData: {
        total: 54,
        voteType: 'textVote',
        list: [
          { text: '我是特别厉害的,你们怕不怕', ticket: 30 },
          { text: '2017年,是一个跨越比较大的一年', ticket: 24 }
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
    getNavTitle: function() {
      return this.selectType === SINGLE_CHOICE
        ? '单选'
        : this.selectType === MULTIPLE_CHOICE ? '多选' : '不定项'
    }
  },
  mounted: function() {},
  methods: {
    isEmptyObject: function(obj) {
      var key
      for (key in obj) {
        return false
      }
      return true
    },
    voteBtnClick: function() {
      if (!event._constructed) {
        return
      }
      this.isHaveSubmit = false
      this.navRightText = '共' + this.sumitData.total + '票'
      this.isSubmit = true
    }
  },
  components: {
    VoteHeader: components.Header,
    ListItem: components.ListItem,
    ScrollWrapper: components.ScrollWrapper,
    NavTitle: components.NavTitle,
    SelectList: components.SelectList,
    VoteBtn: components.VoteBtn,
    VoteResult: components.VoteResult
  }
}
components.VoteitemDetail = {
  template:
    '<div class="vote-wrapper">\
    <vote-header></vote-header>\
    <div class="vote-scroll-wrapper">\
    <cube-scroll :data="content" :options="options">\
        <div class="vote-detail-wrapper">\
          <h2 class="title">{{title}}</h2>\
          <p class="content" v-html="content"></p>\
        </div>  \
        </cube-scroll></div>\
    </div>',
    data: function(){
      return {
        options: {
          click: true
        }
      }
    },
  props: {
    title: {
      type: String,
      default: '大中华管理部  巫运廷'
    },
    content: {
      type: String,
      default:
        ' 本年度完成项目技术巡检8个，主要包含国开证券、华能贵诚、华鑫信托、东方基金等，处理客户提交的问题累计883个，\
      完成增值服务项目4个，主要有渤海信托、山西信托、建信租赁等，服务费累计汇款50w左右，协助部门其他同事完成3个项目的新需求实施。<br/>\
      渤海信托项目在老系统架构不同的情况下，2个周的时间内完成2010至2015年度29家分支机构历史账套累计10万条分录数据迁移工作；\
      积累了在多组织，多期间，不同数据库，不同财务系统将历史数据迁移至NC57财务系统的最佳实践。<br/>\
      做客户可信赖的合作伙伴，国庆期间建信项目客户需上报建行总行新要求的报表数据，跟我们部门林瑞福一起协助客户完成9月份总行接口数据上报工作。'
    }
  },
  methods: {},
  components: {
    VoteHeader: components.Header,
    ScrollWrapper: components.ScrollWrapper
  }
}
