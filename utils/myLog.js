exports.log = function(log) {
	console.log('\x1b[32m%s\x1b[0m', log)
}

exports.error = function(log) {
	console.error('\x1b[31m%s\x1b[0m', log)
}
