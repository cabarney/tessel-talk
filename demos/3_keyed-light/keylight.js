var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
var relaylib = require('relay-mono');
var pir = require('pir').use(tessel.port['GPIO'].pin['G4']);
var ambientLib = require('ambient-attx4');
var ambient = ambientLib.use(tessel.port['C']);

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

pir.on('ready', function(pir){
  pir.on('movement', function(time){
    console.log("Movement");
    relay.turnOn(1);
    tessel.led[3].output(1);
    setTimeout(resetLeds, 1000)
  });
});
rfid.on('error', function (err) {
  console.error(err);
});

ambient.setSoundTrigger(0.2);
var lastTimeSoundTriggered = new Date();
ambient.on('sound-trigger', function(){
  console.log("sound trigger!");
  var now = new Date();
  if(now - lastTimeSoundTriggered < 1000) { // less than a second
    console.log("Clap On, Clap Off, The CLAPPER! ");
    relay.toggle(1);
    tessel.led[4].output(1);
    setTimeout(resetLeds, 1000)
  } else {
    lastTimeSoundTriggered = now;
  }
});

function resetLeds(){
  	tessel.led[0].output(0);
  	tessel.led[1].output(0);
  	tessel.led[2].output(0);
  	tessel.led[3].output(0);	
}

resetLeds();