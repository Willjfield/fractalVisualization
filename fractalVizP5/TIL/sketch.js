var sponge = []
function setup(){
	createCanvas(window.innerWidth,window.innerHeight);
	background(255);

	var initVec=createVector(width/2,height/2);
	var box = new Menger(initVec,700);
	sponge.push(box)

	for(var b in sponge){
		sponge[b].show();
	}

	var iterations = 0;

	var url = "https://www.reddit.com/r/todayilearned/comments/4hd2ry/til_that_cvs_took_a_2_billion_hit_to_annual_sales/.json"

	$.getJSON( url, function( data ) {
	  	var numComments = data[0].data.children[0].data.num_comments
		//var mag = convert(numComments).toString()
		var complexity = map(numComments,0,7000,0,6);
		while(iterations<complexity){
			newGen();
			iterations++;
		}
	});
}

function draw(){
	
}

function convert(n) {
    var order = Math.floor(Math.log(n) / Math.LN10
                       + 0.000000001); // because float math sucks like that
    return Math.pow(10,order);
}

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

	for(var b in sponge){
		sponge[b].show();
	}
}


var Menger = function(pos, _r){
	this.mPos=pos;
	this.r=_r;
}

Menger.prototype.show = function(){
	rectMode(CENTER);
	push();
		//noFill();
		noStroke();
		fill(random(255),random(255),random(255));
		translate(this.mPos.x,this.mPos.y)
		rect(0,0,this.r,this.r)
	pop();
}

Menger.prototype.generate = function(){
	var boxes = []
	for(var x=-1;x<2;x++){
		for(var y=-1;y<2;y++){
				if((x==0||y==0)){
					var newR = this.r/3;
					var nB = new Menger(createVector(this.mPos.x+x*newR,this.mPos.y+y*newR),newR);
					boxes.push(nB);
				}			
		}
	}
	return boxes;
}