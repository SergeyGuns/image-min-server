const compress_images = require('compress-images');
const { UPLOAD_DIR } = require('./settings');
const fs = require('fs');
module.exports = function minImage(input, cb) {
  compress_images(
    input,
    UPLOAD_DIR + '-min/',
    { compress_force: true, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: 'mozjpeg', command: ['-quality', '60'] } },
    { png: { engine: 'pngquant', command: ['--quality=20-50'] } },
    { svg: { engine: 'svgo', command: '--multipass' } },
    {
      gif: { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web'] }
    },
    function(err, completed, statistic) {
      if (err) return cb(err, null, null);
      const buffer = fs.readFileSync(statistic.path_out_new);
      return cb(null, { completed, statistic, buffer });
    }
  );
};
