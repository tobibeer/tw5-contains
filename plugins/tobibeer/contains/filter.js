/*\
title: $:/plugins/tobibeer/contains/filters.js
type: application/javascript
module-type: filteroperator

Filters input titles as to whether they (or their fields) contain
a value or any/all values specified in the operand

@preserve
\*/
(function(){"use strict";exports.contains=function(i,e,t){var f,n,u,s=true,r=[],l=[],a=e.operand||"",c=e.prefix==="!";$tw.utils.each((e.suffix||"").split(" "),function(i){if(i){if(i.substr(0,1)==="$"){u=i.substr(1)}else{f=i}}});a=u?$tw.utils.parseStringArray(a):a;if(!f){i(function(i,e){r.push(e)})}if(u&&a.length<1||!u&&!a){if(u==="exactly"){return c?r:[]}else{return c?[]:r}}else{switch(u){case"any":if(f){i(function(i,e){s=0;n=t.wiki.getTiddlerList(e,f);$tw.utils.each(a,function(i){if(n.indexOf(i)>-1){s=1;return false}});if(s&&!c||c&&!s){l.push(e)}})}else{s=0;$tw.utils.each(a,function(i){if(r.indexOf(i)>-1){s=1;return false}});if(s&&!c||c&&!s){l=r}}break;case"all":if(f){i(function(i,e){n=t.wiki.getTiddlerList(e,f);s=true;$tw.utils.each(a,function(i){s=s&&n.indexOf(i)>-1;if(!s){return false}});if(s&&!c||c&&!s){l.push(e)}})}else{$tw.utils.each(a,function(i){s=s&&r.indexOf(i)>-1;if(!s){return false}});if(s&&!c||c&&!s){l=r}}break;case"exactly":if(f){i(function(i,e){n=t.wiki.getTiddlerList(e,f);s=true;$tw.utils.each(a,function(i){s=s&&n.indexOf(i)>-1;if(!s){return false}});if(s){$tw.utils.each(n,function(i){s=s&&a.indexOf(i)>-1;if(!s){return false}})}if(s&&!c||c&&!s){l.push(e)}})}else{$tw.utils.each(a,function(i){s=s&&r.indexOf(i)>-1;if(!s){return false}});if(s){$tw.utils.each(r,function(i){s=s&&a.indexOf(i)>-1;if(!s){return false}})}if(s&&!c||c&&!s){l=r}}break;default:if(f){i(function(i,e){n=t.wiki.getTiddlerList(e,f);s=n.indexOf(a)>-1;if(s&&!c||c&&!s){l.push(e)}})}else{s=r.indexOf(a)>-1;if(s&&!c||c&&!s){l=r}}}}return l}})();