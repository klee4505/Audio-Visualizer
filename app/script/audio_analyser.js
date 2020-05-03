const MAX_SCALE = 5;
const MIN_SCALE = 1;

time = Date.now();
const INC = 2;
const A4 = 440;
const C0 = A4 * Math.pow(2, -4.75);

function hsv2rgb(hue, saturation, value) {
    let chroma = value * saturation;
    let hue1 = hue / 60;
    let x = chroma * (1- Math.abs((hue1 % 2) - 1));
    let r1, g1, b1;
    if (hue1 >= 0 && hue1 <= 1) {
      ([r1, g1, b1] = [chroma, x, 0]);
    } else if (hue1 >= 1 && hue1 <= 2) {
      ([r1, g1, b1] = [x, chroma, 0]);
    } else if (hue1 >= 2 && hue1 <= 3) {
      ([r1, g1, b1] = [0, chroma, x]);
    } else if (hue1 >= 3 && hue1 <= 4) {
      ([r1, g1, b1] = [0, x, chroma]);
    } else if (hue1 >= 4 && hue1 <= 5) {
      ([r1, g1, b1] = [x, 0, chroma]);
    } else if (hue1 >= 5 && hue1 <= 6) {
      ([r1, g1, b1] = [chroma, 0, x]);
    }
    
    let m = value - chroma;
    let [r,g,b] = [r1+m, g1+m, b1+m];
    
    // Change r,g,b values from [0,1] to [0,255]
	return {red: r, green: g, blue: b};
  }

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

function get_percentage(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

var file = document.getElementById("thefile");
var audio = document.getElementById("audio");
var fileLabel = document.querySelector("label.file");
  
document.onload = function(e){
    console.log(e);
    audio.play();
    play();
}
file.onchange = function(){
    fileLabel.classList.add('normal');
    audio.classList.add('active');
    var files = this.files;
    
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    play();
}

var context, src, analyser;
var bufferLength, dataArray;
function play() {
	/*
	Enter WebAudio API
	*/
	context = new AudioContext();  // create context
	src = 
	context.createMediaElementSource(audio); //create src inside ctx
	analyser = context.createAnalyser(); //create analyser in ctx
	src.connect(analyser);         //connect analyser node to the src
	analyser.connect(context.destination); // connect the destination node to the analyser
	analyser.fftSize = 512;
	bufferLength = analyser.frequencyBinCount;
	dataArray = new Uint8Array(analyser.frequencyBinCount);

	// With 256 bins, each one will be ~86 Hz apart (44100 kHz sample rate / fftSize, where fftSize is twice the number of bins). So you start at zero and go up in 86 Hz increments from there.
	var frequency_inc = context.sampleRate/analyser.fftSize;

	render();
	
	function render() { // this function runs at every update
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

		var loudestFr_idx = indexOfMax(dataArray);
		var loudestFr = loudestFr_idx * frequency_inc;

		//scale shape
		var scaleval = get_percentage(lowerAvg, 0, 255) * MAX_SCALE;
		var scaley = get_percentage(upperAvg, 0, 255) * MAX_SCALE;
		shape.scale.x = 1 + scaleval;
		shape.scale.y = 1 + scaleval;
		shape.scale.z = 1 + scaleval;

		//rotate shape
		shape.rotation.x += 0.01;
		shape.rotation.y += 0.01;

		//rotate orbit
		orbit.scale.x = 1 + scaleval;
		orbit.scale.y = 1 + scaleval;
		orbit.scale.z = 1 + scaleval;

		//color change
		console.log("loweravgFr: ", lowerAvgFr);
		if (dataArray[4] > 0) {
			colorFr = Math.log2(loudestFr / 16.35);
			if (colorFr < 0) {
				colorFr = 0;
			} else if (colorFr > 6) {
				colorFr = 6
			}
			colorFr_p = get_percentage(colorFr, 0, 6);

			rgb = hsv2rgb(colorFr_p * 360, 1, 1);

			shape.material.color.r += (rgb.red - shape.material.color.r) / 80;
			shape.material.color.g += (rgb.green - shape.material.color.g) / 60;
			shape.material.color.b += (rgb.blue - shape.material.color.b) / 100;

			// stars.material.color.r += (rgb.red - stars.material.color.r) / 80;
			// stars.material.color.g += (rgb.green - stars.material.color.g) / 60;
			// stars.material.color.b += (rgb.blue - stars.material.color.b) / 100;

			orbit.material.color.r += (rgb.red - orbit.material.color.r) / 80;
			orbit.material.color.g += (rgb.green - orbit.material.color.g) / 60;
			orbit.material.color.b += (rgb.blue - orbit.material.color.b) / 100;
		}

		animate_orbit();
		function animate_orbit() {
			for (let i = 0; i < FFT_SIZE; i++) {
				p = orbit_geometry.vertices[i]
				var dist = 1.5 + dataArray[i] / 255;
				p.x = dist * Math.cos(rad_step * i);
				p.y = dist * Math.sin(rad_step * i);
			}
			orbit_geometry.verticesNeedUpdate = true;
			orbit.rotation.z += 0.01;
			orbit.rotation.y += 0.01;
			renderer.render(scene, camera);
		}


		renderer.render( scene, camera );
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

function animate_star() {

	star_geometry.vertices.forEach(p => {
		p.velocity += p.acceleration;
		p.z += p.velocity;
		if (p.z > 200) {
			p.z = -200
			p.velocity = 0;
		}
	});
	star_geometry.verticesNeedUpdate = true;
	stars.rotation.y += 0.002;
	renderer.render(scene, camera);
	requestAnimationFrame(animate_star);
}
animate_star();