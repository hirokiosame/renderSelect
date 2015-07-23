
'use strict';

// Attribute selector
var ATT = "data-select";

var domify = require("domify");

function replaceArrWith(arrNodes, newNode) {

	var newNodes;
	if( newNode instanceof DocumentFragment ){
		newNodes = [].slice.apply(newNode.childNodes);
	}

	// Replace first
	var oldNode = arrNodes.shift();
		oldNode.parentNode.replaceChild(newNode, oldNode);

	// Unrender
	while( oldNode = arrNodes.shift() ){
		oldNode.parentNode.removeChild(oldNode);
	}

	[].push.apply(arrNodes, newNodes ? newNodes : [newNode]);
}

function generateSetGet(commentNode) {

	// Inherit these methods instead!
	var methods = {
		nodes: [commentNode],
		addClass: null,
		removeClass: null,
		text: function(str) {
			replaceArrWith(this.nodes, document.createTextNode(str));
		},
		html: function(str){
			replaceArrWith(this.nodes, renderHTML([], str));
		},
		place: function(templateObj){
			replaceArrWith(this.nodes, templateObj.$);
		}
	};

	return {
		set: function(value) {
			if( value instanceof renderSelect ){
				methods.place(value);
			}else{
				methods.text(value);
			}
		},
		get: function() { return methods; }
	};
}

function renderSelect(html, fn){

	// Convert handlebars to comments
	html = html.replace(/{{/g, '<!--').replace(/}}/g, '-->').replace(/^\s+|\s+$/g, '');

	// Render DOM
	var	$container = domify(html),
		selected = $container.querySelectorAll("[" + ATT + "]"),
		node;

	// Iterate over comment nodes
	var fragTree = document.createTreeWalker($container, NodeFilter.SHOW_COMMENT);

	while( fragTree.nextNode() ){
		Object.defineProperty(
			this,
			fragTree.currentNode.nodeValue,			// Label in comment
			generateSetGet(fragTree.currentNode)	// Methods to replace the comment placeholder DOM with
		);
	}

	// Iterate over selected
	for( var i = 0; i < selected.length; i++ ){

		node = selected[i];

		this[node.getAttribute(ATT)] = (typeof fn === "function") ? fn(node) : node;
	}

	this.$ = (typeof fn === "function") ? fn($container) : $container;
};

module.exports = function(html, fn) {
	return (new renderSelect(html, fn));
};

window.renderSelect = module.exports;