var tessel = require('tessel');
var fs = require('fs');
var audio = require('audio-vs1053b').use(tessel.port['A']);

audio.on('ready', function() {
    audio.setOutput('headphones', function(err) {
        var audioFile = fs.readFileSync('audio.mp3');
        audio.play(audioFile);
    });
});