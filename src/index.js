const express = require('express');
const app = express();
const formidable = require('formidable');
const imageMin = require('./imageMin.js');
const fs = require('fs');
const { UPLOAD_DIR } = require('./settings');
app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
  res.write('<input type="file" name="filetoupload"><br>');
  res.write('<input type="submit">');
  res.write('</form>');
  return res.end();
});

app.use(express.static('../tmp-min'));

app.post('/fileupload', (req, res, next) => {
  const form = formidable({ multiples: false, uploadDir: './tmp' });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    var oldpath = files.filetoupload.path;
    var newpath = UPLOAD_DIR + '/' + Date.now() + '---' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function(err) {
      if (err) throw err;
      imageMin(newpath, (...args) => res.json(args));
    });
  });
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ...');
});
