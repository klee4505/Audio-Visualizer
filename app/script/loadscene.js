// Scene loader
const FFT_SIZE = 512;
const rad_step = (Math.PI * 2) / FFT_SIZE;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 15;
// camera.rotation.x = Math.PI/2;

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

for (let i = 0; i < 5; i ++) {
    px = Math.random() * 10 - 5;
    py = Math.random() * 10 - 5;
    pz = Math.random() * 10 - 5;
    var point_light = new THREE.PointLight( 0xff0000, 1, 100 );
    light.position.set( 5, 5, 5 );
    scene.add( point_light );
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
    let basecolor_map = new THREE.TextureLoader().load('../images/disco.jpg');
    let height_map = new THREE.TextureLoader().load('../images/height.png');
    let normal_map = new THREE.TextureLoader().load('../images/normal.jpg');
    let roughness_map = new THREE.TextureLoader().load('../images/roughness.jpg');


    shape_material = new THREE.MeshStandardMaterial( {
        emissive: 'gray',
        map: basecolor_map,
        aoMap: ao_map,
        // displacementMap: height_map,
        normalMap: normal_map,
        roughnessMap: roughness_map,
        roughness: 0.0
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
        size: 0.2,
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
