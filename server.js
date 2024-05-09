const express = require('express') //express framework
const http = require('http')
const PORT = process.env.PORT || 3000 //allow environment variable to possible set PORT

const app = express()
let titleWithPlusSigns = ''

//Middleware
app.use(express.static(__dirname + '/public')) //static server

//Routes
app.get(['/mytunes.html', '/mytunes', '/index.html', '/'], (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});


app.get('/songs', (request, response) => {
  let song = request.query.term
  titleWithPlusSigns = song.trim().replace(/\s/g, '+')
  if(!song) {
    //send json response to client using response.json() feature
    //of express
    response.json({message: 'Please enter a song name'})
    return
  }
  
const options = {
    "method": "GET",
    "hostname": "itunes.apple.com",
    "port": null,
    "path": `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=20`,
    "headers": {
      "useQueryString": true
    }
  }
  //create the actual http request and set up
  //its handlers
  http.request(options, function(apiResponse) {
    let songData = ''
    apiResponse.on('data', function(chunk) {
      songData += chunk
    })
    apiResponse.on('end', function() {
      response.contentType('application/json').json(JSON.parse(songData))
    })
  }).end() //important to end the request
           //to actually send the message
})

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log(`http://localhost:3000/mytunes.html`)
    console.log(`http://localhost:3000/mytunes`)
    console.log(`http://localhost:3000/`)
    console.log(`http://localhost:3000`)
  }
})
