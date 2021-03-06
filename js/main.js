
  var container;

  var camera, scene, renderer, mesh;

  var mouseX = 0, mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;


  init();
  animate();


  function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 250;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0x101030 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    scene.add( directionalLight );

    // texture

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {

      console.log( item, loaded, total );

    };

    var texture = new THREE.Texture();

    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };

    var onError = function ( xhr ) {
    };


    var loader = new THREE.ImageLoader( manager );
    loader.load( 'textures/tex.jpg', function ( image ) {

      texture.image = image;
      texture.needsUpdate = true;

    } );

    // model

    var loader = new THREE.OBJLoader( manager );
    loader.load( 'teapot1.obj', function ( object ) {

      object.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {

          child.material.map = texture;

        }

      } );

      object.scale.set(15,15,15);

      object.position.y = 0;
      mesh = object;
      scene.add( object );

    }, onProgress, onError );

    //

    renderer = new THREE.WebGLRenderer({
                    preserveDrawingBuffer: true
                });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

  }

  function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) ;
    mouseY = ( event.clientY - windowHalfY ) ;
    //mouseX = Math.sin(event.clientX);
    if(mesh){
      document.getElementById('xdeg').innerHTML = Math.round(mesh.rotation .x * 180/Math.PI);
      document.getElementById('ydeg').innerHTML = Math.round(mesh.rotation .y * 180/Math.PI);
    }

  }

  function animate() {

    requestAnimationFrame( animate );
    render();

  }

  function render() {
    if(mesh){
      mesh.rotation .y = ( - mouseX - mesh.rotation.y ) * .005;
      mesh.rotation.x = ( + mouseY + mesh.rotation.x ) * .005;
    }
    //camera.lookAt( mesh.position );
    renderer.render( scene, camera );



  }
