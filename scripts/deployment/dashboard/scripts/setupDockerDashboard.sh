NETWORK=dashboard-network
DASHBOARD_PG_HOST=pghost
SERVER_CONTAINER=dashboard-server

#docker network create ${NETWORK}



wait


(
cd server ; 
#docker build -t ${SERVER_CONTAINER} .

CMD="docker run -d --net ${NETWORK} --name ${DASHBOARD_PG_HOST} -e POSTGRES_USER=fizz -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=fizz_dashboard_testing -p 5432:5432 postgres:9.3";
echo "$CMD";
eval $CMD;

#Give docker some time to setup, else next command will fail.
sleep 15;

CMD="docker run -d --net ${NETWORK} -p 8081:8081 -e DB_HOST=${DASHBOARD_PG_HOST} ${SERVER_CONTAINER}";
echo "$CMD";
eval $CMD;


)