PATH_PREFIX='../server' 
HASH="$(git log --pretty=format:'%h' -n 1)"
DATE=$(date +'%b-%d-%Y')
cd ../server

DEPLOYMENTS="$(ls -1 dashboard-*[$DATE]*)"
echo "${DEPLOYMENTS}"

filename="dashboard.zip"
#temp_name="${filename%.zip}.zip"

# if [[ -f $temp_name ]]; then
# 	digit=2
# 	while true; do
# 	    temp_name="${filename%.zip}[$digit].zip"
# 	    if [[ ! -f $temp_name ]]; then
# 	    	filename="$temp_name"
# 	        break
# 	    fi
# 	    digit=$(($digit + 1))
# 	done
# fi
#filename="$temp_name"

zip -r "$filename" .npmrc express.js newrelic.js controllers db public services validators package-lock.json package.json config.js constants.js server.js constraints.js .ebextensions