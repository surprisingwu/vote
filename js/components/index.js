var voteComponents = {}
var mixins = {}
var SINGLE_CHOICE = '单选' // 单选
var MULTIPLE_CHOICE = '多选' // 多选
var UNDEFINED_TERM = '不定项' // 不定项
// header组件
voteComponents.Header = {
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
voteComponents.ScrollWrapper = {
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
voteComponents.NetErrImg = {
  template: '<div class="lib-neterror-wrapper">\
           </div>'
}
// 列表每一项
voteComponents.ListItem = {
  template:
    ' <div class="vote-list-item">\
                        <div class="vote-about-creator">\
                            <img :src="data.avarta_url" alt="" width="35" height="35" class="vote-avatar" />\
                            <div class="vote-creator-msg">\
                                <h2 class="vote-creator-name">{{data.name}}</h2>\
                                 <span class="vote-create-time">{{formatTime}}</span>\
                            </div>\
                            <i class="vote-type-common" :class="retType(data.vote_state)"></i>\
                        </div>\
                        <div class="vote-content">\
                            <div class="vote-theme">{{data.theme}}</div>\
                            <i class="mui-icon mui-icon-arrowright vote-arrow-right" v-show="isShowArrow"></i>\
                        </div>\
                    </div>',
  props: {
    data: {
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
  created: function() {},
  computed: {
    formatTime: function() {
      return _.formatDate(
        new Date(Number(this.data.votebegintime)),
        'yyyy-MM-dd'
      )
    }
  },
  methods: {
    retType: function(type) {
      if (type === '1') {
        return 'vote-type-voting'
      }
      return 'vote-type-over'
    }
  }
}
// navTitle 组件
voteComponents.NavTitle = {
  template:
    '<div class="vote-nav-title">' +
    '<span class="vote-select-type">{{selectType}}</span>' +
    '<span class="vote-select-endtime">{{rightText}}</span>' +
    '</div>',
  props: {
    selectType: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    }
  }
}
voteComponents.VoteProgress = {
  template:
    '<div class="vote-progress-bar" ref="progressBar" :class="{nullVote: total==0}"></div>',
  props: {
    current: {
      type: String,
      default: ''
    },
    total: {
      type: String,
      default: ''
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
      if (this.total == 0) {
        return
      }
      var percentage = Number(this.current / this.total)
      return Number((percentage * 100).toFixed(0))
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
voteComponents.SelectList = {
  template:
    '<div class="vote-select-wrapper">\
                <ul class="vote-select-list">\
                    <li class="vote-select-item border-1px" \
                        @click.stop="selectItemHandler(index)"\
                         v-for="(item,index) in data" :key="index" ref="selectLis">\
                        <div class="vote-operation-wrapper"><span class="vote-operation-btn"></span></div>\
                        <span class="vote-select-content" v-if="votetype === \'textVote\'">{{item.option_des  }}</span>\
                        <div class="vote-img-wrapper" v-else>\
                        <img :src="item.pic_url" class="vote-select-img" width="55" height="55">\
                        <span class="vote-img-text" v-show="item.option_des">{{item.option_des}}</span>\
                    </div>\
                    </li>\
                </ul>\
            </div>',
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    selectType: {
      type: String,
      default: '单选'
    },
    votetype: {
      type: String,
      default: ''
    }
  },
  methods: {
    hasClass: function(el, className) {
      var reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
      return reg.test(el.className)
    },
    addClass: function(el, className) {
      if (this.hasClass(el, className)) {
        return
      }
      var newClass = el.className.split(' ')
      newClass.push(className)
      el.className = newClass.join(' ')
    },
    removeClass: function(el, cls) {
       var  newClass = el.className.split(' ')
       var index;
       newClass.forEach(function(item,i){
           if (item.trim()===cls){
               index = i
               return
           }
       })
       newClass.splice(index,1)
       el.className = newClass.join(' ')
    },
    selectItemHandler: function(index) {
      if (!event._constructed) {
        return
      }
      this.listData = this.data.map(function(item, index) {
        if (!item.isSelected) {
          item.isSelected = false
        }
        return item
      })
      var count = 0,
        list = this.listData,
        isSelected = list[index].isSelected,
        selectList = this.$refs.selectLis
        selectedIndex = '',
        cls='vote-select-styl'
      if (isSelected) {
        list[index].isSelected = false
        this.removeClass(selectList[index],cls)
        return
      }
      list.forEach(function(item, index) {
        if (item.isSelected) {
          count++
          selectedIndex = index
        }
      })
      if (this.selectType === SINGLE_CHOICE) {
        if (count >= 1) {
          list[selectedIndex].isSelected = false
          this.removeClass( selectList[selectedIndex],cls)
        }
      }
      list[index].isSelected = true
      this.addClass(selectList[index],cls)
    },
    goToDetail: function(item) {
      if (!event._constructed) {
        return
      }
      // this.$router.push({ path: '/index/vote/detail' })
    }
  }
}
// 投票结果页面
voteComponents.VoteResult = {
  template:
    '<div class="vote-select-wrapper">\
                      <ul class="vote-select-list">\
                      <li class="vote-result-item border-1px" @click="goToDetail(item)"  v-for="(item,index) in data" :key="index">\
                <div class="vote-result-textvote-wrapper" v-if="voteType === \'textVote\'">\
                  <div class="vote-content">\
                    <span class="text">{{item.option_des}}</span>\
                    <div class="vote-progress-wrapper"><vote-progress :current="item.option_voted" :total="total"></vote-progress></div>\
                    </div>\
                  <div class="vote-total">{{item.option_voted}}票</div> \
                  </div>\
                <div class="vote-result-voteimage-wrapper" v-else></div>\
                <i class="vote-arrow-right mui-icon mui-icon-arrowright"></i>\
                </li></ul></div>',
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    voteType: {
      type: String,
      default: ''
    },
    total: {
      type: String,
      default: ''
    }
  },
  created: function() {
    console.log(this.data)
  },
  components: {
    VoteProgress: voteComponents.VoteProgress
  },
  methods: {
    goToDetail: function(item) {
      if (!event._constructed) {
        return
      }
      // this.$router.push({ path: '/index/vote/detail' })
    }
  }
}

// 投票按钮
voteComponents.VoteBtn = {
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

// 投票页签
voteComponents.VoteTab = {
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

// 投票主题
voteComponents.VoteTitleInpt = {
  template:
    '<div class="vote-title-inpt">\
      <textarea :placeHolder="placeText" v-model="title" class="vote-textarea"></textarea>\
      </div>',
  props: {
    placeText: {
      type: String,
      default: '输入投票主题, 2－80字...'
    }
  },
  data: function() {
    return {
      title: ''
    }
  }
}
voteComponents.VoteTimePicker = {
  template:
    '<div class="vote-select-type-picker"><span class="title">{{title}}</span>\
      <input @click="showPicker" v-model="data" readonly :placeholder="placehol"/>\
      <i class="mui-icon mui-icon-arrowright"></i></div>',
  data: function() {
    return {
      data: ''
    }
  },
  props: {
    title: {
      type: String,
      default: '开始时间'
    },
    placehol: {
      type: String,
      default: '请选择开始时间'
    }
  },
  methods: {
    showPicker: function() {
      var that = this
      this.$createTimePicker({
        showNow: true,
        minuteStep: 5,
        delay: 10,
        day: {
          len: 30,
          filter: ['今天', '明天'],
          format: 'M月d日'
        },
        onSelect: function(selectedTime, selectedText) {
          console.log(selectedTime, selectedText)
          that.data = selectedTime
        },
        onCancel: function() {
          console.log('cancel')
        }
      }).show()
    }
  }
}
voteComponents.VoteTypePicker = {
  template:
    '<div class="vote-select-type-picker"><span class="title">投票类型</span>\
      <input @click="showPicker" v-model="data" readonly placeholder="请选择投票类型"/><i class="mui-icon mui-icon-arrowright"></i></div>',
  data: function() {
    return {
      data: ''
    }
  },
  mounted: function() {
    const col1Data = [
      { text: '单选', value: 1 },
      { text: '多选', value: 2 },
      { text: '不定项', value: 0 }
    ]
    var that = this
    this.picker = this.$createPicker({
      title: '请选择投票类型',
      data: [col1Data],
      onSelect: function(selectedVal, selectedIndex, selectedText) {
        console.log(selectedVal)
        that.data = selectedVal.join('')
      },
      onCancel: function() {
        console.log('cancel')
      }
    })
  },
  methods: {
    showPicker: function() {
      this.picker.show()
    }
  }
}
voteComponents.VotePublish = {
  template:
    '<div class="vote-publish-wrapper" v-show="isShow">\
                <div class="img-success-wrapper"></div>\
        </div>',
  data: function() {
    return {
      isShow: false
    }
  },
  methods: {
    show: function() {
      this.isShow = true
    },
    hide: function() {
      this.isShow = false
    }
  }
}

voteComponents.VotePubloading = {
  template:
    '<div class="vote-publish-wrapper" v-show="isShow">\
      <div class="img-loading-wrapper"><img src="img/loading.gif"/></div>\
      </div>',
  data: function() {
    return {
      isShow: false
    }
  },
  methods: {
    show: function() {
      this.isShow = true
    },
    hide: function() {
      this.isShow = false
    }
  }
}
voteComponents.VoteTypeSwitch = {
  template:
    '<div class="vote-select-type-switch"><span class="title">实名投票</span>\
      <div class="vote-switch-wrapper" @click="switchClick"><div class="mui-switch"><div class="mui-switch-handle"></div></div></div></div>',
  data: function() {
    return {
      data: false
    }
  },
  mounted: function() {
    mui('.mui-switch')['switch']()
  },
  methods: {
    switchClick: function() {
      this.data = !this.data
    }
  }
}
voteComponents.VoteAddItem = {
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
    addClick: function() {
      if (!event._constructed) {
        return
      }
      this.$emit('addclick')
    }
  }
}
//<ul class="mui-table-view" ref="inptWrapper">
voteComponents.VoteTextList = {
  template:
    '<div class="vote-text-container margin-top5px">\
                    <transition-group name="vote-list" tag="ul" v-bind:css="false" v-on:before-enter="beforeEnter"\
                    v-on:enter="enter" v-on:leave="leave"> \
                    <li  v-for="(item,i) in data" :key="i" ref="inptItem">\
                    <div class="mui-table-view-cell vote-text-item border-1px">\
                      <div class="mui-slider-right mui-disabled" @click.stop="deleteItem(i)">\
                        <a class="mui-btn mui-btn-red">删除</a>\
                      </div>\
                    <div class="mui-slider-handle vote-txt-content">\
                       <input v-model="item.option_des" class="vote-txt-input" type="text" :placeholder="getPlaceHolder(i)"/>\
                    </div></div>\
                  </li></transition-group><vote-add-item @addclick="addItemClick"></vote-add-item></div>',
  data: function() {
    return {
      data: [{ option_des: '' }]
    }
  },
  methods: {
    beforeEnter: function(el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function(el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function() {
        Velocity(el, { opacity: 1, height: '50px' }, { complete: done })
      }, delay)
    },
    leave: function(el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function() {
        Velocity(el, { opacity: 0, height: 0 }, { complete: done })
      }, delay)
    },
    getPlaceHolder: function(i) {
      i = i + 1
      return '选项' + _.num2Chinese(i) + '，最多30个字符'
    },
    addItemClick: function() {
      var temp = { option_des: '' }
      this.data.push(temp)
    },
    deleteItem: function(i) {
      if (!event._constructed) {
        return
      }
      var lis = this.$refs.inptItem
      // 侧滑的状态要重置,否则列表展示不正常
      mui.swipeoutClose(lis[i])
      this.data.splice(i, 1)
    }
  },
  components: {
    VoteAddItem: voteComponents.VoteAddItem
  }
}
voteComponents.VoteActionsheet = {
  template:
    '<div class="acs-wrapper">' +
    '<transition name="acs-fade"><div class="acs-mask" v-show="showActionsheet" @click="hide"></div></transition>' +
    '<transition name="acs-slide">' +
    '<div class="acs-container" v-show="showActionsheet">' +
    '<div class="acs-operation-wrapper">' +
    '<ul class="acs-list-wrapper">' +
    '<li class="acs-item border-1px" @click.stop="clickHandler(i)" v-for="(item,i) in list" :key="i"><span class="text">{{item}}</span></li>' +
    '</ul>' +
    '</div>' +
    '<div class="acs-cancel-wrapper" @click="hide"><span class="text">{{canceltext}}</span></div>' +
    '</div>' +
    '</transition>' +
    '</div>',
  props: {
    list: {
      type: Array,
      default: function() {
        return ['拍摄', '从相册选择']
      }
    },
    canceltext: {
      type: String,
      default: '取消'
    }
  },
  data: function() {
    return {
      showActionsheet: false
    }
  },
  methods: {
    clickHandler: function(i) {
      this.$emit('clickitem', i)
      this.hide()
    },
    show: function() {
      this.showActionsheet = true
    },
    hide: function() {
      this.showActionsheet = false
    }
  }
}
voteComponents.VoteImgList = {
  template:
    '<div class="vote-text-container">\
        <div class="vote-img-title">选项</div>\
      <transition-group name="vote-list" tag="ul" v-bind:css="false" v-on:before-enter="beforeEnter"\
      v-on:enter="enter" v-on:leave="leave"> \
      <li  v-for="(item,i) in data" :key="i" ref="inptItem">\
      <div class="mui-table-view-cell vote-img-item border-1px">\
        <div class="mui-slider-right mui-disabled" @click.stop="deleteItem(i)">\
          <a class="mui-btn mui-btn-red">删除</a>\
        </div>\
      <div class="mui-slider-handle vote-img-content">\
         <div class="img-wrapper" @click.stop="uploadHandler(i)"><img :src="item.url" class="item-img"/></div>\
         <div class="inpt-wrapper"><input v-model="item.option_des" class="vote-img-inpt" type="text" :placeholder="getPlaceHolder(i)"/></div>\
      </div></div>\
    </li></transition-group><vote-add-item @addclick="addItemClick"></vote-add-item></div>',
  data: function() {
    return {
      data: [{ option_des: '', pic_data: '' }]
    }
  },
  methods: {
    uploadHandler: function(i) {
      this.$emit('uploadimg', i)
    },
    beforeEnter: function(el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function(el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function() {
        Velocity(el, { opacity: 1, height: '85px' }, { complete: done })
      }, delay)
    },
    leave: function(el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function() {
        Velocity(el, { opacity: 0, height: 0 }, { complete: done })
      }, delay)
    },
    getPlaceHolder: function(i) {
      i = i + 1
      return '选项' + _.num2Chinese(i) + '，最多20个字符'
    },
    addItemClick: function() {
      var temp = { option_des: '', pic_data: '' }
      this.data.push(temp)
    },
    deleteItem: function(i) {
      if (!event._constructed) {
        return
      }
      var lis = this.$refs.inptItem
      mui.swipeoutClose(lis[i])
      this.data.splice(i, 1)
    }
  },
  components: {
    VoteAddItem: voteComponents.VoteAddItem
  }
}
voteComponents.PublishVote = {
  template:
    '<div class="vote-wrapper">\
      <vote-header title="发布投票"></vote-header><div class="vote-scroll-wrapper"><cube-scroll :data="data" :options="options">\
      <vote-tab @tabitemclick="tabItemClick" :currentIndex="currentIndex"></vote-tab>\
      <div class="vote-title-wrapper"><vote-title-inpt ref="voteTitle"></vote-title-inpt></div>\
      <vote-text-list v-show="currentIndex === 0" ref="textList"></vote-text-list>\
      <vote-img-list v-show="currentIndex === 1" @uploadimg="uploadImgHandler" ref="imgList"></vote-img-list>\
      <vote-type-picker ref="voteType"></vote-type-picker>\
      <vote-time-picker ref="startTime"></vote-time-picker>\
      <vote-time-picker ref="endTime" title="结束时间" placehol="请选择结束时间"></vote-time-picker>\
      <vote-type-switch ref="voteSwitch"></vote-type-switch>\
      <div class="vote-btn-container"><vote-btn @voteBtnClick="pubBtnClick" v-if="isHaveSubmit" text="发布"></vote-btn></div>         \
      </cube-scroll>\
      <vote-publoading ref="pubLoading"></vote-publoading>\
      <vote-publish ref="pubSuccess"></vote-publish>\
      <vote-actionsheet ref="actionsheet" @clickitem="getImage"> </vote-actionsheet>\
      </div>\
      </div>',
  data: function() {
    return {
      isHaveSubmit: true,
      currentIndex: 0,
      data: [{ test: 1 }],
      options: {
        click: true
      }
    }
  },
  methods: {
    getImage: function(i) {
      if (i === 0) {
        this.openCamara()
      } else {
        this.openAlbum()
      }
    },
    uploadImgHandler: function(i) {
      this.showActionsheet()
      // 这里点击上传图片时, 调取原生后,要设置对应列表的图片的src.这里就要存储对应的索引
      // this.$refs.imgList.data[i].url = "img/demo1.jpg"
    },
    openCamara: function() {
      _.openCamara()
    },
    openAlbum: function() {
      _.openAlbum()
    },
    getImgCallback: function(data) {},
    getImgError: function(err) {},
    showActionsheet: function() {
      this.$refs.actionsheet.show()
    },
    pubBtnClick: function() {
      this.$refs.pubLoading.show()
      this.verify()
    },
    tabItemClick: function(i) {
      this.currentIndex = i
    },
    verify: function() {
      var title = this.$refs.voteTitle.title,
        list = []
      if (!title) {
        mui.alert('请输入您的投票主题 !', '提示', '确认')
        return
      }
      if (this.currentIndex === 0) {
        list = this.$refs.textList.data
      } else {
        list = this.$refs.imgList.data
      }
      var arr = []
      list.forEach(function(item, index) {
        if (item.option_des) {
          arr.push(item)
        }
      })
      if (!arr.length) {
        mui.alert('请输入您的投票选项 !', '提示', '确认')
        return
      }
      var voteType = this.$refs.voteType.data
      if (!voteType) {
        mui.alert('请选择您的投票类型 !', '提示', '确认')
        return
      }

      var startTime = this.$refs.startTime.data
      if (!startTime) {
        mui.alert('请选择投票开始时间 !', '提示', '确认')
        return
      }

      var endTime = this.$refs.endTime.data
      if (!endTime) {
        mui.alert('请选择投票结束时间 !', '提示', '确认')
        return
      }
      var switchVal = this.$refs.voteSwitch.data ? 0 : 1
      var params = {
        transtype: 'releasevote',
        user_id: 'wuyta',
        vote_type: this.currentIndex, // 0||1  文字||图片
        vote_title: title,
        vote_optiontype: voteType,
        vote_begintime: startTime,
        vote_time: endTime,
        vote_real: switchVal,
        vote_option: arr
      }
      this.getData(params)
    },
    getData: function(params) {
      _.getData(
        {
          appid: 'voteonline',
          action: 'handler',
          params: params
        },
        this.callBack,
        this.callErr
      )
    },
    callBack: function(data) {
      // this.isHaveSubmit = false
      this.$refs.pubLoading.hide()
      this.$refs.pubSuccess.show()
      var that = this
      setTimeout(function() {
        that.$refs.pubSuccess.hide()
      }, 500)
    },
    callErr: function(e) {
      this.$refs.pubLoading.hide()
    }
  },
  components: {
    VoteHeader: voteComponents.Header,
    ScrollWrapper: voteComponents.ScrollWrapper,
    VoteTab: voteComponents.VoteTab,
    VoteTitleInpt: voteComponents.VoteTitleInpt,
    VoteTextList: voteComponents.VoteTextList,
    VoteTypePicker: voteComponents.VoteTypePicker,
    VoteTimePicker: voteComponents.VoteTimePicker,
    VoteTypeSwitch: voteComponents.VoteTypeSwitch,
    VoteBtn: voteComponents.VoteBtn,
    VoteImgList: voteComponents.VoteImgList,
    VoteActionsheet: voteComponents.VoteActionsheet,
    VotePubloading: voteComponents.VotePubloading,
    VotePublish: voteComponents.VotePublish
  }
}
// 投票
voteComponents.VoteDetail = {
  template:
    '<div class="vote-wrapper">\
                    <vote-header></vote-header>\
                    <div class="vote-scroll-wrapper">\
                    <cube-scroll :data="data.option_arr" :options="options">\
                        <list-item :data="listItem" :isShowArrow="isShowArrow"></list-item>\
                        <nav-title :select-type="getSelectType" :right-text="navRightText"></nav-title>\
                          <select-list :data="data.option_arr" :votetype="getVoteType" :select-type="getSelectType" v-if="isCanVote"></select-list>\
                           <vote-result v-else :total="data.total_voted"  :data="data.option_arr" :voteType="getVoteType"></vote-result>\
                        <div class="vote-btn-container">\
                        <vote-btn @voteBtnClick="voteBtnClick" v-show="isCanVote&&!clickBtnVote"></vote-btn></div>           \
                        </cube-scroll></div>\
                    <transition name="vote-slide">\
                        <router-view></router-view>\
                    </transition>\
                    </div>',
  data: function() {
    return {
      listItem: {},
      options: {
        click: true
      },
      data: {},
      navRightText: '', // 需要动态改变
      clickBtnVote: false, // 是否点击投票按钮
      isShowArrow: false, // 卡片页是否展示向右的箭头
      hasVoted: true, // false||true  已投票||没投票
      isPubVoteSelf: false, // false||true   不是本人||本人
      isVoting: true // false||true    投票结束||投票中
    }
  },
  created: function() {
    var selectedItem = JSON.parse(_.getStorage('selectedItem'))
    this.listItem = selectedItem
    this.vote_id = selectedItem.vote_id
    this.isVoting = !!selectedItem.vote_state // 0||1  结束||投票中
    this.getData()
  },
  // 是否结束
  // 是否本人 是否已投票 是否匿名
  // 本人的话,不能投票,跳到结果页面   还要跟据是否匿名来查看投票者
  // 不是本人话    是否已投票
  computed: {
    getSelectType: function() {
      if (!this.data.have_voted) {
        return
      }
      debugger
      var arr = ['不定项', '单选', '多选']
      return arr[this.data.type[0].vote_optiontype]
    },
    isCanVote: function() {
      // 还没拿到数据
      if (!this.data.have_voted) {
        return
      }
      //  投票结束 或者是本人或者是已投过
      if (!this.isVoting || this.isPubVoteSelf || this.hasVoted) {
        return false
      }
      return true
    },
    getVoteType: function() {
      if (!this.data.have_voted) {
        return
      }
      var arr = ['textVote', 'imgVote']
      var type = this.data.type[0] // 0||1  文字||图片
      return arr[type.vote_type]
    }
  },
  methods: {
    getData: function() {
      _.getData(
        {
          appid: 'voteonline',
          action: 'handler',
          params: {
            transtype: 'getvoteinfo',
            user_id: 'wuyta',
            vote_id: this.vote_id,
            vote_state: Number(this.isVoting)
          }
        },
        this.callback,
        this.callErr
      )
    },
    callback: function(data) {
      data = data.result.data
      if (!data) {
        mui.alert('返回的数据为空 !')
      }
      this.data = data
      this.hasVoted = data.have_voted == 1
      //   this.isPubVoteSelf = data.have_own == 0

      //  测试
      this.isPubVoteSelf = data.have_own == 1

      // nav 右边的文本
      this.getNavRight()
    },
    callErr: function(e) {
      mui.alert('网络异常,请稍候重试!')
    },
    getNavRight: function() {
      var voteState = this.isCanVote // 0||1  结束||投票中
      var text = ''
      var endTime = parseInt(this.data.type[0].vote_time)
      if (!voteState) {
        this.navRightText = '共' + this.data.total_voted + '票'
      } else {
        text = _.formatDate(new Date(endTime), 'yyyy-MM-dd hh:ss')
        this.navRightText = text
        this.navRightText = '结束时间: ' + text
      }
    },
    voteBtnClick: function() {
      // 点击投票 隐藏投票按钮  切换到投票结果
      if (!event._constructed) {
        return
      }
      this.isHaveSubmit = false
      this.navRightText = '共' + this.sumitData.total + '票'
      this.isSubmit = true
    }
  },
  components: {
    VoteHeader: voteComponents.Header,
    ListItem: voteComponents.ListItem,
    ScrollWrapper: voteComponents.ScrollWrapper,
    NavTitle: voteComponents.NavTitle,
    SelectList: voteComponents.SelectList,
    VoteBtn: voteComponents.VoteBtn,
    VoteResult: voteComponents.VoteResult
  }
}
