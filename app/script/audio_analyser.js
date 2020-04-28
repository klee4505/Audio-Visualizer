
// instantiate a listener
var audioListener = new THREE.AudioListener();

// add the listener to the camera
camera.add( audioListener );

// instantiate audio object
var sound = new THREE.Audio( audioListener );

// add the audio object to the scene
scene.add( sound );

// instantiate a loader
var loader = new THREE.AudioLoader();

function loadAudio() {
	// load a resource
	loader.load(
		// resource URL
		'../audio/1.mp3',

		// onLoad callback
		function ( audioBuffer ) {
			// set the audio object buffer to the loaded object
			sound.setBuffer( audioBuffer );
			sound.setLoop(true);
			// play the audio
			sound.setVolume(0.5);
			sound.play();
		},

		// onProgress callback
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},

		// onError callback
		function ( err ) {
			console.log( 'An error happened' );
		}
	);
}


// create an AudioAnalyser, passing in the sound and desired fftSize
var analyser = new THREE.AudioAnalyser( sound, 32 );

// get the average frequency of the sound
frequencydata = analyser.getAverageFrequency();

