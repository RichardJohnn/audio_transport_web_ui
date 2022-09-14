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
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  const {file1, file2} = req.files;

  const path1 = __dirname + '/uploads/' + file1.name.replace(/(\s+)/g, '\\$1')
  console.log("path1", path1);
  await file1.mv(path1)
  const path2 = __dirname + '/uploads/' + file2.name.replace(/(\s+)/g, '\\$1')
  console.log("path2", path2);
  await file2.mv(path2)

  const exec = require('child_process').exec;

  const outputPath = __dirname + '/uploads/output.wav'
  const command = `transport ${path1} ${path2} 25 75 ${outputPath}`;

  function execute(command){
    return new Promise(function(resolve, reject) {
      exec(command, function(error, stdout, stderr) {
        if (error !==  null) {
          console.log(stderr);
          reject(error);
        }
        resolve(stdout)
      });
    });
  };

  const result = await execute(command);
  console.log("result", result);
  res.download(outputPath)

  //return res.status(500).send(err);
  //res.send('File uploaded to ' + uploadPath);
});


module.exports = router;
