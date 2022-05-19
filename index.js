const express = require('express');
const ApiVideoClient = require('@api.video/nodejs-client');

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

if (!process.env.VIDEO_ID) {
    throw new Error("VIDEO_ID environment variable is not set");
}

const app = express();

const client = new ApiVideoClient({ apiKey: process.env.API_KEY });

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    client.videos.get(process.env.VIDEO_ID)
        .then(video => res.render('pages/index', { assets: video.assets }));
});

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Listening on port ${port}`);