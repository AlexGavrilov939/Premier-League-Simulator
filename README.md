## Insider Premier League Simulator

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
