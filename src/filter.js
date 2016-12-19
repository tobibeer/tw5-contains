/*\
title: $:/plugins/tobibeer/contains/filters.js
type: application/javascript
module-type: filteroperator

Filters input titles as to whether they (or their fields) contain
a value or any/all values specified in the operand

@preserve
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export filter function
*/
exports.contains = function(source,operator,options) {
	var field,list,mode,ok=true,
		titles = [],
		results = [],
		value = operator.operand || "",
		not = operator.prefix === "!";

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
	if(
		mode && value.length < 1 ||
		!mode && !value
	) {
		if(mode === "exactly") {
			return not ? titles : [];
		} else {
			return not ? [] : titles;
		}
	} else {
		switch(mode) {
			case "any":
				if(field) {
					source(function(tiddler,title) {
						ok = 0;
						list = options.wiki.getTiddlerList(title,field);
						$tw.utils.each(value,function(t) {
							if(list.indexOf(t) > -1) {
								ok = 1;
								return false;
							}
						});
						if(ok && !not || not && !ok) {
							results.push(title);
						}
					});
				} else {
					ok = 0;
					$tw.utils.each(value,function(t) {
						if(titles.indexOf(t) > -1) {
							ok = 1;
							return false;
						}
					});
					if(ok && !not || not && !ok) {
						results = titles;
					}
				}
				break;
			case "all":
				if(field) {
					source(function(tiddler,title) {
						list = options.wiki.getTiddlerList(title,field);
						ok = true;
						$tw.utils.each(value,function(t) {
							ok = ok && list.indexOf(t) > -1;
							if(!ok) {
								return false;
							}
						});
						if(ok && !not || not && !ok) {
							results.push(title);
						}
					});
				} else {
					$tw.utils.each(value,function(t) {
						ok = ok && titles.indexOf(t) > -1;
						if(!ok) {
							return false;
						}
					});
					if(ok && !not || not && !ok) {
						results = titles;
					}
				}
				break;
			case "exactly":
				if(field) {
					source(function(tiddler,title) {
						list = options.wiki.getTiddlerList(title,field);
						ok = true;
						$tw.utils.each(value,function(t) {
							ok = ok && list.indexOf(t) > -1;
							if(!ok) {
								return false;
							}
						});
						if(ok) {
							$tw.utils.each(list,function(t) {
								ok = ok && value.indexOf(t) > -1;
								if(!ok) {
									return false;
								}
							});
						}
						if(ok && !not || not && !ok) {
							results.push(title);
						}
					});
				} else {
					$tw.utils.each(value,function(t) {
						ok = ok && titles.indexOf(t) > -1;
						if(!ok) {
							return false;
						}
					});
					if(ok) {
						$tw.utils.each(titles,function(t) {
							ok = ok && value.indexOf(t) > -1;
							if(!ok) {
								return false;
							}
						});
					}
					if(ok && !not || not && !ok) {
						results = titles;
					}
				}
				break;
			default:
				if(field) {
					source(function(tiddler,title) {
						list = options.wiki.getTiddlerList(title,field);
						ok = list.indexOf(value) > -1;
						if(ok && !not || not && !ok) {
							results.push(title);
						}
					});
				} else {
					ok = titles.indexOf(value) > -1;
					if(ok && !not || not && !ok) {
						results = titles;
					}
				}
		}
	}
	return results;
};

})();