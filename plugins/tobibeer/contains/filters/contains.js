/*\
title: $:/plugins/tobibeer/contains/filters/contains.js
type: application/javascript
module-type: filteroperator

Filters input titles as to whether they (or their fields) contain
a value or any/all values specified in the operand

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export filter function
*/
exports.contains = function(source,operator,options) {
	var field,list,mode,
		all =true,
		titles = [],
		results = [],
		value = operator.operand;

	$tw.utils.each(
		(operator.suffix || "").split(" "),
		function(s) {
			if(s) {
				if(s.substr(0,1) === "$"){
					mode = s.substr(1);
				} else {
					field = s;
				}
			}
		}
	);
	value = mode ? $tw.utils.parseStringArray(value) : value;
	if(!field) {
		source(function(tiddler,title) {
			titles.push(title);
		});
	}
	switch(mode) {
		case "any":
			if(field) {
				source(function(tiddler,title) {
					list = options.wiki.getTiddlerList(title,field);
					$tw.utils.each(value,function(t) {
						if(list.indexOf(t) > -1) {
							results.push(title);
							return false;
						}
					});
				});
			} else {
				$tw.utils.each(value,function(t) {
					if(titles.indexOf(t) > -1) {
						results = titles;
						return false;
					}
				});
			}
			break;
		case "all":
			if(field) {
				source(function(tiddler,title) {
					list = options.wiki.getTiddlerList(title,field);
					all = true;
					$tw.utils.each(value,function(t) {
						all = all && list.indexOf(t) > -1;
						if(!all) {
							return false;
						}
					});
					if(all) {
						results.push(title);
					}
				});
			} else {
				$tw.utils.each(value,function(t) {
					all = all && titles.indexOf(t) > -1;
					if(!all) {
						return false;
					}
				});
				if(all) {
					results = titles;
				}
			}
			break;
		default:
			if(field) {
				source(function(tiddler,title) {
					list = options.wiki.getTiddlerList(title,field);
					if(list.indexOf(value) > -1) {
						results.push(title);
					}
				});
			} else {
				if(titles.indexOf(value) > -1) {
					results = titles;
				}
			}
	}
	return results;
};

})();