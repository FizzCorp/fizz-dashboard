/*
deploy.js
 This builds respective artifact based on the environment.
 i.e. DRY_RUN=<true|false> NODE_ENV=<qa|production>  node deploy.js
*/

var config = require("./config/config.js").deploy;
var dryRun = (process.env.DRY_RUN + "").toLowerCase() === "true" || false;
var utils = require('../utils');
var beautify = utils.beautify;
var path = require('path');
var env = process.env.NODE_ENV;



function deploy(dry, env) {
	if (!env) return beautify.log("No environment specified");
	if (!config.buckets[env]) return beautify.log(`${env} isn't a valid environment`);

	beautify.log("Starting Deployment");

	var root = path.join( __dirname, '../../../');
	var source = path.join( root, 'server', 'public', "*" ); 
	var dest = config.buckets[env];
	var exclude = path.join(__dirname, "files.exclude");
	var delete_exclude = path.join(__dirname, "delete.exclude");
	var test = dry ? '--dry-run' : '';

	beautify.log("Root: ", root);
	beautify.log("Source: ", source);
	beautify.log("Dest: ", dest);
	beautify.log("Exclude: ", exclude);
	beautify.log("Delete Exclude: ", delete_exclude);
	beautify.log("Dry Run: ", dry);


	utils.deploy( source, dest, exclude, delete_exclude, test );

}



if (require.main === module) {

	beautify.printBanner("Deploying for Environment: → ", env);
	deploy(dryRun, env);
}


module.exports = deploy;
