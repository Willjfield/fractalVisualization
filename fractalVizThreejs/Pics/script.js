var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var controls, renderer;


var sponge = []

function init(){
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls(camera, renderer.domElement);
						controls.enableDamping = true;
						controls.dampingFactor = 0.25;
						controls.minDistance = 0;
						controls.minPolarAngle = 0; // radians
						controls.maxPolarAngle = Math.PI*2

	camera.position.set(2,1,0);

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0, 1, 0 );
	scene.add( directionalLight );

	var light = new THREE.PointLight( 0xffffff, 1, 100 );
	light.position.set( 50, 0, 50 );
	scene.add( light );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
	directionalLight.position.set( -1, -1, 0 );
	scene.add( directionalLight );

	var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
	scene.add( light );

	var box = new Menger(new THREE.Vector3(),1);
	sponge.push(box)

	for(var b in sponge){
		sponge[b].show();
	}
	var iterations = 0;

	var url = "https://www.reddit.com/r/pics/comments/4hbsl5/1900_year_old_chariot_tracks_in_pompeii/.json"

	$.getJSON( url, function( data ) {
	  	var numComments = data[0].data.children[0].data.num_comments
		var mag = convert(numComments).toString()
		console.log(mag.length)
	
		while(iterations<mag.length-1){
			newGen();
			iterations++;
		}
	});
}

function convert(n) {
    var order = Math.floor(Math.log(n) / Math.LN10
                       + 0.000000001); // because float math sucks like that
    return Math.pow(10,order);
}
// var geometry = new THREE.BoxGeometry( 10, 10, 10 );
// var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


var newGen = function(){
	console.log('new gen')
	var next = []
	for(var b in sponge){
		var newBoxes = sponge[b].generate();
		for(var subB in newBoxes){
			next.push(newBoxes[subB]);
		}	
	}
	sponge = next;

	scene.traverse( function( node ) {
	    if ( node instanceof THREE.Mesh ) {
	        if(node.geometry instanceof THREE.BoxGeometry){
	        	node.visible = false;
	        	//scene.remove(node)
	        }
	    }
	} );

	for(var b in sponge){
		sponge[b].show();
	}
}

var targetRot = 0;

document.addEventListener('keypress',function(){
	targetRot+=Math.PI/2;
})

function render(){
	scene.traverse( function( node ) {
	    if ( node instanceof THREE.Mesh ) {
	        if(node.geometry instanceof THREE.BoxGeometry){
	        	if(node.visible == true){
	        		if(node.rotation.x<targetRot){
	        			node.rotation.x+=.01;
	        			node.rotation.z+=.01;
	        		}
	        		
	        	}
	        }
	    }
	} );
	requestAnimationFrame( render );

	controls.update();
	renderer.render(scene, camera);
}

var hexColor = '0x'+Math.floor(Math.random()*16777215).toString(16);
var cubeColor = parseInt(hexColor,16);

var Menger = function(pos, _r, _cc){
	this.mPos=pos;
	this.r=_r;
	this.cubeColor=_cc;
}

Menger.prototype.show = function(){

	var geometry = new THREE.BoxGeometry( this.r, this.r, this.r);
	var material = new THREE.MeshPhongMaterial( { color: this.cubeColor, transparent:true,opacity:.75,shininess:100,specular:0x224488} );
	var box = new THREE.Mesh(geometry,material);
	box.position.copy(this.mPos);
	scene.add(box)
}

Menger.prototype.generate = function(){
	var boxes = []
	for(var x=-1;x<2;x++){
		for(var y=-1;y<2;y++){
			for(var z=-1;z<2;z++){
				if((x==0||y==0||z==0)){
					var newR = this.r/3;
					var nB = new Menger(new THREE.Vector3(this.mPos.x+x*newR,this.mPos.y+y*newR,this.mPos.z+z*newR),newR, cubeColor)
					boxes.push(nB);
				}			
			}
		}
	}
	return boxes;
}

init();
render();
