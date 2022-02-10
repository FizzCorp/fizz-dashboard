/*
build.js
 This builds respective artifact based on the environment.
 i.e. DRY_RUN=true  NODE_ENV=qa node build.js
      DRY_RUN=false NODE_ENV=qa node build.js
*/

var path = require("path");
var utils = require("../utils.js");
var config = require("./config/config.js").build;
var beautify = utils.beautify;
var env = process.env.NODE_ENV;
var dryRun = (process.env.DRY_RUN + "").toLowerCase() === "true" || false;



function build(dry, env) {
	if (!env) return console.error("No environment specified");
	if (config.allowed_env.indexOf(env) === -1) return beautify.log(`${env} isn't a valid environment`);

	console.log("\n");
	beautify.log("About to Build");

	var command = `rm -rf ../server/public && NODE_ENV=build_landing_${env} npm run webpack`;
	
	beautify.log("Running: ", command);

	if (!dry) {
		var cwd = path.join(__dirname, "..", "..", "..", "client");
		utils.execute(command, cwd);
	}

	console.log("\n");
	
}



if (require.main === module) {

	beautify.printBanner("Building for Environment: → ", env);
	build(dryRun, env)

}


module.exports = build;


