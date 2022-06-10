/*!
 * MIT License
 * Copyright 2020 D-EDGE
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */!function(e){var t={};function o(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=t,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(r,n,function(t){return e[t]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=3)}([function(e,t,o){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var n=r(o(6)),i=new Date;t.utils={getUrlVars:function(e){var t={};e.replace(/#.*?$/g,"").replace(/[?&]+([^=&]+)=([^&]*)/gi,(function(e,o,r){return t[o]=decodeURIComponent(r),e}));return t},Cookies:n.default,normalizeString:function(e){if("string"==typeof e){if(e.match(/^[a-zA-Z0-9-._$@'"()\[\]]{1,120}$/))return e;for(var t="ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž",o={},r=0;r<t.length;r++)o[t.charAt(r)]="AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz".charAt(r);return e=(e=(e=(e=e.replace(new RegExp("["+t+"]","g"),(function(e){return void 0!==o[e]?o[e]:e}))).replace(/[^a-zA-Z0-9-._$@'"()\[\] ]/g,"")).replace(/\s+/g,"-")).slice(0,120)}},parseUrlParts:function(e){var t=document.createElement("a");return t.href=e,t},onDomReady:function(e){"loading"!=document.readyState?e():document.addEventListener("DOMContentLoaded",e)},dispatchEvent:function(e,t){var o;t=t||document,"function"==typeof Event?o=new Event(e):(o=document.createEvent("Event")).initEvent(e,!0,!0),t.dispatchEvent(o)},areReferrerAndLocationEqual:function(e){try{var o="";if(/^https?:\/\//.test(e))o=t.utils.parseUrlParts(e).origin;return o===location.origin}catch(e){return!1}},getElapsedMS:function(){return(new Date).getTime()-i.getTime()}}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){this.debug=!1,this.logSuccessMessages=!0}return e.prototype.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.debug&&console&&console.log&&console.log.apply(this,e)},e.prototype.success=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.logSuccessMessages&&console&&console.log&&console.log.apply(this,e)},e.prototype.alwaysLog=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];console.log.apply(this,e)},e}();t.default=r,t.logger=new r},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=o(1),n=o(0),i=function(){function e(){}return e.encode=function(e){return"function"==typeof btoa?btoa(e):e},e.decode=function(e){return"function"==typeof atob?atob(e):e},e.getDecodedCookieValue=function(){var t=n.utils.Cookies.get(e.cookie_name);if(t)try{var o=JSON.parse(e.decode(t));return"object"==typeof o?o:{}}catch(o){r.logger.log("Error parsing cookie",e.cookie_name,t,o)}return{}},e.saveToCookie=function(t){var o=e.encode(JSON.stringify(t));n.utils.Cookies.set(e.cookie_name,o,{expires:e.cookie_duration}),r.logger.log("Save to cookie",e.cookie_name,t)},e.get=function(t){var o=e.getDecodedCookieValue();return void 0!==o[t]?o[t]:null},e.set=function(t,o){var r=e.getDecodedCookieValue();r[t]=o,e.saveToCookie(r)},e.delete=function(t){var o=e.getDecodedCookieValue();delete o[t],e.saveToCookie(o)},e.clear=function(){e.saveToCookie({})},e.cookie_name="_AccorTrackingDecoratorData",e.cookie_duration=30,e}();t.Store=i},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=o(4),n=o(8),i=o(2),a=o(0),c=new n.Namespace,s=new r.Decorator(c);c.set("decorateUrl",(function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return s.decorateURL.apply(s,e)})),c.set("decorateObject",(function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return s.decorateObject.apply(s,e)})),c.set("decorateAll",(function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return s.decorateAll.apply(s,e)})),c.set("decorator",s),c.set("Store",i.Store),c.set("utils",a.utils),s.config.autoDecorate&&s.autoDecorate()},function(e,t,o){"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(e){for(var t,o=1,r=arguments.length;o<r;o++)for(var n in t=arguments[o])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0});var n=o(5),i=o(1),a=o(7),c=o(0),s=o(2),u=function(){function e(e){this.namespace=e,this.initConfig(),i.logger.log("AccorTrackingDecorator config",this.config),this.initParameters()}return e.prototype.decorateURL=function(e,t){void 0===t&&(t={});var o=c.utils.parseUrlParts(e);if(!o.hostname||""===o.hostname)return e;var r=c.utils.getUrlVars(e);r=this.decorateObject(r,t);var n=[];for(var i in r)r.hasOwnProperty(i)&&!1!==r[i]&&null!==r[i]&&"string"==typeof r[i]&&n.push(encodeURIComponent(i)+"="+encodeURIComponent(r[i]));if(n.length>0){var a=/^\//.test(o.pathname)?o.pathname:"/"+o.pathname;e=o.protocol+"//"+o.hostname+a+"?"+n.join("&")+(o.hash||"")}return e},e.prototype.decorateObject=function(e,t){if(void 0===t&&(t={}),"object"!=typeof e||null===e)return e;var o=r(r({},this.trackingParams),t);for(var n in o)o.hasOwnProperty(n)&&(e[n]=o[n]);return this.config.postDecorateCallback(e)},e.prototype.autoDecorate=function(){var e=this,t=!1;document.addEventListener("accor_tracking_params_available",(function(){t||(t=!0,setTimeout((function(){return e.decorateAll()}),300))}))},e.prototype.decorateAll=function(){i.logger.log("decorateAll");for(var e=document.getElementsByTagName("a"),t=0,o=function(o){var n=e[o],a=n.getAttribute("href");if(null!==a){var s=c.utils.parseUrlParts(a).hostname.toLowerCase();if(r.config.domainsToDecorate.map((function(e){return e.test(s)})).some((function(e){return e}))){var u=r.decorateURL(a);i.logger.log("Autodecorate",a,u),n.setAttribute("href",u),t++}}},r=this,n=0;n<e.length;n++)o(n);t>0&&i.logger.success("Successfully decorated "+t+" links with parameters",this.decorateObject({}))},e.prototype.initConfig=function(){var e=this.namespace.getConfig("postDecorateCallback");if(this.config={merchantid:this.namespace.getConfig("merchantid")||"",hotelID:this.namespace.getConfig("hotelID")||"",autoDecorate:!!this.namespace.getConfig("autoDecorate"),debug:!!this.namespace.getConfig("debug")||-1!==location.href.indexOf("forceAccorTrackingDecoratorDebug"),handleGoogleAnalytics:!1!==this.namespace.getConfig("handleGoogleAnalytics"),testReferrer:this.namespace.getConfig("testReferrer")||"",domainsToDecorate:this.namespace.getConfig("domainsToDecorate")||[/^all\.accor\.com$/,/accorhotels.com$/],isBrandSite:this.namespace.getConfig("isBrandSite")||!1,brandName:this.namespace.getConfig("brandName")||"",dontLogSuccessMessages:!!this.namespace.getConfig("dontLogSuccessMessages"),postDecorateCallback:"function"==typeof e?e:function(e){return e}},i.logger.debug=this.config.debug,i.logger.logSuccessMessages=!this.config.dontLogSuccessMessages,this.namespace.set("logger",i.logger),this.config.hotelID=this.config.hotelID.toUpperCase(),""===this.config.hotelID&&""!==this.config.merchantid){var t=this.config.merchantid.match(/^MS-([A-Z0-9]+)$/);t&&2==t.length&&(this.config.hotelID=t[1],i.logger.log("hotelID was empty, deriving it from merchantid: ",this.config.hotelID))}""===this.config.merchantid&&(i.logger.log("config.merchantid is empty!"),""!==this.config.hotelID&&(this.config.merchantid="MS-"+this.config.hotelID,i.logger.log("Using hotelID to set merchantid",this.config.merchantid)))},e.prototype.initParameters=function(){var e=this;this.config.isBrandSite?this.trackingParams={merchantid:this.config.merchantid}:this.trackingParams={utm_source:"hotelwebsite_"+this.config.hotelID,utm_campaign:"hotel_website_search",utm_medium:"accor_regional_websites",merchantid:this.config.merchantid},this.config.handleGoogleAnalytics?n.detectGAParameters((function(t){e.trackingParams.gacid=t.gacid,e.trackingParams._ga=t._ga}),this.namespace.source):setTimeout((function(){return c.utils.dispatchEvent("accor_tracking_params_available")}),150);var t=""!==this.config.testReferrer?this.config.testReferrer:document.referrer,o=a.Attribution.detectAttributonFromReferrer(t);o.merchantid=o.merchantid||this.trackingParams.merchantid;var r={sourceid:s.Store.get("sourceid"),merchantid:s.Store.get("merchantid")};i.logger.log("Are referrer and location equal ?",c.utils.areReferrerAndLocationEqual(t));var u=a.Attribution.getScore(o),l=a.Attribution.getScore(r);i.logger.log("Attribution data detected from current URL, Referrer and configuration = ",o),i.logger.log("Stored Attribution data (from previous visits if any) = ",r),i.logger.log("Attribution score of current URL/referrer = ",u,"Attribution Score of stored data = ",l),u>=l&&!c.utils.areReferrerAndLocationEqual(t)&&(s.Store.set("sourceid",o.sourceid),s.Store.set("merchantid",o.merchantid),i.logger.success("New sourceid and/or merchantid",o.sourceid,o.merchantid)),this.trackingParams.sourceid=s.Store.get("sourceid"),this.trackingParams.merchantid=s.Store.get("merchantid"),this.config.handleGoogleAnalytics||c.utils.dispatchEvent("accor_tracking_params_available")},e}();t.Decorator=u},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=o(1),n=o(0);t.detectGAParameters=function(e,t){void 0===t&&(t=window),t.AccorBooking_GUA_ClientId=!1,t.AccorBooking_GUA_linkerParam=!1;var o={gacid:!1,_ga:!1},i=0,a=!1,c=function(){if(i++,void 0!==t.ga){if(void 0!==s&&void 0!==t.AccorBooking_GUA_ClientId&&""!=t.AccorBooking_GUA_ClientId&&void 0!==t.AccorBooking_GUA_linkerParam&&""!=t.AccorBooking_GUA_linkerParam||i>4e3)return i>4e3&&r.logger.log("Google Analytics decorator failed after 10 minutes"),void clearInterval(s);a||(a=!0,setTimeout((function(){t.ga((function(){a=!1;var i=-1!==location.href.indexOf("useSecondTrackerToDecorate")?1:0,c=t.ga.getAll();if(void 0!==c[i]){var s=c[i].get("clientId");t.AccorBooking_GUA_ClientId=s,o.gacid=s,r.logger.success("Detected clientID (gacid): "+s);var u=c[i].get("linkerParam");if(u){var l=u.split("=");l.length>1?(u=l[1],t.AccorBooking_GUA_linkerParam=u,o._ga=u,r.logger.success("Detected linker param (_ga): "+u),r.logger.log("Detected GA parameters after (ms): ",n.utils.getElapsedMS())):r.logger.log("WARN likerParam format Error",u)}else r.logger.log("WARN no linkerParam");n.utils.dispatchEvent("accor_tracking_params_available"),e(o)}else r.logger.log("WARN trackers["+i+"] undefined")}))}),10))}};c();var s=setInterval(c,150);setTimeout((function(){void 0!==s&&(r.logger.log("giving up GA params detection"),clearInterval(s),n.utils.dispatchEvent("accor_tracking_params_available"),e(o))}),6e5)}},function(e,t,o){var r,n;
/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */!function(i){if(void 0===(n="function"==typeof(r=i)?r.call(t,o,t,e):r)||(e.exports=n),!0,e.exports=i(),!!0){var a=window.Cookies,c=window.Cookies=i();c.noConflict=function(){return window.Cookies=a,c}}}((function(){function e(){for(var e=0,t={};e<arguments.length;e++){var o=arguments[e];for(var r in o)t[r]=o[r]}return t}function t(e){return e.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}return function o(r){function n(){}function i(t,o,i){if("undefined"!=typeof document){"number"==typeof(i=e({path:"/"},n.defaults,i)).expires&&(i.expires=new Date(1*new Date+864e5*i.expires)),i.expires=i.expires?i.expires.toUTCString():"";try{var a=JSON.stringify(o);/^[\{\[]/.test(a)&&(o=a)}catch(e){}o=r.write?r.write(o,t):encodeURIComponent(String(o)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=encodeURIComponent(String(t)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var c="";for(var s in i)i[s]&&(c+="; "+s,!0!==i[s]&&(c+="="+i[s].split(";")[0]));return document.cookie=t+"="+o+c}}function a(e,o){if("undefined"!=typeof document){for(var n={},i=document.cookie?document.cookie.split("; "):[],a=0;a<i.length;a++){var c=i[a].split("="),s=c.slice(1).join("=");o||'"'!==s.charAt(0)||(s=s.slice(1,-1));try{var u=t(c[0]);if(s=(r.read||r)(s,u)||t(s),o)try{s=JSON.parse(s)}catch(e){}if(n[u]=s,e===u)break}catch(e){}}return e?n[e]:n}}return n.set=i,n.get=function(e){return a(e,!1)},n.getJSON=function(e){return a(e,!0)},n.remove=function(t,o){i(t,"",e(o,{expires:-1}))},n.defaults={},n.withConverter=o,n}((function(){}))}))},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=o(0),n=o(1),i=function(){function e(){}return e.getScore=function(e){var t=!!e.sourceid&&!!e.merchantid;return t&&(/^(ppc-|dis-|sop-)/.test(e.merchantid)||this.isRetargetingMerchant(e.merchantid))?3:t||/^(ml-)/.test(e.sourceid)?2:1},e.detectAttributonFromReferrer=function(e){var t,o=r.utils.getUrlVars(this.getCurrentURL()),i=o.sourceid||null,a=o.merchantid||null,c=!!i&&!!a,s=(o.utm_source||"")+"_"+(o.utm_medium||"")+"_"+(o.utm_campaign||""),u=!!o.utm_source&&s||o.dclid&&"dclid"||o.gclid&&"gclid"||null,l=this.detectReferrer(e),g="Direct_Access";return c||/^(ml-)/.test(i)?(g=i,t=a,n.logger.log("sourceid from sourceid url parameter",g),n.logger.log("merchantid from merchantid url parameter",t)):u?(g="UTM_"+u,n.logger.log("sourceid from utm|dclid|gclid in url",g)):null!==l&&(g=l.category+"_"+l.name,n.logger.log("sourceid from referrer",g)),{sourceid:g=r.utils.normalizeString(g),merchantid:t=!!t&&r.utils.normalizeString(t)}},e.detectReferrer=function(t){if(""===t||0===t.toLowerCase().indexOf(e.getOrigin()))return null;var o={SOCIAL:{FACEBOOK:/^https?:\/\/((www|l)\.)?facebook\.com\/.*$/i,QZONE:/^https?:\/\/[a-z0-9.]+qzone\.qq\.com(\/.*)?$/i,QQ:/^https?:\/\/([a-z]+\.)?qq\.com(\/.*)?$/i,INSTAGRAM:/^https?:\/\/(www\.)?instagram\.com\/.*$/i,TUMBLR:/^https?:\/\/(www\.|[a-zA-Z0-9-_\.]+)?tumblr\.com\/.*$/i,TWITTER:/^https?:\/\/(www\.)?twitter\.com\/.*$/i,BAIDU:/^https?:\/\/(www\.)?tieba\.baidu\.com\/.*$/i,WEIBO:/^https?:\/\/(www\.)?weibo\.com\/.*$/i,SNAPCHAT:/^https?:\/\/(www\.)?snapchat\.com\/.*$/i,VKONTAKTE:/^https?:\/\/(www\.)?vk\.com\/.*$/i,PINTEREST:/^https?:\/\/(www\.)?pinterest\.com\/.*$/i,LINKEDIN:/^https?:\/\/(www\.)?linkedin\.com\/.*$/i,REDDIT:/^https?:\/\/(www\.)?reddit\.com\/.*$/i},SEO:{GOOGLE:/^https?:\/\/(www\.)?google\.[a-z.]+(\/.*)?$/i,BING:/^https?:\/\/(www\.)?bing\.com\/.*$/i,YAHOO:/^https?:\/\/([a-z.]+)?yahoo\.(com|co.jp)(\/.*)?$/i,BAIDU:/^https?:\/\/(www\.)?baidu\.com\/.*$/i,YANDEX:/^https?:\/\/(www\.)?yandex\.(com|ru)(\/.*)?$/i,DUCKDUCKGO:/^https?:\/\/(www\.)?duckduckgo\.com(\/.*)?$/i,ASK:/^https?:\/\/([a-z]+\.)?ask\.com(\/.*)?$/i,AOL:/^https?:\/\/(search\.aol|aol|www\.aol|www\.aolsearch)\.com(\/.*)?$/i,WOLFRAMALPHA:/^https?:\/\/(www\.)?wolframalpha\.com(\/.*)?$/i,ARCHIVE:/^https?:\/\/([a-z]+\.)?archive\.org(\/.*)?$/i}};for(var r in o)if(o.hasOwnProperty(r)){var i=o[r];for(var a in i){if(i.hasOwnProperty(a))if(i[a].test(t))return n.logger.log("Detected known referrer",r,a),{category:r,name:a}}}return null},e.isRetargetingMerchant=function(e){for(var t=0,o=[/^RT-FR018143-.*$/,/^RT-MD054836-.*$/,/^RT-FR018149-.*$/,/^RT-FR018150-.*$/,/^RT-PC026193-.*$/,/^RT-MD115538-.*$/];t<o.length;t++){if(o[t].test(e))return!0}return!1},e.getOrigin=function(){return document.location.origin.toLowerCase()},e.getCurrentURL=function(){return document.location.href},e}();t.Attribution=i},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e){void 0===e&&(e=window),this.source=e,void 0===this.source._AccorTrackingDecorator&&(this.source._AccorTrackingDecorator={})}return e.prototype.get=function(e){return this.source._AccorTrackingDecorator[e]},e.prototype.set=function(e,t){this.source._AccorTrackingDecorator[e]=t},e.prototype.getConfig=function(e){var t=this.get("config");return void 0!==t&&void 0!==t[e]&&t[e]},e}();t.Namespace=r}]);