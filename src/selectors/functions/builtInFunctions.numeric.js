import DoubleValue from '../dataTypes/DoubleValue';
import FloatValue from '../dataTypes/FloatValue';
import DecimalValue from '../dataTypes/DecimalValue';
import IntegerValue from '../dataTypes/IntegerValue';
import Sequence from '../dataTypes/Sequence';
import { castToType } from '../dataTypes/conversionHelper';

function contextItemAsFirstArgument (fn, dynamicContext) {
	return fn(dynamicContext, dynamicContext.contextItem);
}

function createValidNumericType (typedValue, transformedValue) {
	if (typedValue.instanceOfType('xs:integer')) {
		return Sequence.singleton(new IntegerValue(transformedValue));
	}
	if (typedValue.instanceOfType('xs:float')) {
		return Sequence.singleton(new FloatValue(transformedValue));
	}
	if (typedValue.instanceOfType('xs:double')) {
		return Sequence.singleton(new DoubleValue(transformedValue));
	}
	// It must be a decimal, only four numeric types
	return Sequence.singleton(new DecimalValue(transformedValue));

}

function fnAbs (_dynamicContext, sequence) {
	if (sequence.isEmpty()) {
		return sequence;
	}
	return createValidNumericType(sequence.value[0], Math.abs(sequence.value[0].value));
}

function fnCeiling (_dynamicContext, sequence) {
	if (sequence.isEmpty()) {
		return sequence;
	}
	return createValidNumericType(sequence.value[0], Math.ceil(sequence.value[0].value));
}

function fnFloor (_dynamicContext, sequence) {
	if (sequence.isEmpty()) {
		return sequence;
	}
	return createValidNumericType(sequence.value[0], Math.floor(sequence.value[0].value));
}

function fnNumber (_dynamicContext, sequence) {
	if (sequence.isEmpty()) {
		return Sequence.singleton(new DoubleValue(NaN));
	}
	try {
		return Sequence.singleton(castToType(sequence.value[0], 'xs:double'));
	} catch (error) {
		if (error.message.includes('FORG0001')) {
			return Sequence.singleton(new DoubleValue(NaN));
		}
		throw error;
	}
}

function xsFloat (_dynamicContext, sequence) {
	if (sequence.isEmpty()) {
		return sequence;
	}
	return Sequence.singleton(castToType(sequence.value[0], 'xs:float'));
}

function xsInteger (_dynamicContext, sequence) {
	if (sequence.isEmpty()) {
		return sequence;
	}
	return Sequence.singleton(castToType(sequence.value[0], 'xs:integer'));
}

function xsDecimal (_dynamicContext, sequence) {
	if (sequence.isEmpty()) {
		return sequence;
	}
	return Sequence.singleton(castToType(sequence.value[0], 'xs:decimal'));
}


function xsDouble (_dynamicContext, sequence) {
	if (sequence.isEmpty()) {
		return sequence;
	}
	return Sequence.singleton(castToType(sequence.value[0], 'xs:double'));
}

export default {
	declarations: [
		{
			name: 'abs',
			argumentTypes: ['xs:numeric?'],
			returnType: 'xs:numeric?',
			callFunction: fnAbs
		},

		{
			name: 'ceiling',
			argumentTypes: ['xs:numeric?'],
			returnType: 'xs:numeric?',
			callFunction: fnCeiling
		},

		{
			name: 'floor',
			argumentTypes: ['xs:numeric?'],
			returnType: 'xs:numeric?',
			callFunction: fnFloor
		},

		{
			name: 'number',
			argumentTypes: ['xs:anyAtomicType?'],
			returnType: 'xs:double',
			callFunction: fnNumber
		},

		{
			name: 'number',
			argumentTypes: [],
			returnType: 'xs:double',
			callFunction: contextItemAsFirstArgument.bind(null, fnNumber)
		},

		{
			name: 'xs:float',
			argumentTypes: ['xs:anyAtomicType?'],
			returnType: 'xs:float?',
			callFunction: xsFloat
		},

		{
			name: 'xs:integer',
			argumentTypes: ['xs:anyAtomicType?'],
			returnType: 'xs:integer?',
			callFunction: xsInteger
		},

		{
			name: 'xs:decimal',
			argumentTypes: ['xs:anyAtomicType?'],
			returnType: 'xs:decimal?',
			callFunction: xsDecimal
		},

		{
			name: 'xs:double',
			argumentTypes: ['xs:anyAtomicType?'],
			returnType: 'xs:double?',
			callFunction: xsDouble
		}
	],
	functions: {
		number: fnNumber
	}
};
