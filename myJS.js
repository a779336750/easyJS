// 我的JS库：
var myJS = {
// 数组排序:
// arr:
// 	类型:Array
// 	定义:需要改变顺序的数组
// sortMethods:
// 	类型:String
// 	定义:具有两个值:'up'代表升序,'dowm'代表降序
	mySort:function mySort(arr,sortMethods) {
		switch(sortMethods) {
			case 'up':return arr.sort(this.upSort);
			break;
			case 'down':return arr.sort(this.downSort);
			break;
			default:return arr.sort(this.upSort);
		}
	},
	upSort:function upSort(arg1,arg2) {
		return  arg1>arg2;
	},
	downSort:function downSort(arg1,arg2) {
		return  arg1<arg2;
	},
	// 跨浏览器的事件处理函数
	EventUtil:{
				addHandler: function (ele,eventName,handler) {
					if (ele.addEventListener) {
						ele.addEventListener(eventName,handler,false);
					}else if (ele.attachEvent){
						ele.attachEvent('on'+eventName,handler);
					}else {
						ele['on'+eventName] = handler;
					}

				},
				removeHandler: function (ele,eventName,handler) {
					if (ele.removeEventListener) {
						ele.removeEventListener(eventName,handler);
					}else if (ele.detachEvent){
						ele.detachEvent('on'+eventName,handler);
					}else {
						ele['on'+eventName] = null;
					}
				},
				getEvent: function (event) {
					return event||window.event;
				},
				getTarget: function (event) {
					return event.target||event.srcElement;
				},
				preventDefault: function(event) {
					if (event.preventDefault) {
						event.preventDefault();
					}else {
						event.returnValue = false;
					}
				},
				stopPropagation:function (event) {
					if (event.stopPropagation) {
						event.stopPropagation();
					}else {
						event.cancelBubble = true;
					}
				}
	},

	// 计时：
	// deadLine:
	// 类型:number
	// 定义:倒计时间长度
	countUp:function countUp(deadLine) {
			for (var i = 0; i <= deadLine; i++) {
					setTimeout(function(num){
							return function() {
								console.log(num);
							}
					}(i),i*1000);
			}
	},
	// 倒计时：
	countDown:function countDown(deadLine) {
			for (var i = 0; i <= deadLine; i++) {
					(function a(i) {
						setTimeout(function() {
							console.log(num);
						},i*1000);
					})(i);
					// setTimeout(function(num){
					// 		return function() {
					// 			console.log(num);
					// 		}
					// }(i),i*1000);
			}
	},
	// 事件委托
	// eventName:
	// 类型:String
	// 定义:事件名字
	// parentEle:
	// 类型:nodeType
	// 定义:将要注册事件的父元素
	// selector:
	// 类型:String
	// 定义:选择器，可以是className或者tagName
	// handler:
	// 类型:function
	// 定义:事件的执行函数
	on:function (parentEle,eventName,selector,handler) {
		var a=function (ev) {
			var event = ev||window.event;
			var target = event.target||event.srcElement;
			if (selector.charAt(0)!='.'&&selector.indexOf(0)!='#') {
				if (target.tagName.toLowerCase() == selector) {
					if (event.preventDefault) {
						event.preventDefault();
					}else {
						event.returnValue = false;
					}
					handler();
				}
			}else if(selector.charAt(0)=='.') {
				if (target.className == selector.substring(1)) {
					if (event.preventDefault) {
						event.preventDefault();
					}else {
						event.returnValue = false;
					}
					handler();
				}
			}
		}
		this.EventUtil.addHandler(parentEle,eventName,a);
	},
	// 递归实现的深拷贝
	deepCopy:function (initObj,newObj) {
			var obj = newObj||{};
			for(var i in initObj) {
				var prop = initObj[i];
				if (prop === obj) {
					continue;
				}//防止自身调用产生死循环
				if (typeof initObj[i] === 'object') {
					if (initObj[i].constructor === Array) {
						obj[i] = [];
					}else {
						obj[i] = {};
					}
					arguments.callee(initObj[i],obj[i]);
				}else {
					obj[i] = initObj[i];
				}
			}
			return obj;
	},
	// JSONParse实现的深拷贝
	// obj:
	// 类型:Object
	// 定义:被拷贝的对象
	// return:一个新的对象
	//注意： constructor始终为Object,只适用于扁平的对象，如Number,Array,String,扁平对象
	deepCopyByJSONParse:function(obj) {
			var newObj = {};
			newObj = JSON.parse(JSON.stringify(obj));
			return newObj;
	},

	// 获取浏览器文档高度和长度
	// 返回：一个对象，height属性为高度，width属性为长度
	getDocumentSize: function() {
			return {
				height: Math.max(document.documentElement.scrollHeight,document.documentElement.clientHeight),
				width: Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth),
			}
	},

	// cookie:
	// name:
	// 类型:string
	// 定义:cookie名
	// value:
	// 类型:value
	// 定义:cookie值
	// iDay:
	// 类型:number
	// 定义:cookie保存时间
	setCookie:function(name,value,iDay){
	    var oDate=new Date();
	    oDate.setDate(oDate.getDate()+iDay);
	    document.cookie=name+'='+value+';expires='+oDate;
	},
	//获取cookie
	getCookie:function(name){
		var arr=document.cookie.split('; ');    
		for(vari=0;i<arr.length;i++){    
			var arr2=arr[i].split('=');        
			if(arr2[0]==name){            
			return arr2[1];
			}
		}
		return '';
	},
	//删除cookie
	removeCookie:function(name){
	    setCookie(name,1,-1);
	},
	//网易rem移动布局
	// 把理想视口设置为布局视口
	// 根据设计图宽度动态设置字体大小为100px;
	// 设计图中所有的尺寸都除以100得出以rem单位的值
	// 字体大小采用媒体查询
	mobileRemSizingByWangYi:function() {
		document.querySelector("meta[name='viewport']").setAttribute('content','width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=0');
   		//把理想视口设置为布局视口
   		document.documentElement.style.fontSize = document.documentElement.clientWidth/7.5+ 'px';
   		//根据设计图宽度动态设置字体大小为100px;

	},
	// 获取元素相对浏览器上部高度
	getClientTop:function(ele) {
			var top = 0;
			while(ele!== null) {
				top += ele.offsetTop;
				ele = ele.offsetParent;
			}
			return top;
	},
	// 获取元素相对浏览器左测宽度
	getClientLeft:function(ele) {
			var Left = 0;
			while(ele!== null) {
				Left += ele.offsetLeft;
				ele = ele.offsetParent;
			}
			return Left;
	},
	// 图片懒加载
	imgLazyLoad:function() {
			var imgList = document.querySelectorAll('body img');
			imgArrayList = Array.prototype.slice.call(imgList,0);
			var seeHeight = document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop;
			var nowIndex = 0;
			var itemOffsetTop = 0;
			var that = this;//使用that保存this的指向
			imgArrayList.forEach(function(item,index) {
				if (that.getClientTop(item)<(seeHeight+scrollTop)) {
					item.setAttribute('src',item.getAttribute('data-img-url'));
					nowIndex = index;
				}
			});
			window.onscroll = function() {
				scrollTop = document.body.scrollTop;
				imgArrayList.forEach(function(item,index) {
					itemOffsetTop = that.getClientTop(item);
					if (itemOffsetTop<(seeHeight+scrollTop)&&index>=nowIndex) {
						item.setAttribute('src',item.getAttribute('data-img-url'));
					}
				});
			}		
		}

}


