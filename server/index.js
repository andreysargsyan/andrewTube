const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var multer = require('multer');
const cors = require('cors');
const fs = require('fs')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); 

app.get('/', function (req, res) {
  res.send('Hello World!');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { username } = req.body;
    const dir = `./public/uploads/${username}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    console.log(file, 'file')
    const date = Date.now();
    const type = file.mimetype.split('/')[1];
    const { description, videoName, username } = req.body;
    const infoPath = `./public/uploads/${username}/info${date}.txt`;
    const infoData = videoName + '\r\n' + description;

    fs.writeFile(infoPath, infoData, function (err) {
      if (err) throw err;
      console.log('File is created successfully.');
    });
    cb(null, `${date}.${type}`);
  }
})

const upload = multer({ storage }).single('upl')

app.post('/save', upload, function (req, res) {
  console.log(req.body, 44444);
  res.send({ saved: true });

});


app.listen(5000, function () {
  console.log('Server listening on port 5000!');
});
