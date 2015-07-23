
'use strict';

// Attribute selector
var ATT = "data-select";

var domify = require("domify");

function renderSelect(html, fn){

	// Convert handlebars to comments
	html = html.replace(/{{/g, '<!--').replace(/}}/g, '-->').replace(/^\s+|\s+$/g, '');

	// Render DOM
	var	$container = domify(html),
		selected = $container.querySelectorAll("[" + ATT + "]"),
		node, att;

	// Iterate over comment nodes
	var fragTree = document.createTreeWalker($container, NodeFilter.SHOW_COMMENT);

	while( fragTree.nextNode() ){

		att = fragTree.currentNode.nodeValue;

		if( this.hasOwnProperty(att) ){ throw new Error("Selected already"); }

		this[att] = fragTree.currentNode;
	}

	// Iterate over selected
	for( var i = 0; i < selected.length; i++ ){

		node = selected[i];
		att = node.getAttribute(ATT);

		if( this.hasOwnProperty(att) ){ throw new Error("Selected already"); }

		this[att] = (typeof fn === "function") ? fn(node) : node;
	}

	this.$ = (typeof fn === "function") ? fn($container) : $container;
};

module.exports = function(html, fn) {
	return (new renderSelect(html, fn));
};

// window.renderSelect = module.exports;