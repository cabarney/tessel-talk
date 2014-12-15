var account_sid = "";
var auth_token = "";
var twilio_num = "";

var tessel = require('tessel');
var http = require('http');
var client = require('twilio')(account_sid, auth_token);
var ambientLib = require('ambient-attx4');
var ambient = ambientLib.use(tessel.port['A']);
var Neopixels = require('neopixels');


var pixelCount = 60;
var threshold = 0.2;
var neopixels = new Neopixels();

ambient.on('ready', function () {
  ambient.setSoundTrigger(threshold);

  setInterval(function(){
      ambient.getSoundLevel(function(err,data){  
      if(data > threshold) data = threshold;
      var pixel = Math.floor((data/threshold) * pixelCount);
      showPixel(pixel);
  	});
  }, 50);

  ambient.on('sound-trigger', function(data) {
  	console.log("triggered!");
    getNumbers(function(numbers){
	  numbers.forEach(function(n){
	  	sendText(n,twilio_num,"Thanks for coming. Use discount code 'TESSEL-CODEMASH' for a 10% discount at tessel.io!");
	  });
	});
  });
});


function showPixel(pixel){
  var buf = new Buffer(pixelCount * 3);
  buf.fill(0);
  
  for(var i = 0; i <= pixel; i++)  {
  	buf[i*3] = 0xFF;
  }

  neopixels.animate(pixelCount, buf);
}

function sendText(to,from,msg) {
  client.sms.messages.create({
    to: to,
    from: from,
    body:msg
  }, function(error, message) {});
}

function getNumbers(callback)
{
  http.get("http://twiliosvc.azurewebsites.net/api/twilio/getList", function (res) {
    var result = '';
    res.on('data', function (data) {
      result = new Buffer(data).toString();
      var numbers = JSON.parse(result);

      callback(numbers);
    });
  });
}