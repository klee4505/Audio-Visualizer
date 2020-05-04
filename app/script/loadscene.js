// Scene loader
const FFT_SIZE = 512;
const rad_step = (Math.PI * 2) / FFT_SIZE;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var bloomStrength = 2;
var bloomRadius = 0;
var bloomThreshold = 0.1;


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );

var copyShader = new THREE.ShaderPass(THREE.CopyShader);
copyShader.renderToScreen = true;

var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 			bloomStrength, bloomRadius, bloomThreshold);

renderScene = new THREE.RenderPass(scene, camera);

var composer = new THREE.EffectComposer(renderer);

composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(renderScene);
composer.addPass(effectFXAA);
composer.addPass(effectFXAA);

composer.addPass(bloomPass);
composer.addPass(copyShader);

camera.position.z = 15;
// camera.rotation.x = Math.PI/2;

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var point_light1 = new THREE.PointLight( 0x404040, 1, 100 );
point_light1.position.set( 0, 0, 0 );
scene.add( point_light1 );

var point_light2 = new THREE.PointLight( 0x404040, 1, 100 );
point_light2.position.set( 6, 0, 0 );
scene.add( point_light2 );

var point_light3 = new THREE.PointLight( 0x404040, 1, 100 );
point_light3.position.set( -6, 0, 0 );
scene.add( point_light3 );

var point_light4 = new THREE.PointLight( 0x404040, 1, 100 );
point_light4.position.set( 0, 0, 6 );
scene.add( point_light4 );

var point_light5 = new THREE.PointLight( 0x404040, 1, 100 );
point_light5.position.set( 0, 0, -6 );
scene.add( point_light5 );

var point_light6 = new THREE.PointLight( 0x404040, 1, 100 );
point_light6.position.set( 0, 0, 0 );
scene.add( point_light6 );

var point_light7 = new THREE.PointLight( 0x404040, 1, 100 );
point_light6.position.set( 0, 6, 0 );
scene.add( point_light6 );

var point_light8 = new THREE.PointLight( 0x404040, 1, 100 );
point_light6.position.set( 0, -6, 0 );
scene.add( point_light6 );

var point_light9 = new THREE.PointLight( 0x404040, 1, 100 );
point_light6.position.set( 0, 0, 0 );
scene.add( point_light6 );


//rotate and scale light
rotate_light();
function rotate_light() {
    requestAnimationFrame(rotate_light);

    point_light1.position.x = (10) * Math.sin(Date.now() / 240);
    point_light1.position.y = (10) * Math.sin(Date.now() / 240);
    point_light1.position.z = (10) * Math.cos(Date.now() / 240);

    point_light6.position.y = (10) * Math.sin(Date.now() / 340);
    point_light6.position.z = (10) * Math.sin(Date.now() / 340);
    point_light6.position.x = (10) * Math.cos(Date.now() / 340);
}

function create_fog() {
    const near = 1;
    const far = 300;
    const color = 0x000118;
    const density = 0.1;
    scene.fog = new THREE.Fog(color, near, far);
    scene.background = new THREE.Color(color);
}
// create_fog();


function create_starry_background() {
    star_geometry = new THREE.Geometry();
    for (let i = 0; i < 6000; i++) {
        px = Math.random() * 600 - 300;
        py = Math.random() * 600 - 300;
        pz = Math.random() * 600 - 300;

        star = new THREE.Vector3( px, py, pz );
        star.velocity = 0;
        star.acceleration = 0.02;
        star_geometry.vertices.push(star);
    }
    let star_texture = new THREE.TextureLoader().load('../images/circle-cropped.png');

    let star_material = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.7,
        map: star_texture
    });

    stars = new THREE.Points(star_geometry, star_material);
    scene.add(stars);
}

function create_discoball() {
    sphere_geometry = new THREE.SphereGeometry(1, 16, 16);

    let ao_map = new THREE.TextureLoader().load('../images/ao.jpg');
    let basecolor_map = new THREE.TextureLoader().load('../images/discoball2.jpg');
    let height_map = new THREE.TextureLoader().load('../images/height.png');
    let normal_map = new THREE.TextureLoader().load('../images/normal.jpg');
    let roughness_map = new THREE.TextureLoader().load('../images/roughness.jpg');


    shape_material = new THREE.MeshStandardMaterial( {
        emissive: 'gray',
        emissiveIntensity: 0.15,
        map: basecolor_map,
        // aoMap: ao_map,
        // displacementMap: height_map,
        // normalMap: normal_map,
        // roughnessMap: roughness_map,
        roughness: 0.6
        } );

    shape = new THREE.Mesh( sphere_geometry, shape_material );
    scene.add(shape);
}


function create_orbit() {
    orbit_geometry = new THREE.Geometry();
    for (let i = 0; i < FFT_SIZE; i++) {
        dist = 1.5;
        var px = dist * Math.cos(rad_step * i);
        var py = dist * Math.sin(rad_step * i);
        var pz = 0;

        orbit_point = new THREE.Vector3( px, py, pz );
        orbit_geometry.vertices.push(orbit_point);
    }
    // orbit_geometry = new THREE.RingBufferGeometry(
    //     1.5, 1.5,
    //     36, 1,
    //     0, 2 * Math.PI);
        //innerRadius, outerRadius,
        //thetaSegments, phiSegments,
        //thetaStart, thetaLength

    let orbit_texture = new THREE.TextureLoader().load('../images/circle-cropped.png');

    let orbit_material = new THREE.PointsMaterial({
        color: 'gray',
        size: 0.1,
        map: orbit_texture
    });
    
    orbit = new THREE.Points(orbit_geometry, orbit_material);
    scene.add(orbit);
}
create_discoball();
create_starry_background();
create_orbit();







// function animate() {
//     renderer.render(scene, camera);
//     requestAnimationFrame(animate);
// }
