const recast = require('recast');
const types = recast.types.namedTypes;
const babylon = require('@babel/parser');
const options = {
	sourceType: 'module',
	allowImportExportEverywhere: true,
	allowReturnOutsideFunction: true,
	startLine: 1,
	tokens: true,
	plugins: [
		'asyncGenerators',
		'bigInt',
		'classPrivateMethods',
		'classPrivateProperties',
		'classProperties',
		'decorators-legacy',
		'doExpressions',
		'dynamicImport',
		'exportDefaultFrom',
		'exportExtensions',
		'exportNamespaceFrom',
		'functionBind',
		'functionSent',
		'logicalAssignment',
		'importMeta',
		'nullishCoalescingOperator',
		'numericSeparator',
		'objectRestSpread',
		'optionalCatchBinding',
		'optionalChaining',
		['pipelineOperator', { proposal: 'minimal' }],
		'throwExpressions',
		'typescript',
	],
};

module.exports.parser = {
	parse: function (source) {
		return babylon.parse(source, options);
	},
};

export default (fileInfo, api) => {
	const j = api.jscodeshift;
	let statement;
	const template = j.template;
	statement = template.statement;

	let consoleCallExpression = j(fileInfo.source).find(j.CallExpression, {
		callee: {
			type: 'MemberExpression',
			object: { type: 'Identifier', name: 'console' },
		},
	});

	if (consoleCallExpression.length > 0) {
		api.stats('console count');
		api.report('found Console in this file!');
	}

	consoleCallExpression
		.filter((path) => types.ArrowFunctionExpression.check(path.parent.node))
		.replaceWith((path) => statement`{}`);

	consoleCallExpression
		.filter((path) => !types.ArrowFunctionExpression.check(path.parent.node))
		.remove();

	return consoleCallExpression.toSource({
		lineTerminator: fileInfo.source.includes('\r\n') ? '\r\n' : '\n',
	});
};
