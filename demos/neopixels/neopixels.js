var Npx = require('npx');
var npx = new Npx(60);






function animate(){
	var animationRed = npx.newAnimation(1).setAll('#FF0000');
	var animationWhite = npx.newAnimation(1).setAll('#FFFFFF');
	var animationBlue = npx.newAnimation(1).setAll('#0000FF');

	npx.enqueue(animationRed,1000)
   .enqueue(animationWhite,1000)
   .enqueue(animationBlue,1000)
   .run();
}

setInterval(animate, 3100);