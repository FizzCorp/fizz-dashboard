var utils = require("../utils.js");
var beautify = utils.beautify;
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

function setupRemoteDependencies() {
	" git clone --depth 1 https://user:password@github.com/carameltec/Fizz-Custom/ -b branch_name"
}

function runner(dryRun, env, config) {
	beautify.log("Runner is running: ");
}

git clone --depth 1 "https://${GIT_USER}:${GIT_USER}@github.com/carameltec/Fizz-Custom/ -b ${BRANCH_NAME}"


if (require.main === module) {

	var branch = getCurrentBranch();
	beautify.printBanner(`Jenkins Runner → Dispatch Scripts → for → ${branch}`);

	var env = branch.replace("deploy_dashboard_", "");

	var config = require("./config/config")[env];
	if (!config) return beautify.log(`Deployment not allowed via '${branch}' branch`);
	beautify.log("Loaded Configuration: ")
	console.log(config);
	
	runner(dryRun, env);

} 


module.exports = runner;




/*
0. Get Environment by branch, then wrt environment


1. Setup Dependencies (in parallel)

	1. Setup Remote Dependencies
		1. Sandbox
			1. Clone Remote Repo
			2. cd devops/build_script
			3. Setup Fizz Stack (sh setup_local_stack.sh)

	--> Fizz Server Should be running now.


	2. Setup Dashboard Stack
		1. run container using Dockerfile that
			1. run a container for postgres
			2. run a container for node server
				1. This firstly installs dependencies, then run server


	3. Setup Tests Dependencies
		1. cd server/tests
		2. npm install
		3. 

2. Run Tests

4. TearDown stack and Build package (in parallel)

	1. Tear Fizz Stack
	2. Tear Dashboard Stack
	3. Build Package
	  1. cd client
	  2. npm install
		3. Build Package Zip


5. Deploy (Its not within script, within jenkins)




--> Respective package zip file Should exist now.


*/



// 