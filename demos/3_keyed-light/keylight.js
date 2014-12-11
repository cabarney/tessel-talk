var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
var relaylib = require('relay-mono');

var rfid = rfidlib.use(tessel.port['A']); 
var relay = relaylib.use(tessel.port['B']);  

rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

  rfid.on('data', function(card) {
  	var code = card.uid.toString('hex');
    if(code === '021e7303') {
    	tessel.led[0].output(1);
    	relay.toggle(1);
    } else {
    	tessel.led[2].output(1);
    }
	setTimeout(resetLeds, 1000)
  });
});

rfid.on('error', function (err) {
  console.error(err);
});

function resetLeds(){
  	tessel.led[0].output(0);
  	tessel.led[1].output(0);
  	tessel.led[2].output(0);
  	tessel.led[3].output(0);	
}

resetLeds();