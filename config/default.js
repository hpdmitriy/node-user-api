const path = require('path');

const root = process.cwd();

module.exports = {
	secret:   'test',
	mongoose: {
		uri:     'mongodb://localhost/test',
		options: {
			server: {
				socketOptions: {
					keepAlive: 1
				},
				poolSize: 5
			}
		}
	},
	root: root
};
