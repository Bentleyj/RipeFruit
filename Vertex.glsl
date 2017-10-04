<vertexShader>
//Vertex Shader, just a pass=through, does nothing out of the ordinary
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position, 0, 1);
}
</VertexShader>