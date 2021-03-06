/**
 * 我的JS库，嗯~
 */

/**
 *
 * @param selector:可以是object,id,className，tagName,function
 * @param context
 * @returns {A.init}
 * @constructor
 */

function A(selector, context) {
    if (typeof selector === 'function') {
        A(window).on('load', selector);
    } else {
        return new A.fn.init(selector, context);
    }
};
A.fn = A.prototype = {
    constructor: A,
    init: function (selector, context) {
        if (typeof selector === 'object') {
            this[0] = selector;
            this.length = 1;
            return this;
        }
        this.context = context || document;
        if (selector.slice(0, 1) == '#') {
            this[0] = this.context.getElementById(selector.slice(1));
            this.length = 1;
        } else if (selector.slice(0, 1) === '.') {
            var ele_list = this.context.getElementsByClassName(selector.slice(1));
            for (var i = 0; i < ele_list.length; i++) {
                this[i] = ele_list[i];
            }
            this.length = ele_list.length;
        } else {
            var ele_list = this.context.getElementsByTagName(selector);
            for (var i = 0; i < ele_list.length; i++) {
                this[i] = ele_list[i];
            }
            this.length = ele_list.length;
        }
        this.splice = [].splice;
        this.slice = [].slice;
        return this;
    }
}

A.fn.init.prototype = A.fn;
/**
 *
 * extend方法,用于扩展库api
 */
A.extend = A.fn.extend = function () {
    var i = 1,
        len = arguments.length,
        target = arguments[0],
        j;
    if (i === len) {
        target = this;
        i--;
    }
    for (; i < len; i++) {
        for (j in arguments[i]) {
            target[j] = arguments[i][j];
        }
    }
    return target;
}

// 通过extend方法添加on事件
//注意，此处通过惰性模式，在该库加载时就立即执行on函数，重新定义on函数。减去了多个分支，提高性能
// A.fn.extend({on:function(type,fn){
// 	if (document.addEventListener) {
// 		return function(type,fn) {
// 			var len = this.length;
// 			for (var i = 0; i < len; i++) {
// 				this[i].addEventListener(type,fn,false);
// 			}
// 			return this;
// 		}
// 	}else if(document.attachEvent) {
// 		return function(type,fn) {
// 			var len = this.length;
// 			for (var i = 0; i < len; i++) {
// 				this[i].attachEvent('on'+type,fn);
// 			}
// 			return this;
// 		}
// 	}else {
// 		return function(type,fn) {
// 			var len = this.length;
// 			for (var i = 0; i < len; i++) {
// 				this[i]['on'+type] = fn;
// 			}
// 			return this;
// 		}
// 	}
// }()});
// 通过extend方法添加on事件
//注意，此处通过惰性模式，在第一次执行on函数时，重新定义on函数。减去了多个分支，提高性能
// A.fn.extend({on:function(type,fn){
// 	if (document.addEventListener) {
// 		A.fn.on	= function(type,fn) {
// 			var len = this.length;
// 			for (var i = 0; i < len; i++) {
// 				this[i].addEventListener(type,fn,false);
// 			}
// 			return this;
// 		}
// 	}else if(document.attachEvent) {
// 		A.fn.on	=  function(type,fn) {
// 			var len = this.length;
// 			for (var i = 0; i < len; i++) {
// 				this[i].attachEvent('on'+type,fn);
// 			}
// 			return this;
// 		}
// 	}else {
// 		A.fn.on	= function(type,fn) {
// 			var len = this.length;
// 			for (var i = 0; i < len; i++) {
// 				this[i]['on'+type] = fn;
// 			}
// 			return this;
// 		}
// 	}
// 	A.fn.on(type,fn);
// }});
// A.fn.extend({});
// // 通过extend方法添加css方法,改变元素css样式
// A.fn.extend({});

// A.fn.extend({});
// 通过extend方法添加attr方法,改变元素attr
A.fn.extend({
    /**
     *
     * 分别扩展类似于jquery的html(),addClass(),attr(),css()的dom操作
     */
    html: function () {
        var len = this.length;
        var args = arguments;
        if (args.length === 0) {
            return this[0].innerHTML;
        } else if (args.length === 1) {
            if (typeof args[0] === 'string') {
                for (var i = 0; i < len; i++) {
                    this[i].innerHTML = args[0];
                }
                return args[0];
            } else {
                throw Error('参数不是字符串类型！');
            }
        }

    }, addClass: function (className) {
        var len = this.length;
        for (var i = 0; i < len; i++) {
            var classList = this[i].getAttribute('class') ? this[i].getAttribute('class') : '';
            classList += ' ' + className;
            this[i].setAttribute('class', classList);
        }
        return this;
    }, attr: function () {
        var len = this.length;
        var args = arguments;
        if (arguments.length === 2) {
            for (var i = 0; i < len; i++) {
                this[i].setAttribute(args[0], args[1]);
            }
        } else if (arguments.length === 1) {
            if (typeof arguments[0] === 'object') {
                for (var i = 0; i < len; i++) {
                    for (j in args[0]) {
                        this[i].setAttribute(j, args[0][j]);
                    }
                }
            } else if (typeof arguments[0] === 'string') {
                return this[0].getAttribute(arguments[0]);
            }
        }
        return this;

    }, css: function () {
        var len = this.length;
        var args = arguments;
        if (arguments.length === 2) {
            for (var i = 0; i < len; i++) {
                this[i].style[args[0]] = args[1];
            }
        } else if (arguments.length === 1) {
            if (typeof arguments[0] === 'object') {
                for (var i = 0; i < len; i++) {
                    for (j in args[0]) {
                        this[i].style[j] = args[0][j];
                    }
                }
            } else if (typeof arguments[0] === 'string') {
                return this[0].style.getPropertyValue(arguments[0]);
            }
        }
        return this;
    }, on: function (type, fn) {
        /**
         * 通过extend方法添加on事件
         *注意，此处通过惰性模式，在该库加载时就立即执行on函数，重新定义on函数。减去了多个分支，提高性能
         */
        if (document.addEventListener) {
            return function (type, fn) {
                var len = this.length;
                for (var i = 0; i < len; i++) {
                    this[i].addEventListener(type, fn, false);
                }
                return this;
            }
        } else if (document.attachEvent) {
            return function (type, fn) {
                var len = this.length;
                for (var i = 0; i < len; i++) {
                    this[i].attachEvent('on' + type, fn);
                }
                return this;
            }
        } else {
            return function (type, fn) {
                var len = this.length;
                for (var i = 0; i < len; i++) {
                    this[i]['on' + type] = fn;
                }
                return this;
            }
        }
    }()
});

A.extend({
    /**
     * 通过extend方法添加getClientTop方法,获取元素相对浏览器上部高度
     * @param ele:要获取相对浏览器上部高度的dom元素
     * @returns {number}：元素相对浏览器上部高度
     */

    getClientTop: function (ele) {
        var top = 0;
        while (ele !== null) {
            top += ele.offsetTop;
            ele = ele.offsetParent;
        }
        return top;
    }
});

A.extend({
    /**
     * 通过extend方法添加getClientLeft方法
     * 获取元素相对浏览器左侧高度
     * @param ele:要获取相对浏览器左侧高度的dom元素
     * @returns {number}：相对浏览器左侧高度的dom元素
     */
    getClientLeft: function (ele) {
        var Left = 0;
        while (ele !== null) {
            Left += ele.offsetLeft;
            ele = ele.offsetParent;
        }
        return Left;
    }
});


A.extend({
    /**
     * 获取浏览器文档高度和长度
     * @returns {{height: number, width: number}}：height属性为高度，width属性为长度
     */
    getDocumentSize: function () {
        return {
            height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight),
            width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
        }
    }
});

A.extend({
    /**
     * 兼容的事件方法汇总
     */
    EventUtil: {
        /**
         * 解绑事件
         * @param ele:解绑事件的dom元素
         * @param eventName：要解绑的事件，名
         * @param handler：事件处理函数
         */
        removeHandler: function (ele, eventName, handler) {
            if (ele.removeEventListener) {
                ele.removeEventListener(eventName, handler);
            } else if (ele.detachEvent) {
                ele.detachEvent('on' + eventName, handler);
            } else {
                ele['on' + eventName] = null;
            }
        },
        /**
         * 获取事件对象的兼容写法
         * @param event 事件处理函数的e参数（事件对象）
         * @returns {*|Event | undefined} 返回的兼容的事件对象
         */
        getEvent: function (event) {
            return event || window.event;
        },
        /**
         * 获取实践对象的目标元素
         * @param event：事件处理函数的e参数（事件对象）
         * @returns {*|Object|Element}：返回的兼容的目标元素
         */
        getTarget: function (event) {
            return event.target || event.srcElement;
        },
        /**
         * 防止默认事件
         * @param event
         */
        preventDefault: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        /**
         * 防止事件冒泡
         * @param event
         */
        stopPropagation: function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        },
        /**
         * 事件委托
         * @param parentEle:将要注册事件的父元素
         * @param eventName:事件名称
         * @param selector:选择器，可以是className或者tagName
         * @param handler：事件的执行函数
         */
        entrust_on: function (parentEle, eventName, selector, handler) {
            var a = function (ev) {
                var event = ev || window.event;
                var target = event.target || event.srcElement;
                if (selector.charAt(0) != '.' && selector.charAt(0) != '#') {
                    if (target.tagName.toLowerCase() == selector) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                        handler();
                    }
                } else if (selector.charAt(0) == '.') {
                    if (target.className == selector.substring(1)) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                        handler();
                    }
                }
            }
            this.addHandler(parentEle, eventName, a);
        },
    }
});
A.extend({
    /**
     * 整合cookie相关操作
     * name:cookie名
     * value:cookie值
     * number:cookie保存时间
     */
    Cookie: {
        setCookie: function (name, value, iDay) {
            var oDate = new Date();
            oDate.setDate(oDate.getDate() + iDay);
            document.cookie = name + '=' + value + ';expires=' + oDate;
        },
        //获取cookie
        getCookie: function (name) {
            var arr = document.cookie.split('; ');
            for (vari = 0; i < arr.length; i++) {
                var arr2 = arr[i].split('=');
                if (arr2[0] == name) {
                    return arr2[1];
                }
            }
            return '';
        },
        //删除cookie
        removeCookie: function (name) {
            setCookie(name, 1, -1);
        },
    }
});
A.extend({
    /**
     * 数组排序:
     * @param arr:需要改变顺序的数组
     * @param sortMethods:具有两个值:'up'代表升序,'dowm'代表降序
     * @returns :返回新的数组
     */
    newSort: function (arr, sortMethods) {
        switch (sortMethods) {
            case 'up':
                return arr.sort(this.upSort);
                break;
            case 'down':
                return arr.sort(this.downSort);
                break;
            default:
                return arr.sort(this.upSort);
        }
    }
});
A.extend({
    /**
     * 升序比较:
     */
    upSort: function upSort(arg1, arg2) {
        return arg1 > arg2;
    }
});
A.extend({
    /**
     * 降序比较
     */
    downSort: function downSort(arg1, arg2) {
        return arg1 < arg2;
    }
});

A.extend({
    /**
     * 计时：
     * @param deadLine:时间长度
     */
    countUp: function (deadLine) {
        for (var i = 0; i <= deadLine; i++) {
            setTimeout(function (num) {
                return function () {
                    console.log(num);
                }
            }(i), i * 1000);
        }
    }
});
A.extend({
    /**
     * 倒计时：
     * @param deadLine:倒计时时间长度
     */
    countDown: function (deadLine) {
        for (var i = 0; i <= deadLine; i++) {
            (function a(i) {
                setTimeout(function () {
                    console.log(num);
                }, i * 1000);
            })(i);
        }
    }
});
// 递归实现的深拷贝
// newObj:
// 类型:Object
// 定义:新的对象
// initObj：
// 定义：被拷贝的对象
// return:一个新的对象
A.extend({
    /**
     * 深拷贝（递归实现）
     * @param initObj：被拷贝对象
     * @param newObj：拷贝对象（可选）
     * @returns {*|{}}：返回的新的对象
     */
    deepCopy: function (initObj, newObj) {
        var obj = newObj || {};
        for (var i in initObj) {
            var prop = initObj[i];
            if (prop === obj) {
                continue;
            }
            //防止自身调用产生死循环
            if (typeof prop === 'object') {
                if (prop.constructor === Array) {
                    obj[i] = [];
                } else {
                    obj[i] = {};
                }
                arguments.callee(prop, obj[i]);
            } else {
                obj[i] = prop;
            }
        }
        return obj;
    }
});

A.extend({
    /**
     * JSONParse实现的深拷贝
     * @param obj:被拷贝的对象
     * @returns {any}:一个新的对象
     * 注意:constructor始终为Object,只适用于扁平的对象，如Number,Array,String,扁平对象
     */
    deepCopyByJSONParse: function (obj) {
        var newObj = {};
        newObj = JSON.parse(JSON.stringify(obj));
        return newObj;
    }
});
//

A.extend({
    /**
     * 网易rem移动布局
     * 把理想视口设置为布局视口
     *根据设计图宽度动态设置字体大小为100px;
     *设计图中所有的尺寸都除以100得出以rem单位的值
     *字体大小采用媒体查询
     * @param rate:比率，如宽度为750px的页面为750/100 = 7.5
     *
     */
    mobileRemSizingByWangYi: function (rate) {
        var meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        document.head.appendChild(meta);
        document.querySelector("meta[name='viewport']").setAttribute('content', 'width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=0');
        //把理想视口设置为布局视口
        document.documentElement.style.fontSize = document.documentElement.clientWidth / rate + 'px';
        //根据设计图宽度动态设置字体大小为100px;
    }
});


A.extend({
    /**
     * 图片懒加载
     */
    imageLazyLoad: function () {
        var imgList = document.querySelectorAll('body img');
        imgArrayList = Array.prototype.slice.call(imgList, 0);
        var seeHeight = document.documentElement.clientHeight;
        var scrollTop = document.body.scrollTop;
        var nowIndex = 0;
        var itemOffsetTop = 0;
        var that = this;//使用that保存this的指向
        imgArrayList.forEach(function (item, index) {
            if (that.getClientTop(item) < (seeHeight + scrollTop)) {
                item.setAttribute('src', item.getAttribute('data-img-url'));
                nowIndex = index;
            }
        });
        var loadImg = function () {
            scrollTop = document.body.scrollTop;
            imgArrayList.forEach(function (item, index) {
                if (index < nowIndex) {
                    return;
                }
                itemOffsetTop = that.getClientTop(item);
                if (itemOffsetTop < (seeHeight + scrollTop)) {
                    item.setAttribute('src', item.getAttribute('data-img-url'));
                }
            });
        }
        window.onscroll = function () {
            // 使用节流器优化性能
            A.throttle(loadImg);

        }
    }
});

// 节流模式
// throttle接受两个参数
// 第一个参数：要执行的函数
// 第二个参数：一个对象，
// {
// 		context: null,//表示函数的作用域
// 		args: [],//函数的参数
// 		time:300//节流的时间间隔，即多个函数的触发时间间隔小于此时间，则只执行最后一个函数
// }
A.extend({
    /**
     * throttle接受两个参数
     * 第一个参数：要执行的函数
     * 第二个参数：一个对象，
     * {
     *  	context: null,//表示函数的作用域
     * 		args: [],//函数的参数
     * 		time:300//节流的时间间隔，即多个函数的触发时间间隔小于此时间，则只执行最后一个函数
     * }
     */
    throttle: function () {
        var isClear = arguments[0],
            fn;
        if (typeof isClear === 'boolean') {
            fn = arguments[1];
            var clear = fn.throttleId && clearTimeout(fn.throttleId);
        } else {
            fn = isClear;
            param = arguments[1];
            var p = A.extend({
                context: null,
                args: [],
                time: 300
            }, param);
            arguments.callee(true, fn);
            fn.throttleId = setTimeout(function () {
                fn.call(p.context, p.args);
            }, p.time);
        }
    }
});


A.extend({
    /**
     * 装饰者模式 (应用于事件处理)
     * @param dom：注册事件的dom元素
     * @param type：事件类型
     * @param fn：事件处理函数
     */
    decoration: function (dom, type, fn) {
        var originalEvent = dom[type];
        if (typeof dom[type] === 'function') {
            dom[type] = function () {
                originalEvent();
                fn();
            }
        } else {
            dom[type] = fn;
        }
    }
});


A.extend({
    /**
     * 简单模板模式
     * 定义：通过格式化字符串拼凑出视图避免创建视图时大量节点操作
     * 参数：
     * str:模板字符串:如<span>{#span#}</span>
     * data:添加到模板字符串的数据，如{span:'this is the data for label "span" '}
     * @param str
     * @param data
     * @returns {string | * | void}
     */
    formateString: function (str, data) {
        return str.replace(/\{#(\w+)#\}/g, function (match, key) {
            return typeof data[key] === 'undefined' ? '' : data[key]
        });
    }
});
//模板生成器
A.extend({
    view: function () {
        var v = {}
        return {
            // 添加模板
            // 参数：
            // name:模板名称
            // tp:模板字符串{#数据名（必须要跟传入的数据的属性名相对应）#}
            addTp: function (name, tp) {
                v[name] = tp;
            },
            getTp: function (name) {
                if (Object.prototype.toString.call(name) === '[object Array]') {
                    var tpl = '';
                    for (var i = 0, len = name.length; i < len; i++) {
                        tpl += arguments.callee(name[i]);
                    }
                    return tpl;
                } else {
                    return v[name] ? v[name] : ('<' + name + '>{#' + name + '#}</' + name + '>');
                }
            }
        }
    }()
});

A.extend({
    /**
     * 创建元素
     * @param tag:元素标签名
     * @param attrs:创建的元素的属性
     * @returns {HTMLElement}:返回创建的元素
     */
    create: function (tag, attrs) {
        var ele = document.createElement(tag);
        if (typeof attrs === 'object') {
            for (i in attrs) {
                ele.setAttribute(i, attrs[i])
            }
        } else {
            throw new Error('type of attr must be "object"');
        }
        return ele;
    }, toArray: function (html_collection) {
        // html集合转数组
        var arr = [];
        for (var i = 0; i < html_collection.length; i++) {
            arr[i] = html_collection[i];
        }
        return arr;
    },
    /**
     * 使用缓存，把以产生的计算结果缓存下来，方便下次使用。避免在多次调用函数时，重复计算。
     * @param fn:原函数的函数名
     * @param cache:可预先设定的缓存
     * @returns {function(*=): *}
     */
    menoize: function (fn, cache) {
        var menonize_cache = cache || {};
        return function (arr) {
            if (!menonize_cache[arr]) {
                menonize_cache[arr] = fn(arr);
            }
            return menonize_cache[arr];
        }

    }, multiStep: function (steps, args, callback) {
        // 使用定时器处理任务，避免长时间运行脚本导致浏览器假死
        // steps:任务的函数名的数组
        // args：处理函数的参数
        // callback：执行完的回调
        var tasks = steps.concat();
        setTimeout(function () {
            var task = tasks.shift();
            task.apply(null, args);
            if (tasks.length > 0) {
                setTimeout(arguments.callee, 25);
            } else {
                callback();
            }
        }, 25);
    },
    /**
     * URL中查询字符串中的参数
     * @param url
     * @returns {null}:返回的查询字符串名值构成的对象
     */
    getUrlParams: function (url) {
        var url = url || window.location.href;
        if (url.indexOf('?') < 0) return null;
        //拖不存在查询字符串，则返回null
        var paramList = url.split('?')[1].split('&');
        var params = {};
        for (var i = 0, len = paramList.length; i < len; i++) {
            var s = paramList[i].split('=');
            params[s[0]] = s[1];
        }
        return params;
    },
    /**
     * 去重
     * @param arr：希望去重的数组
     * @returns {Array}
     */
    removeRepetition: function (arr) {
        // 去重
        var result = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr.indexOf(arr[i], (i + 1)) < 0) {
                result.push(arr[i]);
            }
        }
        return result;
    },
    /**
     * 插入某个script标签到head标签内
     * @param src：script标签的src
     * @returns {Promise<any>}:返回一个promise
     */
    injectScriptToHeadPromise: function (src) {
        return new Promise(function (resolve, reject) {
            let headEl = document.getElementsByTagName('head')[0];
            let scriptEl = document.createElement('script');
            scriptEl.src = src;
            scriptEl.onload = resolve;
            scriptEl.onerror = reject;
            headEl.appendChild(scriptEl);
        });
    },
    /**
     * 插入某个script标签到body标签尾部
     * @param src：script标签的src
     * @returns {Promise<any>}:返回一个promise
     */
    injectScriptToBodyPromise: function (src) {
        return new Promise(function (resolve, reject) {
            let headEl = document.getElementsByTagName('body')[0];
            let scriptEl = document.createElement('script');
            scriptEl.src = src;
            scriptEl.onload = resolve;
            scriptEl.onerror = reject;
            headEl.appendChild(scriptEl);
        })
        /**
         * 在html的body标签末尾处插入script
         */
    },
});




	