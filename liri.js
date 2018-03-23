require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request')
var fs = require('fs')

var keys = require("./keys.js")

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var input1 = process.argv[2];
var input2 = "";

if (input1 === "my-tweets"){
    // var params = {screen_name: 'CambySlims'};
    client.get('statuses/user_timeline', function(error, tweets, response) {
        if (!error) {
            for (i = 0; i < 20; i++){
                console.log (i+1 + ". " + tweets[i].text)
                console.log ("Date tweeted: " + tweets[i].created_at)
                console.log ("   ")
            }
            // console.log(JSON.stringify(tweets, null, 4));
        }
        else{
            console.log(error)
        }
    });
}

if (input1 === "spotify-this-song"){
    
    for (i = 3; i<process.argv.length; i++){
    
        if (i > 3 && i < process.argv.length){
            input2 = input2 + " " + process.argv[i]
        }
        else {
            input2 += process.argv[i];
        }
    }
    spotifysearch();
}

function spotifysearch(){
    spotify
    .search({ type: 'track', query: input2 })
    .then(function(data) {
        var songInfo = data.tracks.items[0];
        console.log("Artist(s): " + songInfo.artists[0].name)
        console.log("Song title: " + songInfo.name)
        console.log("Album name: " + songInfo.album.name)
        console.log("Preview url: " + songInfo.preview_url)
    })
    .catch(function(err) {
        console.log(err);
    });
};

if (input1 === "movie-this"){
    
    for (i = 3; i<process.argv.length; i++){
    
        if (i > 3 && i < process.argv.length){
            input2 = input2 + "+" + process.argv[i]
        }
        else {
            input2 += process.argv[i];
        }
    }
    
    var queryUrl = "http://www.omdbapi.com/?t=" + input2 + "&y=&plot=short&apikey=trilogy";

    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

    if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    // console.log 
    console.log("Movie Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("Rating: " + JSON.parse(body).Rated);
    console.log("Release Country: " + JSON.parse(body).Country);
    console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
    console.log("Plot Summary: " + JSON.parse(body).Plot);
    console.log("Leading Actors: " + JSON.parse(body).Actors);

  }
});
}

if (input1 === "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function (error, data){
        if (error) {
            return console.log(error);
        }

        //   console.log(data);
          dataArr = data.split(',')
          
          input2 = dataArr[1];
        //   console.log(input2);

          if (dataArr[0] === 'spotify-this-song')
          spotifysearch();

          //would as additional if statements to process more commands if needed
          
    })
}

