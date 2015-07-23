/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	// Attribute selector
	var ATT = "data-select";

	var domify = __webpack_require__(1);

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

			// If filter function is passed in, invoke it
			if( typeof fn === "function" ){ node = fn(node); }

			this[node.getAttribute(ATT)] = node;
		}

		this.$ = (typeof fn === "function") ? fn($container) : $container;
	};

	module.exports = function(html, fn) {
		return (new renderSelect(html, fn));
	};

	window.renderSelect = module.exports;

/***/ },
/* 1 */
/***/ function(module, exports) {

	
	/**
	 * Expose `parse`.
	 */

	module.exports = parse;

	/**
	 * Tests for browser support.
	 */

	var innerHTMLBug = false;
	var bugTestDiv;
	if (typeof document !== 'undefined') {
	  bugTestDiv = document.createElement('div');
	  // Setup
	  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
	  // Make sure that link elements get serialized correctly by innerHTML
	  // This requires a wrapper element in IE
	  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
	  bugTestDiv = undefined;
	}

	/**
	 * Wrap map from jquery.
	 */

	var map = {
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
	  // for script/link/style tags to work in IE6-8, you have to wrap
	  // in a div with a non-whitespace character in front, ha!
	  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
	};

	map.td =
	map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

	map.option =
	map.optgroup = [1, '<select multiple="multiple">', '</select>'];

	map.thead =
	map.tbody =
	map.colgroup =
	map.caption =
	map.tfoot = [1, '<table>', '</table>'];

	map.polyline =
	map.ellipse =
	map.polygon =
	map.circle =
	map.text =
	map.line =
	map.path =
	map.rect =
	map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

	/**
	 * Parse `html` and return a DOM Node instance, which could be a TextNode,
	 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
	 * instance, depending on the contents of the `html` string.
	 *
	 * @param {String} html - HTML string to "domify"
	 * @param {Document} doc - The `document` instance to create the Node for
	 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
	 * @api private
	 */

	function parse(html, doc) {
	  if ('string' != typeof html) throw new TypeError('String expected');

	  // default to the global `document` object
	  if (!doc) doc = document;

	  // tag name
	  var m = /<([\w:]+)/.exec(html);
	  if (!m) return doc.createTextNode(html);

	  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

	  var tag = m[1];

	  // body support
	  if (tag == 'body') {
	    var el = doc.createElement('html');
	    el.innerHTML = html;
	    return el.removeChild(el.lastChild);
	  }

	  // wrap map
	  var wrap = map[tag] || map._default;
	  var depth = wrap[0];
	  var prefix = wrap[1];
	  var suffix = wrap[2];
	  var el = doc.createElement('div');
	  el.innerHTML = prefix + html + suffix;
	  while (depth--) el = el.lastChild;

	  // one element
	  if (el.firstChild == el.lastChild) {
	    return el.removeChild(el.firstChild);
	  }

	  // several elements
	  var fragment = doc.createDocumentFragment();
	  while (el.firstChild) {
	    fragment.appendChild(el.removeChild(el.firstChild));
	  }

	  return fragment;
	}


/***/ }
/******/ ]);