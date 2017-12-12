			//Fragment shader, does all the work!
			// Here we initialize the float precision (this really should bea  default thing, took me like an hour to figure out)
			#ifdef GL_FRAGMENT_PRECISION_HIGH
				precision highp float;
	  		#else
	    		precision mediump float;
	  		#endif

	  		#define NUM_COLORS 3
	  		#define NUM_POINTS 9

	  		// Uniform for the resolution of the CANVAS! (not the screen) and normalized mouse position
	  		uniform vec2 u_points[NUM_POINTS];
	  		uniform vec3 u_colors[NUM_COLORS];
	  		uniform vec2 u_resolution;
	  		uniform float u_time;
	  		uniform sampler2D u_texture;

	  		void main() {
	  			//Normalize the frag coord to [0, 1]
	  			vec2 uv = gl_FragCoord.xy / vec2(u_resolution.x, u_resolution.y);
	  			uv.y = 1.0 - uv.y;

	  			vec2 cPos = vec2(0.5, 0.5);

	  			float dist = distance(cPos, uv);

	  			float percentages[NUM_POINTS];

	  			for(int i = 0; i < NUM_POINTS; i++) {
	  				float d = distance(u_points[i], uv);
	  				float p = clamp(1.0 - smoothstep(0.0, 0.5, d), 0.0, 1.0);
	  				percentages[i] = p;
	  			}

	  			//vec3 background = vec3(u_colors[0]);

	    		//Calculate the background gradient along y using basic mix function
	    		vec4 background = vec4(u_colors[0], 1.0);
	    		for(int i = 0; i < NUM_POINTS; i++) {
	    			background.rgb = mix(background.rgb, u_colors[i], percentages[i]);
	    		}

	    		vec4 textureColor = texture2D(u_texture, uv);
	    		float grayScaleCol = (textureColor.r + textureColor.g + textureColor.b)/3.0;
	    		textureColor.rgb = vec3(grayScaleCol);
	    		textureColor.rgb = (1.0 - textureColor.rgb)*0.5;

	    		background += textureColor;

	    		//background = vec4(1.0, 0.0, 0.0, 1.0);

	    		//background = background + smoothstep(0.44, 0.45, dist);
	    
				gl_FragColor = background;
			}