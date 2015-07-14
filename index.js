module.exports = function renderSelect(html, selectorAssociation, fn){

	// Render DOM
	var $container = document.createElement("div");
		$container.innerHTML = html;

	var selected = {};

	// Select selectors
	var element;
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

	// Detach from container
	selected.$ = document.createDocumentFragment();
	while( $container.firstChild ){
		selected.$.appendChild( $container.removeChild($container.firstChild) );
	}

	return selected;
};