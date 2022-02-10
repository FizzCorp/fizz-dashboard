./scripts/wait-for.sh db:5432 -- echo "POSTGRES database is available"
cd db 
PG_HOST=db sequelize db:migrate --config config/config.js --env testing
PG_HOST=db sequelize db:seed:all --config config/config.js --env testing