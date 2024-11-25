const express = require('express')
const https = require('https') 
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.static(__dirname + '/public'))

app.get(['/mytunes.html', '/mytunes', '/index.html', '/'], (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/songs', (request, response) => {
  const song = request.query.term
  
  if (!song) {
    return response.status(400).json({ message: 'Please enter a song name' })
  }

  const titleWithPlusSigns = encodeURIComponent(song.trim())
  
  const options = {
    hostname: 'itunes.apple.com',
    path: `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=20`,
    method: 'GET'
  }

  const apiRequest = https.request(options, (apiResponse) => {
    let songData = ''
    
    apiResponse.on('data', (chunk) => {
      songData += chunk
    })

    apiResponse.on('end', () => {
      try {
        const parsedData = JSON.parse(songData)
        response.json(parsedData)
      } catch (error) {
        console.error('Error parsing response:', error)
        response.status(500).json({ message: 'Error processing iTunes response' })
      }
    })
  })

  apiRequest.on('error', (error) => {
    console.error('Error making iTunes request:', error)
    response.status(500).json({ message: 'Error connecting to iTunes API' })
  })

  apiRequest.end()
})

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})