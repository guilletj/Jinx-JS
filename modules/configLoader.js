const yaml = require('js-yaml')
const fs = require('fs');
let cfg;

try {
	console.log('Loading config...')
	cfg = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
	console.log('Config loaded successfully');
} catch (ex) {
	console.log('Failed to load config, exiting now...');
	process.exit(1);
}

exports.cfg = cfg;