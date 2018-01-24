;(function(global, factory) {
    'use strict'
    if (typeof module === 'object' && typeof module.exports === 'object') {
      module.exports = global.document
        ? factory(global, true)
        : function(w) {
            if (!w.document) {
              throw new Error('jQuery requires a window with a document')
            }
            return factory(w)
          }
    } else {
      factory(global)
    }
  })(typeof window !== 'undefined' ? window : this, function(window, noGlobal) {
    var arr = []
    var getProto = Object.getPrototypeOf
    var slice = arr.slice
    var concat = arr.concat
    var push = arr.push
    var indexOf = arr.indexOf
    var class2type = {}
    var toString = class2type.toString
    var hasOwn = class2type.hasOwnProperty
    var fnToString = hasOwn.toString
    var ObjectFunctionString = fnToString.call(Object)
    function _(options) {
      // 初始化的一些属性
      this.isHttps = false
    }
    var class2type = {}
    var toString = Object.prototype.toString
    // 公有方法，存放在原型对象中
    _.prototype = {
      constructor: _
    }
    _.extend = function() {
      var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false
      // 默认false , true深拷贝
      if (typeof target === 'boolean') {
        deep = target
        target = arguments[i] || {}
        i++
      }
      if (typeof target !== 'object' && !this.isFunction(target)) {
        target = {}
      }
      // 是有一个参数时, 挂载到框架上
      if (i === length) {
        target = this
        i--
      }
      for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
          for (name in options) {
            src = target[name]
            copy = options[name]
  
            if (target === copy) {
              continue
            }
  
            if (
              deep &&
              copy &&
              (this.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
            ) {
              if (copyIsArray) {
                copyIsArray = false
                clone = src && Array.isArray(src) ? src : []
              } else {
                clone = src && this.isPlainObject(src) ? src : {}
              }
              target[name] = this.extend(deep, clone, copy)
            } else if (copy !== undefined) {
              target[name] = copy
            }
          }
        }
      }
      return target
    }
    _.extend({
      type: function(obj) {
        if (obj == null) {
          return obj + ''
        }
  
        return typeof obj === 'object' || typeof obj === 'function'
          ? class2type[toString.call(obj)] || 'object'
          : typeof obj
      },
      isFunction: function(obj) {
        return this.type(obj) === 'function'
      },
  
      isWindow: function(obj) {
        return obj != null && obj === obj.window
      },
  
      isNumeric: function(obj) {
        var type = this.type(obj)
        return (
          (type === 'number' || type === 'string') &&
          !isNaN(obj - parseFloat(obj))
        )
      },
      isPlainObject: function(obj) {
        var proto, Ctor
        if (!obj || toString.call(obj) !== '[object Object]') {
          return false
        }
        proto = getProto(obj)
        if (!proto) {
          return true
        }
        Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
        return (
          typeof Ctor === 'function' &&
          fnToString.call(Ctor) === ObjectFunctionString
        )
      },
      isObject: function(obj) {
        return this.type(obj) === 'object'
      },
      isEmptyObject: function(obj) {
        /* eslint-disable no-unused-vars */
        var name
  
        for (name in obj) {
          return false
        }
        return true
      },
  
      isMobile: function() {
        var regexp = /(android|os) (\d{1,}(\.|\_)\d{1,})/
        return regexp.test(this.userAgent())
      },
      isIphone: function() {
        var regexp = /iphone|ipad|ipod/
        return regexp.test(this.userAgent())
      },
      isAndroid: function() {
        var regexp = /android/
        return regexp.test(this.userAgent())
      },
      userAgent: function() {
        return navigator.userAgent.toLowerCase()
      },
      merge: function(first, second) {
        var len = +second.length,
          j = 0,
          i = first.length
  
        for (; j < len; j++) {
          first[i++] = second[j]
        }
  
        first.length = i
  
        return first
      },
      makeArray: function(arr, results) {
        var ret = results || []
  
        if (arr != null) {
          if (isArrayLike(Object(arr))) {
            _.merge(ret, typeof arr === 'string' ? [arr] : arr)
          } else {
            push.call(ret, arr)
          }
        }
  
        return ret
      },
      // 转化成数组
      toArray: function(obj) {
        if (this.isArrayLike(obj)) {
          return slice.call(obj)
        }
      },
      // 遍历可迭代对象(数组,伪数组,set,map)
      each: function(obj, callback) {
        var length,
          i = 0
  
        if (isArrayLike(obj)) {
          length = obj.length
          for (; i < length; i++) {
            if (callback.call(obj[i], obj[i], i) === false) {
              break
            }
          }
        } else {
          for (i in obj) {
            if (callback.call(obj[i], obj[i], i) === false) {
              break
            }
          }
        }
  
        return obj
      },
      /**
       * @param date: 日期对象
       * @param fmt: string  格式化的方式 'yyyy-MM-dd'
       */
      formatDate: function(date, fmt) {
        var o = {
          'M+': date.getMonth() + 1, //月份
          'd+': date.getDate(), //日
          'h+': date.getHours(), //小时
          'm+': date.getMinutes(), //分
          's+': date.getSeconds(), //秒
          'q+': Math.floor((date.getMonth() + 3) / 3), //季度
          S: date.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
          )
        }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ('00' + o[k]).substr(('' + o[k]).length)
            )
          }
        }
        return fmt
      },
      // 存储数据
      setStorage: function(key, value) {
        var saveObj = window.localStorage._saveObj_
        if (!saveObj) {
          saveObj = {}
        } else {
          saveObj = JSON.parse(saveObj)
        }
        saveObj[key] = value
        window.localStorage._saveObj_ = JSON.stringify(saveObj)
      },
      // 获取某一个key, 可以传一个默认值
      getStorage: function(key, def) {
        var saveObj = window.localStorage._saveObj_
        if (!saveObj) {
          return def
        }
        saveObj = JSON.parse(saveObj)
        var ret = saveObj[key]
        return ret || def
      },
      // 从存储中移除某一个key
      removeStorageItem: function(key) {
        var saveObj = window.localStorage._saveObj_
        if (saveObj) {
          saveObj = JSON.parse(saveObj)
          delete saveObj[key]
          window.localStorage._saveObj_ = JSON.stringify(saveObj)
        }
      },
      // 清除所有的存储
      clearStorage: function() {
        window.localStorage.clear()
      },
      // 获取url里面的一些参数
      getQueryByName: function(name) {
        var params = decodeURI(location.search)
        var result = params.match(new RegExp('[?&]' + name + '=([^&]+)', 'i'))
        if (result == null || result.length < 1) {
          return ''
        }
        return result[1]
      },
      // 深拷贝
      deepCopy: function(source, target) {
        var target = target || {}
        for (var i in source) {
          if (typeof source[i] === 'object') {
            target[i] = source[i].constructor === Array ? [] : {}
            deepCopy(source[i], target[i])
          } else {
            target[i] = source[i]
          }
        }
        return target
      },
      num2Chinese: function(digit) {
        digit = typeof digit === 'number' ? String(digit) : digit;
        const zh = [ '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const unit = ['千', '百', '十', ''];
        const quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];

        let breakLen = Math.ceil(digit.length / 4);
        let notBreakSegment = digit.length % 4 || 4;
        let segment;
        let zeroFlag = [], allZeroFlag = [];
        let result = '';

  while (breakLen > 0) {
    if (!result) { // 第一次执行
      segment = digit.slice(0, notBreakSegment);
      let segmentLen = segment.length;
      for (let i = 0; i < segmentLen; i++) {
        if (segment[i] != 0) {
          if (zeroFlag.length > 0) {
            result += '零' + zh[segment[i]] + unit[4 - segmentLen + i];
            // 判断是否需要加上 quot 单位
            if (i === segmentLen - 1 && breakLen > 1) {
              result += quot[breakLen - 2];
            }
            zeroFlag.length = 0;
          } else {
            result += zh[segment[i]] + unit[4 - segmentLen + i];
            if (i === segmentLen - 1 && breakLen > 1) {
              result += quot[breakLen - 2];
            }
          }
        } else {
          // 处理为 0 的情形
          if (segmentLen == 1) {
            result += zh[segment[i]];
            break;
          }
          zeroFlag.push(segment[i]);
          continue;
        }
      }
    } else {
      segment = digit.slice(notBreakSegment, notBreakSegment + 4);
      notBreakSegment += 4;

      for (let j = 0; j < segment.length; j++) {
        if (segment[j] != 0) {
          if (zeroFlag.length > 0) {
            // 第一次执行zeroFlag长度不为0，说明上一个分区最后有0待处理
            if (j === 0) {
              result += quot[breakLen - 1] + zh[segment[j]] + unit[j];
            } else {
              result += '零' + zh[segment[j]] + unit[j];
            }
            zeroFlag.length = 0;
          } else {
            result += zh[segment[j]] + unit[j];
          }
          // 判断是否需要加上 quot 单位
          if (j === segment.length - 1 && breakLen > 1) {
            result += quot[breakLen - 2];
          }
        } else {
          // 第一次执行如果zeroFlag长度不为0, 且上一划分不全为0
          if (j === 0 && zeroFlag.length > 0 && allZeroFlag.length === 0) {
            result += quot[breakLen - 1];
            zeroFlag.length = 0;
            zeroFlag.push(segment[j]);
          } else if (allZeroFlag.length > 0) {
            // 执行到最后
            if (breakLen == 1) {
              result += '';
            } else {
              zeroFlag.length = 0;
            }
          } else {
            zeroFlag.push(segment[j]);
          }

          if (j === segment.length - 1 && zeroFlag.length === 4 && breakLen !== 1) {
            // 如果执行到末尾
            if (breakLen === 1) {
              allZeroFlag.length = 0;
              zeroFlag.length = 0;
              result += quot[breakLen - 1];
            } else {
              allZeroFlag.push(segment[j]);
            }
          }
          continue;
        }
      }
   

    --breakLen;
  }

  return result;
        
      }
    }
    })
    _.each(
      'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(
        ' '
      ),
      function(name, i) {
        class2type['[object ' + name + ']'] = name.toLowerCase()
      }
    )
  
    var _checkObj = function(type) {
      return function(obj) {
        return Object.prototype.toString.call(obj) === '[object ' + type + ']'
      }
    }
    var extend = function(Child, Parent) {
      var F = function() {}
      F.prototype = Parent.prototype
      Child.prototype = new F()
      Child.prototype.constructor = Child
      Child.uber = Parent.prototype
    }
  
    //  是否是一个可迭代的类数组
    function isArrayLike(obj) {
      var length = !!obj && 'length' in obj && obj.length,
        type = _.type(obj)
  
      if (type === 'function' || _.isWindow(obj)) {
        return false
      }
  
      return (
        type === 'array' ||
        length === 0 ||
        (typeof length === 'number' && length > 0 && length - 1 in obj)
      )
    }
    // 确定运行的环境
    var vendor = (function() {
      var elementStyle = document.createElement('div').style
      var transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
      }
  
      for (var key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
          return key
        }
      }
      return false
    })()
    // 返回对应的兼容样式
    _.prefixStyle = function(style) {
      if (vendor === false) {
        return false
      }
      if (vendor === 'standard') {
        if (style === 'transitionEnd') {
          return 'transitionend'
        }
        return style
      }
      return vendor + style.charAt(0).toUpperCase() + style.substr(1)
    }
    // 交互部分
  
    var writeConfig = function(ip, port) {
      summer.writeConfig({
        host: ip,
        port: port
      })
    }
    var ERR_OK = 0
    var callNative = function(options, isAsync) {
      summer.callService('SummerService.gotoNative', options, isAsync)
    }
    var _isAsync = function(options) {
      var isAsync = false
      return options.isAsync ? options.isAsync : isAsync
    }
    _.extend({
      protocol: function() {
        return this.isHttps ? 'https://' : 'http://'
      },
      // 访问ma,需先设置ip和端口,以及ma的controller
      setConfig: function(ip, port, controller) {
        this.ip = ip
        this.port = port
        this.controller = controller
      },
      openHttps: function() {
        this.isHttps = true
      },
      // 用来请求ma的
      getData: function(options, success, err) {
        if (!(this.ip && this.port && this.controller)) {
          throw new Error('请先设置MA的ip、port、和controller！')
        }
        this.appid = this._checkAttribute(options, 'appid', 'test')
        this.action = this._checkAttribute(options, 'action', 'handler')
        if (this.isMobile()) {
          this.callAction(options, success, err)
        } else {
          this._requestAjax(options, success, err)
        }
      },
      // options: {action: "",params:{},sucess: fn,error: fn,timeout: num}
      callAction: function(options, success, error) {
        writeConfig(this.ip, this.port)
        summer.callAction(this._handleParams(options, success, error))
      },
      openAlbum: function(options, success, error) {
        var defaultQuality = 0.85
        if (_.isFunction(options)) {
          error = success
          success = options
          options = {}
        }
        var params = {
          params: {
            transtype: 'openalbum',
            quality: options.quality ? options.quality : defaultQuality
          },
          callback: success,
          error: error
        }
        callNative(params, _isAsync(options))
      },
      openCamara: function(options, success, error) {
        var defaultQuality = 0.85
        if (_.isFunction(options)) {
          error = success
          success = options
          options = {}
        }
        var params = {
          params: {
            transtype: 'takephote',
            quality: options.quality ? options.quality : defaultQuality
          },
          callback: success,
          error: error
        }
        callNative(params, _isAsync(options))
      },
      /**
       * 获取用户信息
       */
      getUserInfo: function(options, success, error) {
        if (_.isFunction(options)) {
          error = success
          success = options
          options = {}
        }
        var params = {
          params: {
            transtype: 'request_token'
          },
          callback: success,
          error: error
        }
        callNative(params, _isAsync(options))
      },
      /**
       * 通过原生调取MA
       */
      callService: function(options, success, error) {
        if (_.isPlainObject(options) && !_.isEmptyObject(options)) {
          var params = {
            params: {
              transtype: 'serviceCall',
              controllerId: options.controller
            },
            callback: success,
            error: error
          }
          if (options.data) {
            params.params.innerParams = settings.data
          }
          callNative(params, _isAsync(options))
        }
      },
      /**
       * 获取当前地理位置
       */
      getCurrentPosition: function(options, success, error) {
        if (_.isFunction(options)) {
          error = success
          success = options
          options = {}
        }
        var params = {
          params: {
            transtype: 'mapaddressinfo'
          },
          callback: success,
          error: error
        }
        callNative(params, _isAsync(options))
      },
      /**
       * @param [* object] 扫描,不需要传参数
       */
      dimension: function(options, success, error) {
        if (_.isFunction(options)) {
          error = success
          success = options
          options = {}
        }
        var params = {
          params: {
            transtype: 'qrcodescan'
          },
          callback: success,
          error: error
        }
        callNative(params, _isAsync(options))
      },
      exitApp: function() {
        var u = navigator.userAgent,
          app = navigator.appVersion
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        if (isAndroid) {
          navigator.app.exitApp()
        }
        if (isIOS) {
          var pamn = {
            params: {
              transtype: 'exit_back'
            }
          }
          summer.callService('SummerService.gotoNative', pamn, false)
        }
      },
      onWatchBackBtn: function(callback) {
        document.addEventListener(
          'deviceready',
          function() {
            document.addEventListener(
              'backbutton',
              function() {
                callback() // 执行回调,
              },
              false
            )
          },
          false
        )
      },
      /**
       * @param [*object] options: {loadurl: string, filetype:'pdf|ppt|xls',filetitle:string,watermark:string}
       */
      openPDF: function(options, success, error) {
        if (_.isFunction(options)) {
          error = success
          success = options
          options = {}
        }
        var params = {
          params: {
            transtype: 'openpdf'
          },
          callback: success,
          error: error
        }
        params.params = _.deepCopy(options, params.params)
        callNative(params, _isAsync(options))
      },
      _checkAttribute: function(obj, key, def) {
        return obj[key] === undefined ? def : obj[key]
      },
      _handleParams: function(options, success, err) {
        // 默认的头部信息
        var header = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'imgfornote'
        }
        var params = {
          appid: this.appid,
          viewid: this._checkAttribute(options, 'controller', this.controller),
          action: this.action,
          params: options.params,
          callback: success,
          error: err,
          header: this._checkAttribute(options, 'header', header)
        }
        return params
      },
      // 谷歌浏览器  属性 目标文件   加上 --args  --disable-web-security --user-data-dir解除谷歌安全策略
      _requestAjax: function(options, success, err) {
        var header = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'imgfornote'
        }
        var tempData = this.setRequestParams(
          this.appid,
          this.action,
          this._checkAttribute(options, 'params', {})
        )
        var data = {
          tip: 'none',
          data: ''
        }
        data.data = JSON.stringify(tempData)
        $.ajax({
          url: this.protocol() + this.ip + ':' + this.port + '/umserver/core',
          data: $.param(data),
          type: 'POST',
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          timeout: this._checkAttribute(options, 'timeout', 10) * 1000,
          dataType: 'json',
          header: this._checkAttribute(options, 'header', header),
          success: function(data) {
            // 数据处理
            success(data.data.resultctx)
          },
          error: function(e) {
            err(e)
          }
        })
      },
      // 监听物理返回键,  传一个回调
      onWatchBackBtn: function(callback) {
        document.addEventListener(
          'deviceready',
          function() {
            document.addEventListener(
              'backbutton',
              function() {
                callback() // 执行回调,
              },
              false
            )
          },
          false
        )
      },
      // 退出H5小应用
      functionback: function() {
        var u = navigator.userAgent,
          app = navigator.appVersion
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        if (isAndroid) {
          navigator.app.exitApp()
        }
        if (isIOS) {
          var pamn = {
            params: {
              transtype: 'exit_back'
            }
          }
          summer.callService('SummerService.gotoNative', pamn, false)
        }
      },
      // options:{transtype: str,innerParams:{},callback:fn,error:fn}
      // transtype: "openalbum" 通过原生打开相册,并返回解压后的base64 (0.85)
      // transtype: "request_token" 通过原生获取用户的信息,ip,port,token,登录的信息和domain
      // transtype: "serviceCall" 通过原生去调ma拿数据
      // transtype: "takephote" 通过原生打开相机,并返回解压后的base64
      callServiceNative: function(params, flag) {
        if (arguments.length === 1) {
          flag = false
        }
        summer.callService('SummerService.gotoNative', params, flag)
      },
      setRequestParams: function(appid, action, params) {
        var params = {
          serviceid: 'umCommonService',
          appcontext: {
            appid: appid,
            tabid: '',
            funcid: '',
            funcode: appid,
            userid: '',
            forelogin: '',
            token: '',
            pass: '',
            sessionid: '',
            devid: 'C3474B8E-888D-4937-BDBA-025D8DAE3AE4',
            groupid: '',
            massotoken: '',
            user: ''
          },
          servicecontext: {
            actionid: 'umCommonService',
            viewid: this.controller,
            contextmapping: {
              result: 'result'
            },
            params: params,
            actionname: action,
            callback: ''
          },
          deviceinfo: {
            firmware: '',
            style: 'ios',
            lang: 'zh-CN',
            imsi: '',
            wfaddress: 'C3474B8E-888D-4937-BDBA-025D8DAE3AE4',
            imei: '',
            appversion: '1',
            uuid: 'C3474B8E-888D-4937-BDBA-025D8DAE3AE4',
            bluetooth: '',
            rom: '',
            resolution: '',
            name: 'kl',
            wifi: '',
            mac: 'C3474B8E-888D-4937-BDBA-025D8DAE3AE4',
            ram: '',
            model: 'iPhone',
            osversion: 'iphone',
            devid: 'C3474B8E-888D-4937-BDBA-025D8DAE3AE4',
            mode: 'kl',
            pushtoken: '',
            categroy: 'iPhone',
            screensize: {
              width: window.screen.width,
              heigth: window.screen.height
            }
          }
        }
        return params
      }
    })
    // 挂载到全局对象上
    window._ = _
    if (!noGlobal) {
      return (window._ = _)
    }
    return _
  })
  