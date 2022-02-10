module.exports = {

	runner: {
		env: {
			deploy_landing_qa: 'qa',
			deploy_landing_production: 'production'
		}
	},

	release: {
		allowed_env: ['qa', 'production']
	},


	build: {
		allowed_env: ['development', 'qa', 'production']
	},

	deploy: {
		buckets: {
			qa: 's3://<<FIZZ_TODO_YOUR_QA_LANDING_S3_BUCKET_URL_HERE>>',
			production: 's3://<<FIZZ_TODO_YOUR_PRODUCTION_LANDING_S3_BUCKET_URL_HERE>>'
		}
	}

}