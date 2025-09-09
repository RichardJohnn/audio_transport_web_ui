const path = require('path');
const exec = require('child_process').exec;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/ping', function(req, res) {
  res.send('pong');
});

router.post('/upload', async function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const [file1, file2] = req.files.file;
  const {start, end} = req.body;

  const uploadDir = path.join(__dirname, 'uploads');

  const path1 = path.join(uploadDir, file1.name);
  await file1.mv(path1);

  const path2 = path.join(uploadDir, file2.name);
  await file2.mv(path2);

  const outputPath = path.join(uploadDir, 'output.wav');

  // Quote paths to handle spaces or special characters
  const command = `transport "${path1}" "${path2}" ${start} ${end} "${outputPath}"`;
  console.log('command:', command);

  function execute(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(stderr);
          return reject(error);
        }
        resolve(stdout);
      });
    });
  }

  const result = await execute(command);
  console.log('result', result);

  res.download(outputPath);
});


module.exports = router;
