const express = require('express')
const path = require('path')
const port = process.env.PORT || '3000'
const axios = require('axios')

require('dotenv').config()
const API_KEY = process.env.API_KEY

const app = express()

app.use(express.static('public'))

app.get('/solar', async (req, res) => {

  const url = `https://developer.nrel.gov/api/pvwatts/v5.json?api_key=${API_KEY}&lat=40&lon=-105&system_capacity=4&azimuth=180&tilt=40&array_type=1&module_type=1&losses=10`
  const result = await axios.get(url)
  return res.send(result.data)
})

app.listen(port, () => console.log(`Server is running on port ${port}`))
