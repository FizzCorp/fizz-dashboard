notAvailable=true
maxWait=180
currentWait=0
interval=5
url=${URL:=127.0.0.1:8081}
while [ ${notAvailable} ]
do
	if [ "${currentWait}" = "${maxWait}" ]
	then
		echo "MaxWait limit reached : ${maxWait}";
		echo "Could not connect to container through ip";
		echo "Aborting..";
		exit;
	fi
	
	sleep ${interval}
	currentWait=$((currentWait + ${interval}))
	/usr/bin/curl ${url};
	if [ "$?" = "7" ]; then 
		available=true;	  	
	else
		echo "Container is Available"		
		exit;
	fi   	
done

