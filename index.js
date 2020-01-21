require('dotenv').config()
const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
const prettycron = require('prettycron');
const axios = require('axios');


console.log('Starting server ...');

app = express();

let cronString = "* * * * *";

console.log('Starting cron job for : ' + prettycron.toString(cronString))
cron.schedule(cronString, async function () {
    console.log("---------------------");
    console.log("Running Cron Job");
    const snapshot = await getSnapshot();
    if (snapshot === null) {
        console.log('Impossible to get snapshot, aborting current job');
        return
    }
    const snapshotTimestamp = snapshot.lastUpdatedOther
    fs.writeFileSync(`snapshots/${snapshotTimestamp}.json`, snapshot);
});

async function getSnapshot () {
    const url = "https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json";
    try {
        const response = await axios.get(url);
        return response.data
    } catch (error) {
        console.error(error);
        return null
    }
}


app.listen(process.env.PORT);

console.log('Server listening on port ' + process.env.PORT);
