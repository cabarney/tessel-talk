var router = require('tiny-router');
var tessel = require('tessel');
var climateLib = require('climate-si7020');
var fs = require('fs');

var climate = climateLib.use(tessel.port['A']);

router.use('fs', fs);

router
    .get('/', function(req, res) {
        router.readFile('./webroot/index.html', function(err, data) {
            res.send(data.toString());
        });
    })
    .get('/climate', function(req, res) {
        router.readFile('./webroot/climate.html', function(err, data) {
            var html = data.toString();
            climate.readTemperature('f', function(err, temp) {
                climate.readHumidity(function(err, humid) {
                    html = html.replace('{temp}', temp.toFixed(2));
                    html = html.replace('{humidity}', humid.toFixed(2));
                    res.send(html);
                });
            });
        });
    });

climate.on('ready', function() {
    router.listen(8080);
    console.log("Listening on port 8080...");
});