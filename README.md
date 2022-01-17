### Before run

- create .env file on your local. copy paste the key from .envSample file and then fill the values

### Build for developemt

`yarn dev`

### Build for production

`yarn build`

### DB

We use airtable as callback api. Once the video is processed, our api calls airtable by insering a record. Chrome extension polls airtable in order to inject the thunbnail and link of the video into GMAIL compose.

## AIRTABLE

- api_key: can be found in https://airtable.com/account. Also must be saved in .env file. Please create .env file and copy/paste key from
