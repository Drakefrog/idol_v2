!function(){var a=window.ldl={},b={on:function(a,b){this.events||(this.events={}),this.events[a]||(this.events[a]=[]),"function"==typeof b&&this.events[a].push(b)},off:function(a,b){if(this.events&&this.events[a])for(var c=0;c<this.events[a].length;c++)this.events[a][c]===b&&delete this.events[a][c]},trigger:function(a){if(this.events&&this.events[a])for(var b=[].slice.call(arguments,1),c=0;c<this.events[a].length;c++)"function"==typeof this.events[a][c]&&this.events[a][c].apply(null,b)}},c=function(a){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c],a.events={})};(function(a,b){var c=this.os={},d=this.browser={},e=a.match(/Web[kK]it[\/]{0,1}([\d.]+)/),f=a.match(/(Android);?[\s\/]+([\d.]+)?/),g=!!a.match(/\(Macintosh\; Intel /),h=a.match(/(iPad).*OS\s([\d_]+)/),i=a.match(/(iPod)(.*OS\s([\d_]+))?/),j=!h&&a.match(/(iPhone\sOS)\s([\d_]+)/),k=a.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),l=/Win\d{2}|Windows/.test(b),m=a.match(/Windows Phone ([\d.]+)/),n=k&&a.match(/TouchPad/),o=a.match(/Kindle\/([\d.]+)/),p=a.match(/Silk\/([\d._]+)/),q=a.match(/(BlackBerry).*Version\/([\d.]+)/),r=a.match(/(BB10).*Version\/([\d.]+)/),s=a.match(/(RIM\sTablet\sOS)\s([\d.]+)/),t=a.match(/PlayBook/),u=a.match(/Chrome\/([\d.]+)/)||a.match(/CriOS\/([\d.]+)/),v=a.match(/Firefox\/([\d.]+)/),w=a.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),x=a.match(/MSIE\s([\d.]+)/)||a.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),y=!u&&a.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),z=y||a.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);(d.webkit=!!e)&&(d.version=e[1]),f&&(c.android=!0,c.version=f[2]),j&&!i&&(c.ios=c.iphone=!0,c.version=j[2].replace(/_/g,".")),h&&(c.ios=c.ipad=!0,c.version=h[2].replace(/_/g,".")),i&&(c.ios=c.ipod=!0,c.version=i[3]?i[3].replace(/_/g,"."):null),m&&(c.wp=!0,c.version=m[1]),k&&(c.webos=!0,c.version=k[2]),n&&(c.touchpad=!0),q&&(c.blackberry=!0,c.version=q[2]),r&&(c.bb10=!0,c.version=r[2]),s&&(c.rimtabletos=!0,c.version=s[2]),t&&(d.playbook=!0),o&&(c.kindle=!0,c.version=o[1]),p&&(d.silk=!0,d.version=p[1]),!p&&c.android&&a.match(/Kindle Fire/)&&(d.silk=!0),u&&(d.chrome=!0,d.version=u[1]),v&&(d.firefox=!0,d.version=v[1]),w&&(c.firefoxos=!0,c.version=w[1]),x&&(d.ie=!0,d.version=x[1]),z&&(g||c.ios||l)&&(d.safari=!0,c.ios||(d.version=z[1])),y&&(d.webview=!0),c.tablet=!!(h||t||f&&!a.match(/Mobile/)||v&&a.match(/Tablet/)||x&&!a.match(/Phone/)&&a.match(/Touch/)),c.phone=!(c.tablet||c.ipod||!(f||j||k||q||r||u&&a.match(/Android/)||u&&a.match(/CriOS\/([\d.]+)/)||v&&a.match(/Mobile/)||x&&a.match(/Touch/))),this.isIos=this.os.ios,this.isAndroid=this.os.android,this.isWeixin="micromessenger"==a.toLowerCase().match(/MicroMessenger/i)}).call(a,navigator.userAgent,navigator.platform),a.load=function(){function a(a){var b=$.Deferred();return b}function b(a){c();var b=$.Deferred();return b.fail(function(a){window.console&&window.console.error(a),e()}),$.ajax({url:a,dataType:"jsonp",success:function(a){b.resolve(a)},error:function(){b.reject("err")},complete:function(){d()},timeout:5e3}),b}function c(){i=!0,f=setTimeout(function(){g.show()},200)}function d(){i=!1,f&&clearTimeout(f),g.hide()}function e(){h.show(),setTimeout(function(){h.hide()},1e3)}var f,g="",h="",i=!1;return{getDataInApp:a,getData:b}}(),a.Swipe=function(a,b,c){function d(){m.x=0,m.y=0,q(0,0)}function e(){return{x:b[0].scrollWidth-a.width(),y:b[0].scrollHeight-a.height()}[k]}function f(a){p(function c(){if(n&&Math.abs(a)>=1){a*=i.s,m[k]+=a;var d=!0,f=e();m[k]>0?(m[k]=0,b.trigger("hitStart")):Math.abs(m[k])>f?(m[k]=-f,b.trigger("hitEnd")):d=!1,q(m.x,m.y),d?n=!1:p(c)}else n=!1})}function g(a){a.preventDefault()}var h={dir:"x",s:.95,duration:300},i=$.extend({},h,c),j=$(document.body),k=i.dir,l=i.duration/1e3,m={x:0,y:0,_x:0,_y:0,sx:0,sy:0},n=!1,o=!1,p=(i.loadMore,window.webkitRequestAnimationFrame||requestAnimationFrame),q=function(){var a=document.createElement("div").style;return"webkitPerspective"in a||"perspective"in a?function(a,c){b.css({"-webkit-transform":"translate3d("+a+"px,"+c+"px,0)",transform:"translate3d("+a+"px,"+c+"px,0)"})}:function(a,c){b.css({"-webkit-transform":"translate("+a+","+c+")",transform:"translate("+a+","+c+")"})}}();return b.css({"-webkit-transition":"-webkit-transform "+l+"s ease",transition:"transform "+l+"s ease"}).on("webkitTransitionEnd transitionEnd",function(){n=!1}),a.on("touchstart",function(a){e()<=0||(o=!0,n=!1,"x"==k?(m._x=a.touches[0].screenX,m.sx=a.touches[0].screenX,m.px=m.x):"y"==k&&(m._y=a.touches[0].screenY,m.sy=a.touches[0].screenY,m.py=m.y),b[0].style.webkitTransitionDuration=0,b[0].style.transitionDuration=0,j.on("touchmove",g))}).on("touchmove",function(a){o&&(a.preventDefault(),a.stopPropagation(),n=!0,"x"==k?(m.x=m.px+a.touches[0].screenX-m._x,m.dx=a.touches[0].screenX-m.sx,m.sx=a.touches[0].screenX):"y"==k&&(m.y=m.py+a.touches[0].screenY-m._y,m.dy=a.touches[0].screenY-m.sy,m.sy=a.touches[0].screenY),q(m.x,m.y))}),j.on("touchend",function(a){if(o=!1,j.off("touchmove",g),n){var c=e();if(m[k]>0||Math.abs(m[k])>c)m[k]>0?(m[k]=0,b.trigger("hitStart")):Math.abs(m[k])>c&&(m[k]=-c,b.trigger("hitEnd")),b.css({"-webkit-transition-duration":l+"s","transition-duration":l+"s"}),q(m.x,m.y);else{var d=m["d"+k];Math.abs(d)>3?f(d):n=!1}}}),{show:function(){d(),a.show()},hide:function(){a.hide()},reset:d}},a.debounce=function(a,b,c){var d;return function(){var e=this,f=arguments,g=function(){d=null,c||a.apply(e,f)},h=c&&!d;clearTimeout(d),d=setTimeout(g,b),h&&a.apply(e,f)}},a.cookie=function(){function a(a){var b=new RegExp("(?:;)?"+encodeURIComponent(a)+"=([^;]*);?");return b.test(document.cookie)?decodeURIComponent(RegExp.$1):null}function b(a,b,c,d,e){c&&!isNaN(c)&&(c=new Date((new Date).getTime()+c)),document.cookie=a+"="+escape(b)+(c?"; expires="+c.toGMTString():"")+(d?"; path="+d:"; path=/")+(e?";domain="+e:"")}function c(a){document.cookie=encodeURIComponent(a)+"=0;expires=Fri, 02-Jan-1970 00:00:00 GMT;path=/"}return{get:a,set:b,del:c}}(),a.tmpl=function(){var a={};return function b(c,d){var e=/\W/.test(c)?new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+c.replace(/[\r\t\n]/g," ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):a[c]=a[c]||b(document.getElementById(c).innerHTML);return d?e(d):e}}(),a.Tabs=function(){this.init.apply(this,arguments)},$.extend(a.Tabs.prototype,{init:function(a,b){var d,e,f=this;b=b||".tab[data-type]",d=a.find(b),d.on("click",function(){var a=$(this),b={index:+a.data("index"),type:a.data("type")};e!=b.type&&(e=b.type,f.trigger("tabChanged",b),"function"==typeof defferedFn?defferedFn&&defferedFn(b).then(function(){a.addClass("on").siblings().removeClass("on")}):a.addClass("on").siblings().removeClass("on"))}).each(function(a){$(this).data("index",a)}),e=d.filter(".on").data("type"),this.getCurType=function(){return e},c(this)}}),a.Mask=function(){this.init.apply(this,arguments)},$.extend(a.Mask.prototype,{init:function(a){this.mask=$(a||this.tpl).hide().appendTo($(document.body))},tpl:'<div class="mask" style="position:fixed;top:0;left:0;bottom:0;right:0;background-color:rgba(0,0,0,.5);"></div>',show:function(){this.mask&&this.mask.show()},hide:function(){this.mask&&this.mask.hide()},destroy:function(){this.mask.remove(),this.mask=null}}),a.InputPlaceholder=function(){this.init.apply(this,arguments)},$.extend(a.InputPlaceholder.prototype,{init:function(a,b){var c=$('<div class="inputWraper" style="position:relative;z-index:5;"></div>'),d=$('<div class="placeholder" style="position:absolute;left:0;right:0;top:0;bottom:0;z-index:1;pointer-events:none;">'+b+"</div>");a.removeAttr("placeholder").wrap(c),d.appendTo(c),a.on("input focus blur",function(){0==a.val().trim().length?d.show():d.hide()}),this.target=a,this.inputWraper=c,this.placeholder=d}});var d={maxLen:function(a){return this.length<=a},len:function(a){return this.length==+a},phoneNum:function(){return/^(d{3,4}|d{3,4}-)?d{7,8}$/.test(this)},idCard:function(){return/^d{15}|d{18}$/.test(this)},mail:function(){return/^w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$/.test(this)},zipCode:function(){return/^[1-9]d{5}(?!d)$/.test(this)},nickName:function(){return/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(this)}},e=function(){var a=this.$el.data("validate");if(!a)return!0;for(var b,c,e=a.split(","),f=e.length;f--;)if(b=e[f].split(":")[0],c=e[f].split(":")[1],!d[b]||!d[b].apply(this.$el.val().trim(),c&&c.split("|")||[]))return this.$el[0].scrollIntoView&&this.$el[0].scrollIntoView(),!1;return!0};a.Formfuc=function(){this.init.apply(this,arguments)},$.extend(a.Formfuc.prototype,{init:function(a,b,c,d){d&&$.extend(this,d),this.form=a,this.formBlocks=a.find(".formBlock"),this.submit=a.find("a[data-type=submit]"),this.errTarget=null;var e=this;this.submit.on("click",function(a){a.preventDefault(),e.getItemsToValidate(),e.validate()?(e.errTarget=null,e.onSubmit(b,c)):e.validateFail()})},getItemsToValidate:function(){this.items=[];var b=this;this.inputs=[],this.formBlocks.find("input[type=text]").each(function(c,d){b.inputs.push(new a.FormItems.Input($(d)))}),this.items=this.items.concat(this.inputs)},validate:function(){var a=this,b=this.items.every(function(b){var c=b.validate();return c?!0:(a.errTarget=b.$el,!1)});return b},validateFail:function(){window.console&&window.console.log("validate failed at",this.errTarget)},onSubmit:function(b,c,d){return a.load.getData(b).done(c).fail(d)},addValidates:function(a,b){this.validates[a]=b},validateFns:d}),a.FormItems={},a.FormItems.Input=function(){this.init.apply(this,arguments)},$.extend(a.FormItems.Input.prototype,{init:function(a){this.$el=a},validate:e}),a.FormItems.Select=function(){this.init.apply(this,arguments)},$.extend(a.FormItems.Select.prototype,{init:function(a,b){this.$el=a,this.placeholder=b;var c=this;a.on("change",function(){c.placeholder.text(text)}).one("change",function(){c.placeholder.removeClass("placeholder")})}}),a.FormItems.Checkbox=function(){this.init.apply(this,arguments)},$.extend(a.FormItems.Checkbox.prototype,{init:function(a){this.$el=a;a.on("click",function(){a.hasClass("checked")?a.removeClass("checked"):a.addClass("checked")})},validate:e})}();
//# sourceMappingURL=common.map