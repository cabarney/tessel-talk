var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
var relaylib = require('relay-mono');
var ambientLib = require('ambient-attx4');

var relay = relaylib.use(tessel.port['B']);

var rfid = rfidlib.use(tessel.port['A']);
rfid.on('ready', function(version) {
    rfid.on('data', function(card) {
        var code = card.uid.toString('hex');
        if (code === '021e7303') {
            relay.toggle(1);
            console.log("VALID KEY SCANNED");
        } else {
            console.log("INVALID KEY");
        }
    });
});

rfid.on('error', function(err) {
    console.error(err);
});


// ========================================================


var pir = require('pir').use(tessel.port['GPIO'].pin['G4']);
pir.on('ready', function(pir) {
    pir.on('movement', function(time) {
        console.log("Movement");
        relay.turnOn(1);
    });
    pir.on("stillness", function(time) { console.log("Stillness...");});
});


// ========================================================


var ambient = ambientLib.use(tessel.port['C']);
ambient.on('ready', function() {
    ambient.setSoundTrigger(0.2);
    var lastTimeSoundTriggered = new Date();
    ambient.on('sound-trigger', function() {
        console.log("sound trigger!");
        ambient.clearSoundTrigger();
        setTimeout(function() {
            ambient.setSoundTrigger(0.1);
        }, 100)
        var now = new Date();
        if (now - lastTimeSoundTriggered < 1500) { // less than 1.5 second
            console.log("Clap On, Clap Off, The CLAPPER! ");
            relay.toggle(1);
        } else {
            lastTimeSoundTriggered = now;
        }
    });
});