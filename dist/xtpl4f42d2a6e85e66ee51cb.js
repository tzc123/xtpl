!function(e){function t(a){if(r[a])return r[a].exports;var n=r[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,a){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:a})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,r){"use strict";var a=r(1),n=r(3);window.xtpl={Section:a,render:n}},function(e,t,r){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},i=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),o=r(2),l=function(){function e(t){a(this,e),this.tpl=t}return i(e,[{key:"deal",value:function(e){var t=o(e.value),r=n({},e,t),a=this.current;a.parent;if(t)if(!this.current.start||"if"!=this.current.start.type||"elseif"!=t.type&&"else"!=t.type)if(t.value)this.current.end||(this.current.start?(this.checkout("child"),this.start(r)):this.start(r));else{if(t.type!=this.current.start.type)throw new Error("标签未正确闭合");if(this.end(r),this.current==this.tree.root)return;this.current=this.current.parent}else this.current.middle||(this.current.middle=[]),this.current.middle.push(r);else this.createVariable(e)}},{key:"createVariable",value:function(e){var t=this.current;t.variables||(t.variables=[]),t.variables.push(e)}},{key:"checkout",value:function(e){if("child"==e){var t={parent:this.current,belong:this};this.current.children||(this.current.children=[]),this.current.children.push(t),this.current=t}}},{key:"start",value:function(e){this.current.start=e,console.log(e.type,"开始")}},{key:"end",value:function(e){this.current.end=e,console.log(e.type,"闭合")}},{key:"middle",value:function(e){this.current.middle=e}},{key:"init",value:function(){return this.tree={root:{start:{tagBegin:-1,tagClose:-1},end:!1,belong:this,content:this.tpl}},this.current=this.tree.root,this.search()}},{key:"search",value:function(){for(var e=0,t=this.tree.root;;){var r=this.tpl.indexOf("{",e),a=this.tpl.indexOf("}",e);if(-1==r){if(-1==a){if(!t.children||t.children[t.children.length-1].end)return this.current.end=!0,this.tree;throw new Error("标签未正确闭合")}throw new Error("找不到{")}if(-1==a)throw new Error("找不到}");var n=this.tpl.substring(r+1,a);e=a+1,this.deal({tagBegin:r,tagClose:a,value:n})}}}]),e}();e.exports=l},function(e,t,r){"use strict";function a(e){var t=["for","elseif","else","if"],r=void 0;t.some(function(t){if(-1!=e.indexOf(t))return r={type:t},!0});var a=e.match(/\((.+)\)/);return r&&a&&(r.value=a[1]),r||!1}e.exports=a},function(module,exports,__webpack_require__){"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function render(section){var tpl=section.tpl,current=section.tree.root;make(current,function(node){node!=node.belong.tree.root?resolve(node):node.render=function(data){var _this=this;this.variables&&this.variables.forEach(function(variable){_this.content=_this.content.replace("{"+variable.value+"}",eval(getVariable(data,variable.value)))})}})}function resolve(node){node.content=node.belong.tpl.substring(node.start.tagClose+1,node.end.tagBegin),node.render=function(data){var _this2=this,tpl=this.belong.tpl,content="",variables=this.variables;if("for"==this.start.type){var list=eval(getVariable(data,this.param.list).value);if(!list)throw new Error("不存在"+this.param.list);if("[object Array]"!={}.toString.call(list))throw new Error(this.param.list+"不是一个数组");content=list.map(function(item,index){var ocontent=_this2.content;return variables&&variables.forEach(function(variable){if(-1!=variable.value.indexOf(_this2.param.item)){var _item_=getVariable(data,variable.value.replace(_this2.param.item,_this2.param.list+"["+index+"]")).value;ocontent=ocontent.replace("{"+variable.value+"}",eval(_item_))}else{var res=getVariable(data,variable.value),value=void 0;value=res.complete?eval(res.value):"{"+res.value+"}",ocontent=ocontent.replace("{"+variable.value+"}",value)}}),ocontent}),content=content.join("")}else if("if"==this.start.type)if(this.middle){var choices=[this.start].concat(_toConsumableArray(this.middle));choices=choices.map(function(e,t){return{content:tpl.substring(e.tagClose+1,choices[t+1]?choices[t+1].tagBegin:_this2.end.tagBegin),tag:e}}),choices.some(function(choice){return"else"==choice.tag.type?(content=choice.content,variables&&variables.forEach(function(variable){var res=getVariable(data,variable.value),value=void 0;value=res.complete?eval(res.value):"{"+res.value+"}",content=choice.content.replace("{"+variable.value+"}",value)}),!0):eval(getVariable(data,choice.tag.value))?(content=choice.content,variables&&variables.forEach(function(variable){var res=getVariable(data,variable.value),value=void 0;value=res.complete?eval(res.value):"{"+res.value+"}",content=choice.content.replace("{"+variable.value+"}",value)}),!0):void 0})}else eval(getVariable(data,this.start.value))&&this.variables&&this.variables.forEach(function(variable){var res=getVariable(data,variable.value),value=void 0;value=res.complete?eval(res.value):"{"+res.value+"}",content=_this2.content.replace("{"+variable.value+"}",value)});var oldContent=this.belong.tpl.substring(this.start.tagBegin,this.end.tagClose+1);console.log(content,"content"),this.parent.content=this.parent.content.replace(oldContent,content)}}function getVariable(e,t){var r=!0;return{value:t.replace(/(?!"')([^\.\[\]\{\}\(\)\s]*)(?!"')/g,function(t,a){return e[a.trim()]?"data."+a.trim():(r=!1,a)}),complete:r}}function getForParams(e){var t=e.match(/(.+) in (.+)/);if(!t)throw new Error("for参数有误");return{item:t[1].trim(),list:t[2].trim()}}function make(e,t){t(e),e.children&&e.children.forEach(function(e){make(e,t)})}module.exports=function(e,t){console.log("开始解析"),make(e.tree.root,function(e){"for"==e.start.type&&(e.param=getForParams(e.start.value))}),render(e)}}]);