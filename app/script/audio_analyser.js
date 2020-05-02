const MAX_SCALE = 5;
const MIN_SCALE = 1;


function avg(numbers) {
	let sum = 0;
	for (let i = 0; i < numbers.length; i++){
		sum += numbers[i];
		if(numbers === []){
			return sum;
		}
	}
	return sum / numbers.length;
}

// function modulate(val, minVal, maxVal, outMin, outMax) {
//     var fr = fractionate(val, minVal, maxVal);
//     var delta = outMax - outMin;
//     return outMin + (fr * delta);
// }
// function fractionate(val, minVal, maxVal) {
//     return (val - minVal)/(maxVal - minVal);
// }

// var noise = new SimplexNoise();


var context, src, analyser;
var bufferLength, dataArray;
function createAudioCtx() {
	console.log("in createAudioCtx");
	audio = document.querySelector("audio");
	
	/*
	Enter WebAudio API
	*/
	context = new AudioContext();  // create context
	src = 
	context.createMediaElementSource(audio); //create src inside ctx
	analyser = context.createAnalyser(); //create analyser in ctx
	src.connect(analyser);         //connect analyser node to the src
	analyser.connect(context.destination); // connect the destination 
										// node to the analyser
	analyser.fftSize = 512;
	bufferLength = analyser.frequencyBinCount;
	dataArray = new Uint8Array(analyser.frequencyBinCount);
	render();

	function render() { // this function runs at every update
		console.log("in render");
		analyser.getByteFrequencyData(dataArray);
		// slice the array into two halves
		var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
		var upperHalfArray = 
		dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);
		// do some basic reductions/normalisations
		var lowerMax = Math.max(lowerHalfArray);
		var lowerAvg = avg(lowerHalfArray);
		var upperAvg = avg(upperHalfArray);
		var lowerMaxFr = lowerMax / lowerHalfArray.length;
		var lowerAvgFr = lowerAvg / lowerHalfArray.length;
		var upperAvgFr = upperAvg / upperHalfArray.length;

		console.log(lowerAvg);
		console.log(upperAvg);
		var scalex = (lowerAvg / 255) * MAX_SCALE;
		var scaley = (upperAvg / 255) * MAX_SCALE;
		cube.scale.x = 1 + scalex;
		cube.scale.y = 1 + scaley;
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		renderer.render( scene, camera );

		// makeRoughBall(cube, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));
		requestAnimationFrame(render);

	}
	audio.play();
	
}

function pause() {
	audio.pause();
}
function resume() {
	audio.play();
}
increase = true;
var animate = function animate() {
	requestAnimationFrame( animate );
	var offset = cube.geometry.parameters.radius;
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	if (increase) {
		cube.scale.x += 0.01;
	} else {
		cube.scale.x -= 0.01;
	}
	if (cube.scale.x > 5) {
		increase = false;
	}
	if (cube.scale.x < 1) {
		increase = true;
	}
	
	renderer.render( scene, camera );
}

function makeRoughBall(mesh, bassFr, treFr) { 
	mesh.geometry.vertices.forEach(function (vertex, i) {
	  var offset = mesh.geometry.parameters.radius;
	  var time = window.performance.now(); 
	  vertex.normalize();
	  var distance = (offset + bassFr ) + noise.noise3D(
			vertex.x + time * 0.00007,
			vertex.y + time * 0.00008,
			vertex.z + time * 0.00009
	  ) * amp * treFr;
	  vertex.multiplyScalar(distance);
	});
	mesh.geometry.verticesNeedUpdate = true;
	mesh.geometry.normalsNeedUpdate = true;
	mesh.geometry.computeVertexNormals();
	mesh.geometry.computeFaceNormals();
}
// animate();

// function draw() {
// 	drawVisual = requestAnimationFrame(draw);
  
// 	analyser.getByteFrequencyData(dataArray);
  
// 	context.fillStyle = 'rgb(0, 0, 0)';
// 	context.fillRect(0, 0, WIDTH, HEIGHT);
  
// 	var barWidth = (WIDTH / bufferLength) * 2.5;
// 	var barHeight;
// 	var x = 0;
  
// 	for(var i = 0; i < bufferLength; i++) {
// 	  barHeight = dataArray[i];
  
// 	  canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
// 	  canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
  
// 	  x += barWidth + 1;
// 	}
//   };
  
//   draw();
  