/*
release.js
 This builds artifact and deploys on respective environment.
 i.e.  DRY_RUN=<true|false> NODE_ENV=<qa|production> node ./release.js
*/

var build = require("./build.js");
var deploy = require("./deploy.js");
var config = require("./config/config.js").release;

var beautify = require("../utils.js").beautify;

var env = process.env.NODE_ENV;
var dryRun = (process.env.DRY_RUN + "").toLowerCase() === "true" || false;

function release(dry, env) {

	if (!env) return console.error("No environment specified");
	if (config.allowed_env.indexOf(env) === -1) return beautify.log(`${env} isn't a valid environment`);

	beautify.log("About to release ");

	build(dry, env);
	deploy(dry, env);

}



if (require.main === module) {

	beautify.printBanner("Releasing for Environment: → ", env);
	release(dryRun, env)

}

module.exports = release;