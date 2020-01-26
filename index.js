require('dotenv').config()
const cron = require('node-cron')
const express = require('express')
const fs = require('fs')
const prettycron = require('prettycron')
const axios = require('axios')
const cors = require('cors')

console.log('Starting server ...')

const app = express()

const cronTab = process.env.CRONTAB || '0 * * * *'
const port = process.env.PORT || 3000

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

function readSnapshotFiles () {
  let files
  try {
    files = fs.readdirSync('./snapshots')
  } catch (err) {
    // An error occurred
    console.error(err)
    return null
  }
  return files
}

// Enable all cors
app.use(cors())

console.log('Starting cron job for : ' + prettycron.toString(cronTab))
cron.schedule(cronTab, async function () {
  console.log('---------------------')
  console.log('Running Cron Job')
  console.log('Getting snapshot ...')
  const snapshot = await getSnapshot()
  if (snapshot === null) {
    console.warn('Impossible to get snapshot, aborting current job')
    return
  }
  console.log('Snapshot received')
  const snapshotTimestamp = snapshot.lastUpdatedOther
  const snapshotFilename = `${snapshotTimestamp}.json`
  console.log('Saving snapshot : ' + snapshotFilename)
  try {
    fs.writeFileSync(`./snapshots/${snapshotFilename}`, JSON.stringify(snapshot))
  } catch (err) {
    console.error(`Error writing file ${snapshotFilename}: ${err}`)
  }
  console.log('Snapshot Saved')
})

app.get('/snapshots', (req, res) => {
  const fileNames = readSnapshotFiles()
  const rawFiles = fileNames.map(filename => fs.readFileSync(`./snapshots/${filename}`))
  const data = rawFiles.map(rawFile => JSON.parse(rawFile))
  res.json(data)
})

app.listen(port)

console.log(`Server listening on port ${process.env.PORT}`)
