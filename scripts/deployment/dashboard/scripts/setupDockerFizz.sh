#!/bin/sh

#BRANCH_NAME=server-chat-development
#BRANCH_NAME=${VARIABLE:-server-chat-development}
BRANCH_NAME=${FIZZ_BRANCH_NAME}

(
cd scripts/deployment/dashboard/scripts/ ;
rm -rf deps ;
[ -d deps ] || mkdir deps
cd deps
[ -d Fizz-Custom ] || git clone --depth 1 https://${GIT_USER}:${GIT_PASSWORD}@github.com/carameltec/Fizz-Custom.git -b ${BRANCH_NAME}

	cd Fizz-Custom;
	sh mobileServer/devops/build_scripts/setup_build_scripts.sh
	chmod +x mobileServer/devops/build_scripts/setup_local_stack.sh;
	sh mobileServer/devops/build_scripts/setup_local_stack.sh Caramel pass fizz_db;
	ls
)