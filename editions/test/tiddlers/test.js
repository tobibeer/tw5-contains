/*\
title: test-tobibeer/make-filter.js
type: application/javascript
tags: [[$:/tags/test-spec]]

Tests the make filter.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

describe("test contains filter", function() {

	// Create a wiki
	var wiki = new $tw.Wiki({
		shadowTiddlers: {
			"$:/shadow": {
				tiddler: new $tw.Tiddler({title: "$:/shadow"}),
			}
		}
		}),
		fakeWidget = {
			getVariable: function(v) {
				return v === 'currentTiddler' ? 'foo' : (v === 'not' ? 'foo bar not' : 'foo bar');
			}
		};
	wiki.addTiddler({
		title:"foo",
		list:"foo",
	});
	wiki.addTiddler({
		title:"bar",
		list:"foo bar",
	});
	wiki.addTiddler({
		title:"baz",
		list:"foo bar baz",
	});

	// Tests

	it("should  return input titles", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains[]] +[contains:$any[]] +[contains:$all[]] +[!contains:$exactly[]]"
		,fakeWidget).join(",")).toBe("foo,bar");
	});

	it("should return nothing when negated for empty value", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[!contains[]]"
		,fakeWidget).join(",")).toBe("");
	});
	it("should return nothing when negated with $any for empty value", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[!contains:$any[]]"
		,fakeWidget).join(",")).toBe("");
	});
	it("should return nothing when negated with $all for empty value", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[!contains:$all[]]"
		,fakeWidget).join(",")).toBe("");
	});
	it("should return nothing with $exactly for empty value", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:$exactly[]]"
		,fakeWidget).join(",")).toBe("");
	});

	it("should return nothing with $exactly for empty value", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:$exactly[]]"
		,fakeWidget).join(",")).toBe("");
	});

	it("title should contain value", function() {
		expect(wiki.filterTiddlers(
			"foo +[contains<currentTiddler>]"
		,fakeWidget).join(",")).toBe("foo");
	});

	it("title should not be returned when value negated", function() {
		expect(wiki.filterTiddlers(
			"foo +[!contains<currentTiddler>]"
		,fakeWidget).join(",")).toBe("");
	});

	it("multiple titles should contain value", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains<currentTiddler>]"
		,fakeWidget).join(",")).toBe("foo,bar");
	});

	it("no titles should be returned when value negated", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[!contains<currentTiddler>]"
		,fakeWidget).join(",")).toBe("");
	});


	it("input titles should contain $all", function() {
		expect(wiki.filterTiddlers(
			"foo bar baz +[contains:$all[foo bar]]"
		,fakeWidget).join(",")).toBe("foo,bar,baz");
	});

	it("input titles should not contain $all", function() {
		expect(wiki.filterTiddlers(
			"foo +[contains:$all[foo bar]]"
		,fakeWidget).join(",")).toBe("");
	});

	it("single word input titles should not contain multi word title", function() {
		expect(wiki.filterTiddlers(
			"foo bar baz +[contains[foo bar]]"
		,fakeWidget).join(",")).toBe("");
	});

	it("return input titles when negated and not containing $all", function() {
		expect(wiki.filterTiddlers(
			"foo and other +[!contains:$all[foo bar]]"
		,fakeWidget).join(",")).toBe("foo,and,other");
	});

	it("return input titles when !contain $all", function() {
		expect(wiki.filterTiddlers(
			"foo +[!contains:$all[foo bar]]"
		,fakeWidget).join(",")).toBe("foo");
	});


	it("input titles should contain $any", function() {
		expect(wiki.filterTiddlers(
			"foo bar baz +[contains:$any[foo bar]]"
		,fakeWidget).join(",")).toBe("foo,bar,baz");
	});

	it("input titles should contain $any even if some not", function() {
		expect(wiki.filterTiddlers(
			"foo bar baz +[contains:$any[foo bar baz mumble frotz gronk]]"
		,fakeWidget).join(",")).toBe("foo,bar,baz");
	});

	it("return nothing when negated and doesn't contain $any", function() {
		expect(wiki.filterTiddlers(
			"foo bar baz +[contains:$any[mumble]]"
		,fakeWidget).join(",")).toBe("");
	});

	it("return input titles when negated and doesn't contain $any", function() {
		expect(wiki.filterTiddlers(
			"foo bar baz +[!contains:$any[mumble]]"
		,fakeWidget).join(",")).toBe("foo,bar,baz");
	});


	it("input titles should contain $exactly", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:$exactly[foo bar]]"
		,fakeWidget).join(",")).toBe("foo,bar");
	});

	it("input titles should not contain $exactly", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:$exactly[foo]]"
		,fakeWidget).join(",")).toBe("");
	});

	it("input titles should contain some more $exactly", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:$exactly<test>]"
		,fakeWidget).join(",")).toBe("foo,bar");
	});

	it("input titles should not contain some more $exactly", function() {
		expect(wiki.filterTiddlers(
			"foo +[contains:$exactly<test>]"
		,fakeWidget).join(",")).toBe("");
	});

	it("return input titles when negated and not $exactly", function() {
		expect(wiki.filterTiddlers(
			"foo +[!contains:$exactly<test>]"
		,fakeWidget).join(",")).toBe("foo");
	});

	it("return nothing when negated and $exactly", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[!contains:$exactly<test>]"
		,fakeWidget).join(",")).toBe("");
	});


	it("should return input titles where list contains value", function() {
		expect(wiki.filterTiddlers(
			"[contains:list[bar]]"
		,fakeWidget).join(",")).toBe("bar,baz");
	});

	it("should return input titles where list !contains value", function() {
		expect(wiki.filterTiddlers(
			"[!contains:list[bar]]"
		,fakeWidget).join(",")).toBe("foo");
	});

	it("should return nothing where list doesn't contain value", function() {
		expect(wiki.filterTiddlers(
			"foo +[contains:list[bar]]"
		,fakeWidget).join(",")).toBe("");
	});

	it("should return only one item where list !contains value", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[!contains:list[bar]]"
		,fakeWidget).join(",")).toBe("foo");
	});


	it("should return input titles where list contains $all of one item", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:list $all[bar]]"
		,fakeWidget).join(",")).toBe("bar");
	});

	it("should return input titles where list contains $all of two items", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:list $all<test>]"
		,fakeWidget).join(",")).toBe("bar");
	});

	it("should return nothing when list doesn't contain $all", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:list $all<not>]"
		,fakeWidget).join(",")).toBe("");
	});

	it("should return input titles where list !contains $all of one item", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[!contains:list $all[bar]]"
		,fakeWidget).join(",")).toBe("foo");
	});

	it("should return input titles where list !contains $all of two items", function() {
		expect(wiki.filterTiddlers(
			"foo bar baz +[!contains:list $all<test>]"
		,fakeWidget).join(",")).toBe("foo");
	});

	it("should return all titles where list does !contain $all", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[!contains:list $all<not>]"
		,fakeWidget).join(",")).toBe("foo,bar");
	});


	it("should return input titles where list contains $any of one item", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:list $any[bar]]"
		,fakeWidget).join(",")).toBe("bar");
	});

	it("should return input titles where list contains $any of two items", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:list $any<test>]"
		,fakeWidget).join(",")).toBe("foo,bar");
	});

	it("should return nothing when list doesn't contain $any", function() {
		expect(wiki.filterTiddlers(
			"mumble frotz gronk +[contains:list $any<test>]"
		,fakeWidget).join(",")).toBe("");
	});

	it("should return input titles where list !contains $any of one item", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[!contains:list $any[bar]]"
		,fakeWidget).join(",")).toBe("foo");
	});

	it("should return input titles where list !contains $any of two items", function() {
		expect(wiki.filterTiddlers(
			"mumble foo bar +[!contains:list $any<test>]"
		,fakeWidget).join(",")).toBe("mumble");
	});

	it("should return all titles where list does !contain $any", function() {
		expect(wiki.filterTiddlers(
			"foo bar baz +[!contains:list $any[not]]"
		,fakeWidget).join(",")).toBe("foo,bar,baz");
	});


	it("should return input titles where list contains $exactly of one item", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:list $exactly[foo]]"
		,fakeWidget).join(",")).toBe("foo");
	});

	it("should return input titles where list contains $exactly two items", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[contains:list $exactly<test>]"
		,fakeWidget).join(",")).toBe("bar");
	});

	it("should return nothing when list doesn't contain $exactly", function() {
		expect(wiki.filterTiddlers(
			"foo baz +[contains:list $exactly<test>]"
		,fakeWidget).join(",")).toBe("");
	});

	it("should return input titles where list !contains $exactly one item", function() {
		expect(wiki.filterTiddlers(
			"foo bar +[!contains:list $exactly[foo]]"
		,fakeWidget).join(",")).toBe("bar");
	});

	it("should return input titles where list !contains $exactly two items", function() {
		expect(wiki.filterTiddlers(
			"mumble foo bar baz +[!contains:list $exactly<test>]"
		,fakeWidget).join(",")).toBe("mumble,foo,baz");
	});

	it("should return all titles where list does !contain $exactly", function() {
		expect(wiki.filterTiddlers(
			"foo bar baz +[!contains:list $exactly[foo]]"
		,fakeWidget).join(",")).toBe("bar,baz");
	});

});

})();