# Auther
single integration for most sso, at the very least thats the plan.

## Usage

- `{{url}}`/github/callback?redirect_uri=`{{main-site}}`
- `{{url}}`/google/callback?redirect_uri=`{{main-site}}`
- `{{url}}`/discord/callback?redirect_uri=`{{main-site}}`

## Database

`db/auther.sql`

## Setup

Copy the `.env.example` file to the `.env` file and replace the occurring values.

```bash
# Initial Setup
yarn

# Start Databases
docker-compose up

# Running the project
yarn start
```

The process will boot on `localhost:3000`

The following endpoints will be made available

```bash
# Redirects to Github OAuth
/github/login
# Redirects to Discord OAuth
/discord/login
# Redirects to Google OAuth
/google/login

# Redirects to Github Callback
/github/callback
# Redirects to Discord Callback
/discord/callback
# Redirects to Google Callback
/google/callback
```
