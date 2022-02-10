

var common = {
	FIZZ_REPO_URL: "<<FIZZ_TODO_YOUR_DASHBOARD_GIT_URL_HERE>>"
};

var config = {

	qa: {
		FIZZ_SANDBOX_REPO_BRANCH: "deploy_sdkclient"
	},

	production: {
		FIZZ_SANDBOX_REPO_BRANCH: "deploy_sandbox"
	}

}

Object.assign(config.qa, common);
Object.assign(config.production, common);


module.exports = config;