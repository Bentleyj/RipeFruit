var loadShader = function(id, path1, callback) {
	var shader = new XMLHttpRequest();
	shader.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			document.getElementById(id).text = this.response;
			callback();
		}
	}
	shader.open("GET", path1, true);
	shader.send();
}

var loadScene = function(gl, buffer, program, canvas, animate) { 
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

	gl.bufferData(
		gl.ARRAY_BUFFER, 
		new Float32Array([
				-1.0, -1.0, 
				1.0, -1.0, 
				-1.0,  1.0, 
				-1.0,  1.0, 
				1.0, -1.0, 
				1.0,  1.0]), 
		gl.STATIC_DRAW
	);

	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	//define the shader variables that we'll need
	var shaderScript;
	var shaderSource;
	var vertexShader;
	var fragmentShader;

	// compile the vertex shader
	shaderScript = document.getElementById("2d-vertex-shader");
	shaderSource = shaderScript.text;
	vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, shaderSource);
	gl.compileShader(vertexShader);

	//compile the fragment shader
	shaderScript   = document.getElementById("2d-fragment-shader");
	shaderSource   = shaderScript.text;
	fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, shaderSource);
	gl.compileShader(fragmentShader);

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);	
	gl.useProgram(program);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

	gl.bufferData(
		gl.ARRAY_BUFFER, 
		new Float32Array([
				-1.0, -1.0, 
				1.0, -1.0, 
				-1.0,  1.0, 
				-1.0,  1.0, 
				1.0, -1.0, 
				1.0,  1.0]), 
		gl.STATIC_DRAW
	);

	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	//define the shader variables that we'll need
	var shaderScript;
	var shaderSource;
	var vertexShader;
	var fragmentShader;

	// compile the vertex shader
	shaderScript = document.getElementById("2d-vertex-shader");
	shaderSource = shaderScript.text;
	vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, shaderSource);
	gl.compileShader(vertexShader);

	//compile the fragment shader
	shaderScript   = document.getElementById("2d-fragment-shader");
	shaderSource   = shaderScript.text;
	fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, shaderSource);
	gl.compileShader(fragmentShader);

	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);	
	gl.useProgram(program);

	animate();
};

function defaultTexture(gl) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([255, 255, 255, 255]);  // opaque blue
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

	return texture;
}

function loadTexture(gl, url) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 0, 255]);  // opaque blue
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

	const image = new Image();
  	image.onload = function() {
	    gl.bindTexture(gl.TEXTURE_2D, texture);
	    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

	    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
	    	// Yes, it's a power of 2. Generate mips.
	       	gl.generateMipmap(gl.TEXTURE_2D);
	    } else {
	    	// No, it's not a power of 2. Turn of mips and set
	       	// wrapping to clamp to edge
	       	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	       	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	       	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	    }
  	};

  image.src = url;

  return texture;
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById('bgTexture').setAttribute('src', e.target.result);
           	texture = loadTexture(gl, e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function getRandomArray(low, high, size) {
	var points = new Array();
	for(var i = 0; i < size; i++) {
		points[i] = map_range(Math.random(), 0.0, 1.0, low, high);
	}
	return points;
}

function map_range(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function animatePoints(points, vels) {
	for(var i = 0; i < points.length; i++) {
		points[i] += vels[i];
		if(points[i] < 0) {
			points[i] = 0;
			vels[i] *= -1;
		}
		if(points[i] > 1) {
			points[i] = 1;
			vels[i] *= -1;
		}
	}
}

function downloadURI(uri, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
}

function setColors(colsIn) {
	var colsOut = new Array();
	var j = 0;
	for(var i = 0; i < colsIn.length; i++) {
		colsOut[j] = hexToRgb(colsIn[i]).r / 255;
		colsOut[j+1] = hexToRgb(colsIn[i]).g / 255;
		colsOut[j+2] = hexToRgb(colsIn[i]).b / 255;
		j+=3;
	}
	return colsOut;
}

function getRandomColor() {
	return '#'+'0123456789abcdef'.split('').map(function(v,i,a){
			return i>5 ? null : a[Math.floor(Math.random()*16)] }).join('');
}

function randomizeValues() {
	for(var i = 1; i < 11; i++) {
		document.getElementById("col" + i.toString()).value = getRandomColor();
	}
}

function lerpColor(a, b, amount) { 

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}
