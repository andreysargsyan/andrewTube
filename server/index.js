const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); 

app.get('/getVideos', function (req, res) {
  console.log('get request to /');
  // res.send({hello: true});
  res.sendFile(__dirname + '/videos.json');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { username } = req.body;
    const dir = __dirname + `/public/uploads/${username}`;
    // console.log(fs.existsSync(dir), dir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // console.log(file, 'file')
    const date = Date.now();
    const type = file.mimetype.split('/')[1];
    const { description, videoName, username } = req.body;
    const infoPath = __dirname + `/public/uploads/${username}/info${date}.txt`;
    const infoData = videoName + '\r\n' + description;

    fs.writeFile(infoPath, infoData, function (err) {
      if (err) throw err;
      console.log('File is created successfully.');
    });
    let videos = require( __dirname + '/videos.json');
    // console.log(videos)
    videos[username] = videos[username] ? videos[username] : [];
    videos[username].push({video_link: date, video_name: videoName, video_description: description, views: 0});
    videos = JSON.stringify(videos);

    fs.writeFile(__dirname +'/videos.json', videos, (err) => {
      if(err) throw err;
      else{
        console.log('videos.json changed');
      }
    });
    cb(null, `${date}.${type}`);
  }
});

const upload = multer({ storage }).single('upl');

app.post('/save', upload, function (req, res) {
  res.send({ saved: true });
});

app.get('/videos/:user/:videoId', function (req, res) {
  const {user, videoId} = req.params;
  res.sendFile(path.join(__dirname, `./public/uploads/${user}/${videoId}.webm`));
});

app.get('/videos/:user/:videoId/info', function (req, res) {
  const {user, videoId} = req.params;
  const info = fs.readFileSync(path.join(__dirname, `./public/uploads/${user}/info${videoId}.txt`), 'utf8');
  res.send({info});
});

app.listen(5000, function () {
  console.log('Server listening on port 5000!');
});
