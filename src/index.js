module.exports = function renderSelect(html, selectorAssociation, fn){
	/**
	 * @param {String} html - HTML string
	 * @param {Object} selectorAssociation - {selector: propertyName} map eg. { "#blueDiv": "blueDiv" }
	 * @param {Function} fn - Wrapper in case DOM should be wrapped eg. jQuery
	 * @return {Object} Object containing references to each selected element and the document fragment in $
	 */

	var domify = require("domify");

	// Render DOM
	var	$container = domify(html);

	// Select selectorsa
	var	selected = {},
		element;

	for( var selector in selectorAssociation ){

		// If not property or invalid selector
		if( !selectorAssociation.hasOwnProperty(selector) || selector.length === 0 ){ continue; }

		// If failed to select, ignore
		if( !(element = $container.querySelector(selector)) ){ continue; }

		// Reference
		if( typeof fn === "function" ){ element = fn(element); }

		// Store reference
		selected[ selectorAssociation[selector] ] = element;
	}

	selected.$ = $container;

	return selected;
};