# A simple node.js server to periodically fetch and save Velib stations status data

NB: This repo was created to gather data for an upcoming geospatial 3D visualization of Paris'city bikes using Deck.gl. Link to case study and frontend repo will be added soon.

## Usage
### Install dependencies
`yarn`

### Start server
`yarn start`

### Override server settings
Create a .env file at the root of the app with the following contents

```
PORT=[CUSTOM_PORT_NUMBER] #DEFAULT=3000
CRONTAB=[CUSTOM_CRONTAB] #DEFAULT=0 * * * * , so every hour
````

Once started, the server will periodically fetch and store a json snapshot representing the status of each Velib's station according to the CRONTAB provided.

Each status will be stored under `./snapshots` and will be named like `[SNAPSHOT_TIMESTAMP].json`

### Get snapshots
Get all the snapshots stored using the following GET request :
`[HOST]:[PORT]/snapshots`

