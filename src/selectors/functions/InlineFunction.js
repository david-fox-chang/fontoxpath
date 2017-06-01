import Selector from '../Selector';
import Specificity from '../Specificity';
import Sequence from '../dataTypes/Sequence';
import FunctionValue from '../dataTypes/FunctionValue';

/**
 * @extends Selector
 */
class InlineFunction extends Selector {
	/**
	 * @param  {!Array<!Array<string>>}  paramDescriptions  An array of tuples of name and type of the parameters
	 * @param  {string}                returnType
	 * @param  {!Selector}              functionBody
	 */
	constructor (paramDescriptions, returnType, functionBody) {
		super(new Specificity({
			[Specificity.EXTERNAL_KIND]: 1
		}), Selector.RESULT_ORDERINGS.UNSORTED);

		this._paramDescriptions = paramDescriptions;
		this._returnType = returnType;
		this._functionBody = functionBody;
	}

	evaluate (dynamicContext) {
		/**
		 * @param   {../DynamicContext}           _unboundDynamicContext  The dynamic context at the moment of the function call
		 *                                                                  This shall not be used
		 * @param   {...!../dataTypes/Sequence}   parameters              The parameters of the function
		 * @return  {!../dataTypes/Sequence}      The result of the function call
		 */
		const executeFunction = (_unboundDynamicContext, ...parameters) => {
			// Since functionCall already does typechecking, we do not have to do it here
			const scopedDynamicContext = dynamicContext.createScopedContext({
					// TODO: should we pass contextItem / sequence? check spec
					contextItem: null,
					contextSequence: null,
					variables: this._paramDescriptions.reduce((paramByName, [name, _type], i) => {
						paramByName[name] = parameters[i];
						return paramByName;
					}, Object.create(null))
				});

				return this._functionBody.evaluate(scopedDynamicContext);
			};

		// TODO: bind this contextItem? check spec
		const functionItem = new FunctionValue({
			value: executeFunction,
			name: 'dynamic-function',
			argumentTypes: this._paramDescriptions.map(([_name, type]) => type),
			arity: this._paramDescriptions.length,
			returnType: this._returnType
		});
		return Sequence.singleton(functionItem);
	}
}

export default InlineFunction;