

var tessel = require('tessel');
var http = require('http');
var twilio = require('twilio')(account_sid, auth_token);

var ambientLib = require('ambient-attx4');
var ambient = ambientLib.use(tessel.port['C']);

var Neopixels = require('neopixels');
var pixelCount = 60;
var threshold = 0.25;
var neopixels = new Neopixels();

ambient.on('ready', function() {
    console.log("Make some NOISE!!!!!");
    ambient.setSoundTrigger(threshold);
    ambient.on('sound-trigger', winner);
    setTimeout(sampleSoundLevel, 10);
});

function sampleSoundLevel() {
    ambient.getSoundLevel(function(err, data) {
        if (data > threshold) data = threshold;
        var pixel = Math.floor((data / threshold) * pixelCount);
        showPixel(pixel);
    });
    setTimeout(sampleSoundLevel, 10);
}

function showPixel(pixel) {
    var buf = new Buffer(pixelCount * 3);
    buf.fill(0);

    for (var i = 0; i <= pixel; i++) {
        var r = (i / pixelCount) * 255;
        var g = 255 - r;
        buf[i * 3] = g;
        buf[i * 3 + 1] = r;
    }

    neopixels.animate(pixelCount, buf);
}

function winner() {
    winTriggered = true;
    console.log("YAY!");
    ambient.clearSoundTrigger();
    getNumbers(function(numbers) {
        numbers.forEach(function(n) {
            //console.log(n);
            sendText(n, twilio_num, "Thanks for coming. Use discount code 'TESSEL-CODEMASH' for a 10% discount at tessel.io!");
        });
    });
}

function sendText(to, from, msg) {
    twilio.sms.messages.create({
        to: to,
        from: from,
        body: msg
    }, function(error, message) {});
}

function getNumbers(callback) {
    http.get("http://twiliosvc.azurewebsites.net/api/twilio/getList", function(res) {
        var result = '';
        res.on('data', function(data) {
            //console.log(data.toString());
            result = new Buffer(data).toString();
            var numbers = JSON.parse(result);

            callback(numbers);
        });
    });
}