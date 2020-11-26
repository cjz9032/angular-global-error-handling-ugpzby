export function disableBackgroundNavigation(document) {
	const modalNodes = Array.from(document.querySelectorAll('dialog *'));

	// by only finding elements that do not have tabindex="-1" we ensure we don't
	// corrupt the previous state of the element if a modal was already open
	const nonModalNodes = document.querySelectorAll('body *:not(dialog):not([tabindex="-1"])');

	for (const node of nonModalNodes) {
		if (!modalNodes.includes(node)) {
			// save the previous tabindex state so we can restore it on close
			node._prevTabindex = node.getAttribute('tabindex');
			node.setAttribute('tabindex', -1);

			// tabindex=-1 does not prevent the mouse from focusing the node (which
			// would show a focus outline around the element). prevent this by disabling
			// outline styles while the modal is open
			// @see https://www.sitepoint.com/when-do-elements-take-the-focus/
			node.style.outline = 'none';
		}
	}
}

export function reEnableBackgroundNavigation(document) {
	const nonModalNodes = document.querySelectorAll('body *:not(dialog)');

	// restore or remove tabindex from nodes
	for (const node of nonModalNodes) {
		if (node._prevTabindex) {
			node.setAttribute('tabindex', node._prevTabindex);
			node._prevTabindex = null;
		} else {
			node.removeAttribute('tabindex');
		}
		node.style.outline = null;
	}
}
