define([
	'./selectors/NodeNameSelector',
	'./selectors/NodeSpecSelector',
	'./selectors/Selector'
], function (
	NodeNameSelector,
	NodeSpecSelector,
	Selector
	) {
	'use strict';

	return function adaptNodeSpecToSelector (selectorOrNodeSpec) {
		switch (typeof selectorOrNodeSpec) {
			case 'string':
				return new NodeNameSelector(selectorOrNodeSpec);

			case 'object':
				if (Array.isArray(selectorOrNodeSpec)) {
					return new NodeNameSelector(selectorOrNodeSpec);
				}

				if (selectorOrNodeSpec instanceof Selector) {
					return selectorOrNodeSpec;
				}
				break;

			case 'function':
				return new NodeSpecSelector(selectorOrNodeSpec);
		}

		throw new Error('Argument is not a selector or node spec');
	};
});

