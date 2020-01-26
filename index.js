require('dotenv').config()
const cron = require('node-cron')
const express = require('express')
const fs = require('fs')
const prettycron = require('prettycron')
const axios = require('axios')

console.log('Starting server ...')

const app = express()

const cronTab = process.env.CRONTAB || '0 * * * *'
const port = process.env.PORT || 3000

console.log(process.env)

console.log('Starting cron job for : ' + prettycron.toString(cronTab))
cron.schedule(cronTab, async function () {
  console.log('---------------------')
  console.log('Running Cron Job')
  console.log('Getting snapshot ...')
  const snapshot = await getSnapshot()
  if (snapshot === null) {
    console.log('Impossible to get snapshot, aborting current job')
    return
  }
  console.log('Snapshot received')
  const snapshotTimestamp = snapshot.lastUpdatedOther
  const snapshotFilename = `${snapshotTimestamp}.json`
  console.log('Saving snapshot : ' + snapshotFilename)
  fs.writeFileSync(`./snapshots/${snapshotFilename}`, JSON.stringify(snapshot))
  console.log('Snapshot Saved')
})

async function getSnapshot () {
  const url = 'https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json'
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}
app.listen(port)

console.log(`Server listening on port ${process.env.PORT}`)
