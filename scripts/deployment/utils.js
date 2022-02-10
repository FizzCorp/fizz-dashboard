var sys = require('util')
var exec = require('child_process').execSync;
var ROOT_DIRECTORY = __dirname + '/..';

function execute ( command, cwd, out ) {
	if ( out )
		return cwd ? exec(command, {cwd: cwd}).toString() : exec(command).toString();			
	else if ( cwd )
		return exec(command, {stdio: 'inherit', cwd: cwd})	
	else
		exec(command, {stdio: 'inherit'})	
}

function deploy ( source, destination, uploadExclude, deleteExclude, test ) {

	var uploadCommand = "s3cmd sync -r " + test + " --no-mime-magic --guess-mime-type --exclude-from " + uploadExclude + " " + source + " " + destination;
	var deleteRemovedCommand = "";

	if ( deleteExclude )
		deleteRemovedCommand = "s3cmd sync -r " + test + " --delete-removed --exclude-from " + deleteExclude + " " + source + " " + destination;
	else
		deleteRemovedCommand = "s3cmd sync -r " + test + " " + source + " " + destination;

	// console.log(uploadCommand);
	// console.log(deleteRemovedCommand);


	console.log("  --> Uploading files\n");
	try {
		execute(uploadCommand);
	} catch (e) {
		console.log("Error In Deployment to : ", destination);
		console.log("Error Command : ", uploadCommand);
		console.log("Errors:", JSON.stringify(e));
		return e;
	} 

	console.log("  --> Syncing everything else\n");
	try {
		execute(deleteRemovedCommand);		
	} catch (e) {
		console.log("Error In Syncing Removed Files from : ", destination);
		console.log("Error Command : ", deleteRemovedCommand);
		console.log("Errors : ", JSON.stringify(e));
		return e;
	} 

	console.log("\n  ====== Successfully deployed to [", destination, "] ======\n");
	return null;

	console.log("Skipping Deployment..");
	return null;
	
}

var beautify = {
	printBanner() {
		var args =  Array.prototype.slice.call(arguments);
		console.log("__________________________________________________________________________________", "\n");
		console.log("\t\t", args.join(" "));
		console.log("__________________________________________________________________________________", "\n");
	},
	log(text) {
		var args = Array.prototype.slice.call(arguments);
		console.log("→\t", args.join(" "));
	}
}

module.exports = {
	beautify: beautify,
	execute: execute,
	deploy: deploy
}