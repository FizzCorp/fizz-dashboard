/*
runner.js
 This releases wrt respective branch
 i.e.  DRY_RUN=true node ./runner.js
       DRY_RUN=false node ./runner.js
*/

var utils = require("../utils.js");
var beautify = utils.beautify;
// var build = require("./build.js");
var release = require("./release.js");
var config  = require("./config/config.js").runner;
var dryRun = (process.env.DRY_RUN + "").toLowerCase() === "true" || false;

const RUNNING_IN_DEVELOPMENT = (process.env.RUNNING_IN_DEVELOPMENT + "").toLowerCase() === "true" || false;


function getCurrentBranch() {
	if (RUNNING_IN_DEVELOPMENT) 
		return utils.execute("git rev-parse --abbrev-ref HEAD", "./", true).replace("\n", "");

	/* Works on jenkins server only */
	
	var branch = process.env.GIT_BRANCH;
	beautify.log("Local branch is ", branch);

	branch = branch.replace("origin/", "");
	beautify.log("To Search", branch);
	
	return branch;
}


function runner(dry, env) {

	
	beautify.log("Deployment started for ENV: →", env);
	beautify.log("Dry Run: →", dry);

	release(dry, env);

}


if (require.main === module) {

	var branch = getCurrentBranch();
	beautify.printBanner(`Jenkins Runner → Dispatch Scripts → for → ${branch}`);

	var env = config.env[branch];
	if (!env) return beautify.log(`Deployment not allowed via '${branch}' branch`);
	
	runner(dryRun, env);

} 


module.exports = runner;