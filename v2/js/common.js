(function() {
    var ldl = window.ldl = {};

    ldl.urlPrefix = 'http://walk.ledongli.cn:8090/v2/rest/group';
    ldl.appid = 'wx7d9e5b22320e33c8';

    //显示错误
    // window.onerror = function(err){
    //     alert(err);
    // }

    var observer = {
        on: function(type, callback) {
            if (typeof callback === 'function') {
                if (!this._events) this._events = {};
                if (!this._events[type]) this._events[type] = [];

                this._events[type].push(callback);
            }
            return this;
        },
        one: function(type, callback) {
            if (typeof callback === 'function') {
                var self = this,
                    fn = function() {
                        callback();
                        self.off(type, fn);
                    };
                this.on(type, fn);
            }
            return this;
        },
        off: function(type, callback) {
            if (!this._events || !this._events[type]) return this;

            for (var i = 0; i < this._events[type].length; i++) {
                if (this._events[type][i] === callback)
                    delete this._events[type][i];
            }
            return this;
        },
        trigger: function(type) {
            if (!this._events || !this._events[type]) return this;

            var args = [].slice.call(arguments, 1);
            for (var i = 0; i < this._events[type].length; i++) {
                if (typeof this._events[type][i] === 'function')
                    this._events[type][i].apply(null, args);
            }
            return this;
        }
    };

    ldl.makeObserver = function(o) {
        for (var i in observer) {
            if (observer.hasOwnProperty(i)) {
                o[i] = observer[i];
                o._events = {};
            }
        }
    };

    ldl.makeObserver(ldl);

    (function(ua, platform) {
        var os = this.os = {},
            browser = this.browser = {},
            webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
            android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            osx = !!ua.match(/\(Macintosh\; Intel /),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            win = /Win\d{2}|Windows/.test(platform),
            wp = ua.match(/Windows Phone ([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            playbook = ua.match(/PlayBook/),
            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            firefox = ua.match(/Firefox\/([\d.]+)/),
            firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
            ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
            webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
            safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)

        if (browser.webkit = !!webkit) browser.version = webkit[1]

        if (android) os.android = true, os.version = android[2]
        if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
        if (wp) os.wp = true, os.version = wp[1]
        if (webos) os.webos = true, os.version = webos[2]
        if (touchpad) os.touchpad = true
        if (blackberry) os.blackberry = true, os.version = blackberry[2]
        if (bb10) os.bb10 = true, os.version = bb10[2]
        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
        if (playbook) browser.playbook = true
        if (kindle) os.kindle = true, os.version = kindle[1]
        if (silk) browser.silk = true, browser.version = silk[1]
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
        if (chrome) browser.chrome = true, browser.version = chrome[1]
        if (firefox) browser.firefox = true, browser.version = firefox[1]
        if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
        if (ie) browser.ie = true, browser.version = ie[1]
        if (safari && (osx || os.ios || win)) {
            browser.safari = true
            if (!os.ios) browser.version = safari[1]
        }
        if (webview) browser.webview = true

        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
            (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
        os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
            (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
            (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))

        this.isIos = this.os.ios;
        this.isAndroid = this.os.android;
        this.isWeixin = ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger";

    }).call(ldl, navigator.userAgent, navigator.platform);

    //微信授权
    var _wxAuthorize = {
            code: function() {
                var params = ldl.getUrlObj(),
                    code = params.search.code;

                if (!code) {
                    return $.Deferred().reject('缺少code');
                }

                return ldl.getData('http://walk.ledongli.cn:8090/v2/rest/users/accesstokenwechatweb', {
                    code: code
                }).then(function(d) {
                    return d.errorCode == 0 ? $.Deferred().resolve(d) : $.Deferred().reject('code无效');
                });
            },
            refreshToken: function(token) {
                if (token) {
                    return ldl.getData('http://walk.ledongli.cn:8090/v2/rest/users/refreshtokenwechatweb', {
                        refresh_token: token
                    }).then(function(d) {
                        if (d.errorCode == 0) {
                            return $.Deferred().resolve(d);
                        } else {
                            //refresh_token也超时了 必须要用户重新授权
                            if (ldl.isSupportStorage && sessionStorage._userData) delete sessionStorage._userData;
                            return $.Deferred().reject('请重新授权登录');
                        }
                    });
                }
                return $.Deferred().reject('refresh_token无效');
            }

        },

        _authorizeByWeixin = function(type, data) {
            return _wxAuthorize[type] ? _wxAuthorize[type](data) : $.Deferred.reject('没找到这种授权方式:' + type);
        };

    // 获取并保存用户数据
    ldl.getAndSaveData = function() {
        return ldl.isWeixin ? ldl.getUserDataInWeixin() : ldl.getUserDataInapp();
    };

    ldl.getUserData = ldl.getAndSaveData; //todo

    ldl.getUserDataInWeixin = function() {
        var userData = _getUserDataFromSession('_userData');

        if (userData && userData.src == 'wechat') {
            //保存过数据
            ldl.userData = userData;
            //access_token没有超时
            if (userData.expires > +new Date) return $.Deferred().resolve();
            //access_token超时 需要刷新授权
            else return _authorizeByWeixin('refreshToken', userData.refresh_token)
                .then(function(d) {
                    ldl.userData.access_token = d.ret.access_token,
                    ldl.userData.refresh_token = d.ret.refresh_token,
                    ldl.userData.openid = d.ret.openid,
                    ldl.userData.expires = d.ret.expires_in * 1000 + +new Date,

                    _saveUserToSession('_userData', ldl.userData);
                });
        } else {
            //获取数据
            if (ldl.isSupportStorage && sessionStorage._userData) delete sessionStorage._userData;
            return _authorizeByWeixin('code').then(_saveUserData);
        }
    };

    ldl.getUserDataInapp = function() {
        var userData = _getUserDataFromSession('_userData');

        if (userData && userData.uid != 0 && userData.src == 'ledongli') {
            //保存过
            ldl.userData = userData;
            return _loadAppJs();
        } else {
            //获取数据
            if (ldl.isSupportStorage && sessionStorage._userData) delete sessionStorage._userData;
            return _loadAppJs().then(_saveUserData);
        }
    };

    function _getUserDataFromSession(name) {
        if (ldl.isSupportStorage && sessionStorage[name]) {
            return JSON.parse(sessionStorage[name]);
        }
    }

    function _saveUserData(d) {
        if (ldl.isWeixin) {
            if (d.errorCode === 0) {
                ldl.userData = {
                    access_token: d.ret.access_token,
                    refresh_token: d.ret.refresh_token,
                    openid: d.ret.openid,
                    uid: d.ret.uid,
                    unionid: d.ret.unionid,
                    expires: d.ret.expires_in * 1000 + +new Date,
                    src: 'wechat'
                };

                _saveUserToSession('_userData', ldl.userData);
            } else {
                return $.Deferred().reject('获取用户信息出错');
            }
        } else if (ldl.isApp) {
            var deferred = $.Deferred();

            ldl.userData = {};
            ldl.app.getUserInfo()
            .done(function(res) {
                var o = JSON.parse(res);
                if (o.isLogin) {
                    ldl.userData = o;
                    ldl.userData.src = 'ledongli';
                    _saveUserToSession('_userData', ldl.userData);

                    deferred.resolve(res);
                } else {
                    //可能用户没有登录
                    deferred.reject('没有登录？');
                }
            })
            .fail(function() {
                if (ldl.isSupportStorage && sessionStorage._userData) delete sessionStorage._userData;
                deferred.reject('请重试');
            });

            return deferred;
        }
    };

    function _saveUserToSession(name, data) {
        //保存到session
        if (ldl.isSupportStorage && data) {
            sessionStorage[name] = JSON.stringify(data);
        }
    }


    ldl.showObj = function(obj, silence) {
        var msg = '';
        Object.keys(obj).forEach(function(d) {
            if (typeof obj[d] == 'object')
                msg += ldl.showObj(obj[d], true);
            else msg += d + ':' + obj[d] + ' ';
        });

        if (silence) return msg;
        else alert(msg);
    };

    // app js接口
    var _loadAppJs = function() {
        var fnNames = "getAppInfo getUserInfo getWebCondition getActivitywithData setUserGoalWithData getDailyStatsWithData openURLWithData getCurrentLocation setWebViewShare".split(" "),
            deferred = $.Deferred(),
            tid = setTimeout(function() {
                //延迟1秒 超时则不在app内
                deferred.reject('app接口检测失败');
            }, 1000);

        ldl.isApp = '';
        ldl.app = {};

        if (ldl.isIos) {

            if (window.WebViewJavascriptBridge) {
                initIosFns(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function() {
                    initIosFns(WebViewJavascriptBridge);
                }, false);
            }

        } else if (ldl.isAndroid && typeof web != 'undefined' && typeof web.getUserInfo == 'function') {

            ldl.isApp = 'android';
            clearTimeout(tid);

            fnNames.forEach(function(name) {
                ldl.app[name] = (function(method) {
                    return function(data) {
                        //坑 安卓下 如果函数不需要参数 不能给他传参数 不然报错
                        var d = typeof data != 'undefined' ? web[method](data) : web[method]();
                        return $.Deferred().resolve(d);
                    };
                })(name);
            });
            deferred.resolve('android');
        }

        return deferred;

        function initIosFns(bridge) {
            ldl.isApp = 'ios';
            clearTimeout(tid);

            bridge.init(function(message, responseCallback) {
                ldl.bridgeinited = 'inited';
                var data = {
                    'Javascript Responds': 'Wee!'
                }
                responseCallback(data);
            });

            fnNames.forEach(function(name) {
                ldl.app[name] = (function(method) {
                    return function(data) {
                        var deferred = $.Deferred();
                        bridge.callHandler(method, data, function(response) {
                            deferred.resolve(response);
                        });
                        return deferred;
                    };
                })(name);
            });

            deferred.resolve('ios');
        }

    };

    ldl.isSupportStorage = function() {
        var isSupport = true;
        try {
            localStorage.test = 'test';
            delete localStorage.test;
        } catch (e) {
            isSupport = false;
        }

        return isSupport;
    }();

    ldl.makeParamsStr = function(params) {
        var url = '';
        $.each(params, function(key, value) {
            url += '&' + key + '=' + value;
        });

        return url.substr(1);
    }

    ldl.makeParamsObj = function(str) {
        var re = {};
        str.split('&').forEach(function(v, i) {
            var arr = v.split('=');
            re[arr[0]] = arr[1];
        });
        return re;
    }

    ldl.getUrlObj = function(url) {
        var a = document.createElement('a'),
            search, hash,
            re = {
                search: '',
                hash: ''
            };

        a.href = url || location.href;
        search = a.search;
        hash = a.hash;

        if (search) {
            re.search = ldl.makeParamsObj(search.substr(1));
        }

        if (hash) {
            re.hash = ldl.makeParamsObj(hash.substr(1));
        }

        return re;
    }

    ldl.delay = function(delay) {
        var deferred = $.Deferred(),
            tid = setTimeout(function() {
                deferred.resolve();
            }, delay);
        deferred.fail(function() {
            tid && clearTimeout(tid);
        });
        return deferred;
    };

    ldl.checkParamsOnload = function() {
        var paramsArr = [].slice.call(arguments),
            inValidArr = [],
            hash = ldl.getUrlObj().hash;

        paramsArr.forEach(function(param) {
            if (typeof hash[param] == 'undefined') {
                inValidArr.push(param);
            };
        });

        if (inValidArr.length) {
            ldl.gTip.show('缺少参数', 0);
            return true;
        }

        return false;
    };

    ldl.makeMaskTip = function() {
        var $doc = $(document.body),
            $tip, _state = 'hide',
            config,
            defaults = {
                tpl: '',
                initFn: function() {},
                stopScrollOnShow: true,
                fixAdBlock: true
            },
            _pdf = function(e) {
                e.preventDefault();
            };

        return {
            init: function(options, initFn) {
                config = $.extend({}, defaults, options);

                $tip = $(config.tpl);
                ldl.makeObserver(this);

                config.fixAdBlock && $tip.css({
                    'position': 'absolute',
                    'visibility': 'hidden'
                });

                config.initFn($tip);
            },
            show: function(data) {
                if (_state == 'hide') {
                    _state = 'show';

                    $tip.appendTo($doc);

                    config.stopScrollOnShow && $doc.on('touchmove', _pdf);

                    config.fixAdBlock && setTimeout(function() {
                        $tip.css({
                            'position': 'fixed',
                            'visibility': 'visible'
                        });
                    }, 10);

                    this.trigger('show', {
                        el: $tip,
                        data: data
                    });
                }
            },
            hide: function(data) {
                if (_state == 'show') {
                    _state = 'hide';

                    $tip.detach();
                    config.stopScrollOnShow && $doc.off('touchmove', _pdf);

                    config.fixAdBlock && $tip.css({
                        'position': 'absolute',
                        'visibility': 'hidden'
                    });

                    this.trigger('hide', {
                        el: $tip,
                        data: data
                    });
                }
            }
        }
    };

    ldl.makeScrollloader = function() {
        var _isTouching = false,
            dx, x,
            dy, y,
            state,
            config = {
                root: $('body'),
                checkFn: function() {
                    return false
                },
                callback: null
            },
            throttleTm = ldl.debounce(_handleTm, 300),
            callbacks = [];

        return {
            init: function(options) {
                $.extend(config, options);
                if (typeof config.checkFn != 'function') return window.console && window.console.error('need the check fn!');
                if (typeof config.callback == 'function') callbacks.push(config.callback);
            },
            start: function() {
                if (state != 'on') {
                    state = 'on';
                    config.root
                        .on('touchstart', _handleTs)
                        .on('touchmove', throttleTm);
                }
            },
            stop: function() {
                if (state != 'off') {
                    state = 'off';
                    config.root
                        .off('touchstart', _handleTs)
                        .off('touchmove', throttleTm);
                }
            },
            add: function(fn) {
                if (typeof fn == 'function') callbacks.push(fn);
            },
            del: function(fn) {
                if (typeof fn != 'function') return;
                callbacks.every(function(f, i) {
                    if (fn === f) {
                        delete callbacks[i];
                        return false;
                    }
                    return true;
                });
            }
        }

        function _handleTs(e) {
            _isTouching = true;
            x = e.touches[0].screenX;
            y = e.touches[0].screenY;
        };

        function _handleTe(e) {
            //安卓4下有bug，如果body滚动则不触发touchend事件
            if (_isTouching) {
                _isTouching = false;

                dx = e.changedTouches[0].screenX - x;
                dy = e.changedTouches[0].screenY - y;

                if (config.checkFn({
                    dx: dx,
                    dy: dy
                })) {
                    callbacks.forEach(function(fn) {
                        fn();
                    });
                }
            }
        }

        function _handleTm(e) {
            if (_isTouching) {
                _isTouching = false;

                dx = e.touches[0].screenX - x;
                dy = e.touches[0].screenY - y;

                if (config.checkFn({
                    dx: dx,
                    dy: dy
                })) {
                    callbacks.forEach(function(fn) {
                        fn();
                    });
                }
            }
        }
    };

    ldl.getData = function(url, data, complete) {
        var deferred = $.Deferred();

        deferred.fail(function() {
            window.console && window.console.error('web connection error or server error');
        });

        $.ajax({
            url: url,
            data: data,
            dataType: 'jsonp',
            success: function(data) {
                deferred.resolve(data);
            },
            error: function(err) {
                deferred.reject(err);
            },
            complete: function() {
                complete && complete();
            },
            timeout: 5000
        });

        return deferred;
    }

    ldl.makeLoader = function() {
        var url, isLoading, fail, done, inited, always,
        that = {
            init: function(options) {
                url = options.url;
                done = options.done;
                fail = options.fail;
                always = options.always;

                inited = true;

                return that;
            },
            doSearch: doSearch
        };

        return that;

        function doSearch(params) {
            if (!inited || isLoading) return;
            isLoading = true;

            return ldl.getData(url, params)
                .done(done)
                .fail(fail)
                .always(function() {
                    isLoading = false;
                    always && always();
                });
        }
    };

    ldl.throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
            previous = options.leading === false ? 0 : +new Date;
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
            var now = +new Date;
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    ldl.debounce = function(func, wait, immediate) {
        var tid;
        return function() {
            var o = this,
                args = arguments;
            var later = function() {
                tid = null;
                if (!immediate) func.apply(o, args);
            };
            var callNow = immediate && !tid;
            clearTimeout(tid);
            tid = setTimeout(later, wait);
            if (callNow) func.apply(o, args);
        };
    };

    ldl.debounce2 = function(func, wait) {
        var tid;
        return function() {
            var args = [].slice.call(arguments);
            clearTimeout(tid);
            tid = setTimeout(function() {
                func.apply(null, args);
            }, wait);
        }
    }

    ldl.cookie = function() {
        return {
            get: getCookie,
            set: setCookie,
            del: deleteCookie
        }

        function getCookie(name) {
            var exp = new RegExp("(?:;)?" + encodeURIComponent(name) + "=([^;]*);?");
            if (exp.test(document.cookie))
                return decodeURIComponent(RegExp['$1']);
            else return null;
        }

        function setCookie(name, value, expires, path, domain) {
            if (expires && !isNaN(expires)) expires = new Date(new Date().getTime() + expires);
            document.cookie = name + "=" + escape(value) + (expires ? "; expires=" + expires.toGMTString() : "") + (path ? "; path=" + path : "; path=/") + (domain ? ";domain=" + domain : "");
        }

        function deleteCookie(name) {
            document.cookie = encodeURIComponent(name) + "=0;expires=Fri, 02-Jan-1970 00:00:00 GMT;path=/";
        }
    }();

    ldl.tmpl = function() {
        var cache = {};

        return function tmpl(str, data) {
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" +
                    str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'") + "');}return p.join('');");

            return data ? fn(data) : fn;
        };

    }();

    ldl.Tabs = function() {
        this.init.apply(this, arguments);
    }

    $.extend(ldl.Tabs.prototype, {

        init: function($container, selector, defferedFn) {
            var $tabs, o = this;

            selector = selector || '.tab[data-type]';

            $tabs = $container.find(selector);

            $tabs.on('tap', function() {
                var $curTab = $(this),
                    params = {
                        index: +$curTab.data('index'),
                        type: $curTab.data('type')
                    };

                if (o.curType == params.type) return;
                else o.curType = params.type;

                o.trigger('tabChanged', params);

                if (typeof defferedFn == 'function')
                    defferedFn && defferedFn(params).then(function() {
                        $curTab.addClass('on').siblings().removeClass('on');
                    });
                else
                    $curTab.addClass('on').siblings().removeClass('on');

            }).each(function(i) {
                $(this).data('index', i);
            });

            this.curType = $tabs.filter('.on').data('type');

            this.container = $container;
            this.tabs = $tabs;

            ldl.makeObserver(this);
        },
        switchTo: function(type) {
            this.tabs.filter('[data-type=' + type + ']').trigger('tap');
        }

    });

    ldl.Mask = function() {
        this.init.apply(this, arguments);
    }

    $.extend(ldl.Mask.prototype, {

        init: function(tpl) {
            this.mask = $(tpl || this.tpl).hide().appendTo($(document.body));
        },

        tpl: '<div class="mask" style="position:fixed;top:0;left:0;bottom:0;right:0;background-color:rgba(0,0,0,.5);"></div>',

        show: function() {
            this.mask && this.mask.show();
        },

        hide: function() {
            this.mask && this.mask.hide();
        },

        destroy: function() {
            this.mask.remove();
            this.mask = null;
        }
    });

    ldl.InputPlaceholder = function() {
        this.init.apply(this, arguments);
    };

    $.extend(ldl.InputPlaceholder.prototype, {

        init: function($input, txt) {
            var $inputWraper = $('<div class="inputWraper" style="position:relative;z-index:5;"></div>'),
                $placeholder = $('<div class="placeholder" style="position:absolute;left:0;right:0;top:0;bottom:0;z-index:1;pointer-events:none;">' + txt + '</div>');

            $input.removeAttr('placeholder').wrap($inputWraper);
            $placeholder.appendTo($inputWraper);

            $input.on('input focus blur', function() {
                $input.val().trim().length == 0 ? $placeholder.show() : $placeholder.hide();
            });

            this.target = $input;
            this.inputWraper = $inputWraper;
            this.placeholder = $placeholder;

        }

    });

    // validates
    var _validates = {
        maxLen: function(len) {
            return this.length <= len;
        },
        minLen: function(len) {
            return this.length >= len;
        },
        len: function(len) {
            return this.length == +len;
        },
        tel: function() {
            return /^(\d{3,4}|\d{3,4}-)?\d{7,8}$/.test(this);
        },
        idCard: function() {
            return /^\d{15}|\d{18}$/.test(this);
        },
        mail: function() {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*$/.test(this);
        },
        zipCode: function() {
            return /^[1-9]\d{5}(?!\d)$/.test(this);
        },
        nickName: function() {
            return /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(this);
        },
        required: function() {
            return this.length > 0;
        },
        number: function() {
            return !/\D/.test(this);
        },
        mt: function(num) {
            return Number(this) > num;
        },
        lt: function(num) {
            return Number(this) < num;
        },
        gte: function(num) {
            return Number(this) >= num;
        },
        lte: function(num) {
            return Number(this) <= num;
        }

    }

    var _commonValidate = function($el) {
        // data-validate = "maxLen:20,phoneNum"
        var validateString = $el.data('validate');
        // 没有设定检验函数 默认通过
        if (!validateString) return true;

        var validates = validateString.split(','),
            len = validates.length,
            method, params;

        while (len-- > 0) {
            method = validates[len].split(':')[0];
            params = validates[len].split(':')[1];
            if (!_validates[method] || !_validates[method].apply($el.val().trim(), params && params.split('|') || [])) {
                // $el[0].scrollIntoView && $el[0].scrollIntoView();
                return false;
            }
        }

        return true;
    };

    ldl.Formfuc = function() {
        this.init.apply(this, arguments);
    };
    $.extend(ldl.Formfuc.prototype, {
        init: function($form, params) {
            // 默认只对'data-validate'做验证
            this.checkTypes = '[data-validate]';
            params && $.extend(this, params);

            this.form = $form;
            this.formBlocks = $form.find('.formBlock');
            this.submit = $form.find('a[data-type=submit]');
            this.errTarget = null;

            // 提交按钮
            var o = this;
            this.submit.on('tap', ldl.throttle(function(e) {
                e.preventDefault();
                o.validate() ? o.onSubmit() : o.validateFail();
            }, 2000, {
                trailing: false
            }))
                .on('click', function(e) {
                    e.preventDefault();
                });
        },
        validate: function() {
            var isValid = true,
                o = this;
            this.formBlocks.find(this.checkTypes).each(function(index, item) {
                isValid = _commonValidate($(item));
                if (!isValid) {
                    if (!o.errTarget) o.errTarget = $(item);
                    return false;
                }
                if (o.errTarget) {
                    o.errTarget.errTip.remove();
                    o.errTarget = null;
                }
            });
            if (isValid) o.errTarget = null;

            return isValid;
        },
        validateFail: function() {
            var $el = this.errTarget;

            if (!$el.errTip) {
                $el.errTip = $('<div class="errTip">' + this.errTarget.data('msg') + '</div>');
                this.errTarget.closest('.inputArea').append($el.errTip);
            } else {
                $el.errTip.one('animationend webkitAnimationEnd', function() {
                    $el.removeClass('validateFailed');
                }).addClass('validateFailed');
            }
        },
        onSubmit: function(url) {
            return ldl.getData(url).done(this.done).fail(this.fail);
        },
        addValidates: function(type, fn) {
            this.validates[type] = fn;
        },
        validateFns: _validates
    });

    ldl.makeTip = function(options) {
        var defaults = {
                tpl: '',
                el: '.txt',
                root: 'body',
                duration: 3000,
                preventScroll: false,
                fixAdBlock: true
            },
            config = $.extend({}, defaults, options),
            $tip = $(config.tpl),
            $doc = $(document.body),
            preventScroll = config.preventScroll,
            prevented = false,
            fixAdBlock = config.fixAdBlock;

        if (fixAdBlock) {
            $tip.css({
                'position': 'absolute',
                'visibility': 'hidden'
            });
        }

        return {
            show: function(s, duration) {
                if ($tip.length === 0) return;

                this._tid && clearTimeout(this._tid);
                duration = duration > -1 ? duration : config.duration;

                $tip.find(config.el).html(s);
                $tip.appendTo($(config.root));

                if (fixAdBlock)
                    setTimeout(function() {
                        $tip.css({
                            'position': 'fixed',
                            'visibility': 'visible'
                        });
                    }, 10);

                if (duration) this._tid = setTimeout(this.hide, duration);

                if (preventScroll && !prevented) {
                    prevented = true;
                    $doc.on('touchmove', preventScrollFn);
                }
            },
            hide: function() {

                if (fixAdBlock) {
                    $tip.css({
                        'position': 'absolute',
                        'visibility': 'hidden'
                    });
                }

                $tip.detach();
                if (preventScroll && prevented) {
                    $doc.off('touchmove', preventScrollFn);
                    prevented = false;
                }
            }
        }

        function preventScrollFn(e) {
            e.preventDefault();
        }
    }

    //全局提示
    ldl.gTip = ldl.makeTip({
        tpl: '<div class="tipInCenter"><div class="txt"></div></div>'
    });

    //检查os下载
    ldl.checkOs = function() {
        var uid = ""; //<?php=$uid?>
        var nick_name = ""; //<?php=$nickName?>
        var avatar_url = ""; //<?php=$avatarURL?>
        var from = ""; //<?php=$from?>

        //百度统计代码
        var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
        document.write(decodeURI("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F57f7fa8376d0ddf63af2e6b149bd1595' type='text/javascript'%3E%3C/script%3E"));

        //默认的地址
        var defaultUrl = 'http://www.ledongli.cn';
        //如果检测到是Android系统需要跳转的地址
        // var androidUrl = "ldl://openapp.ledongli.com?uid=" + uid + "&nick_name=" + nick_name + "&avatar_url" + avatar_url + "&from" + from;
        var androidUrl = "ldl://openapp.ledongli.com";
        //如果检测到是iphone/ipod需要跳转的地址
        // var iphoneUrl = "ledongliopen://?uid=" + uid + "&nick_name=" + nick_name + "&avatar_url=" + avatar_url + "&from=" + from;
        var iphoneUrl = "ledongliopen://";

        //?uid="+uid+"&nick_name="+nick_name+"&avatar_url"+avatar_url+"&from="+from
        //symbian跳转地址
        var symbianUrl = 'http://www.ledongli.cn/';
        //windows phone跳转地址
        var windowsPhoneUrl = 'http://www.ledongli.cn/';
        //应用宝地址
        var appstore = 'http://a.app.qq.com/o/simple.jsp?pkgname=cn.ledongli.ldl';

        var ldlopen = '';
        var ldlopenfailed = '';
        var ua = (navigator.userAgent || navigator.vendor || window.opera);
        if (ua != null) {
            var uaName = ua.toLowerCase();
            //判断android并跳转
            if (/android/i.test(uaName)) {
                ldlopen = androidUrl;
                ldlopenfailed = appstore;

            }
            //判断苹果并跳转
            else {
                if (/ip(hone|od)/i.test(uaName)) {
                    ldlopen = iphoneUrl;
                    ldlopenfailed = appstore;

                }
                //其他系统
                else {
                    if (/symbian/i.test(uaName)) {
                        ldlopen = symbianUrl;
                        ldlopenfailed = defaultUrl;
                    } else {
                        if (/windows (ce|phone)/i.test(uaName)) {
                            ldlopen = windowsPhoneUrl;
                            ldlopenfailed = defaultUrl;
                        } else {
                            ldlopen = defaultUrl;
                            ldlopenfailed = defaultUrl;
                        }
                    }

                }
            }
        } else {
            ldlopen = defaultUrl;
            ldlopenfailed = defaultUrl;
        }

        var deferred = $.Deferred(),
            start = new Date();

        //尝试拉起应用
        window.location = ldlopen;
        setTimeout(function() {
                if (+new Date() - start < 2000) {
                    //没有安装应用
                    ldl.appInstalled = false;
                    ldl.url2Download = ldlopenfailed;
                    deferred.reject('no');
                    // window.location = ldlopenfailed;
                } else {
                    //已经安装
                    ldl.appInstalled = true;
                    deferred.resolve('ok');
                    // window.close();
                }
            },
            500);

        return deferred;
    }
})();