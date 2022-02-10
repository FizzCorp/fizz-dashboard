NORMAL=$(tput sgr0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2; tput bold)
YELLOW=$(tput setaf 3)
CYAN=$(tput setaf 6)

function red() {
  echo -e "$RED$*$NORMAL"
}

function green() {
  echo -e "$GREEN$*$NORMAL"
}

function yellow() {
  echo -e "$YELLOW$*$NORMAL"
}

function cyan() {
  echo -e "$CYAN$*$NORMAL"
}

SITE_DIR='server/public/*' 
SITE_DIRECTORY='server/public/' 
STATIC_TEXT_DIRECTORY='client/app/landing/static_text'
BUCKET=s3://footest.fizz.io
EXCLUDE_FILE_PATH=scripts/files.exclude
DELETE_EXCLUDE_FILE_PATH=scripts/delete.exclude
TEST="$2"

if [ "$1" = "" ] 
then
  BUCKET="s3://footest.fizz.io"
else
  BUCKET="s3://$1"
fi

set -e

current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

yellow "  Branch : $current_branch"

if [ "$current_branch" = "deploy_landing" ]
then
  cyan "\t   Building Site ..."
  cyan "\t   Successfully generated site"
  cyan "\t   TEST : $TEST"
  cyan "\t   BUCKET : $BUCKET"

  read -p "  You're make a new deployment of fizz landing page, is that what you intended? [y|n] " -n 1 -r < /dev/tty
  echo
  if echo $REPLY | grep -E '^[Yy]$' > /dev/null
  then
    echo -e "\t Site is going live with new changes"

    yellow '--> Uploading files'
    # s3cmd sync --no-mime-magic --guess-mime-type --exclude '*.*' --include '*.js.gz' --add-header='Content-Type: application/javascript' --add-header='Content-Encoding: gzip' $SITE_DIR $BUCKET
    # s3cmd sync --no-mime-magic --guess-mime-type --exclude '*.*' --include '*.css.gz' --add-header='Content-Type: text/css' --add-header='Content-Encoding: gzip' $SITE_DIR $BUCKET
    # s3cmd sync --no-mime-magic --guess-mime-type --exclude '*.*' --include '*.svg.gz' --add-header='Content-Type: image/svg+xml' --add-header='Content-Encoding: gzip' $SITE_DIR $BUCKET
      # s3cmd sync --no-mime-magic --guess-mime-type --exclude '*.*' --include '*.gz' --add-header='Content-Encoding: gzip' $SITE_DIR $BUCKET
    # s3cmd del $TEST $BUCKET/*
    s3cmd sync $TEST --recursive --no-mime-magic --guess-mime-type --exclude-from $EXCLUDE_FILE_PATH $SITE_DIR $STATIC_TEXT_DIRECTORY $BUCKET

      # s3cmd sync --recursive --exclude-from $EXCLUDE_FILE_PATH $SITE_DIR $STATIC_TEXT_DIR --add-header='Content-Encoding: gzip' $BUCKET

    yellow '--> Syncing everything else'

    if [ "$BUCKET" = "s3://footest.fizz.io" ]
    then  
      s3cmd sync -r $TEST --delete-removed --exclude-from $DELETE_EXCLUDE_FILE_PATH $SITE_DIRECTORY $STATIC_TEXT_DIRECTORY $BUCKET
    fi

    green "\t Successfully deployed Fizz Landing to S3 Bucket [$BUCKET]"
    exit 0
  else
    red "\t Aborting deployment of Fizz Landing Page to $BUCKET."
    exit 1
  fi

else
  echo "Simply pushing commit to your specified branch"
fi