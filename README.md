## Insider Premier League Simulator

### DEMO: https://188.120.254.134

### DEV environment configuration

- `cp .env.example .env`
- `composer install --ignore-platform-reqs`
- `yarn install`
- `yarn run hot`
- `./vendor/bin/sail up`
- `./vendor/bin/sail composer dump-autoload`
- `./vendor/bin/sail artisan key:generate`

### Rebuilding and clearing local cache

- `yarn watch`
- `./vendor/bin/sail artisan cache:clear`
- `./vendor/bin/sail artisan config:clear`
- `./vendor/bin/sail artisan config:cache`
- 
### Deploy production steps
- `cd ./deploy`
- `create your own host config at ./hosts/production/ directory (by pattern ./hosts/hosts_sample.yml)`
- `make ansible-servers-setup`
- `make ansible-docker-login`
- `make deploy IMAGE_TAG=icl-1`
