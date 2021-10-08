import Config from './Config';

class WebGL {
  private program: WebGLProgram;

  private canvas: HTMLCanvasElement;

  private gl: WebGLRenderingContext;

  private buffer: WebGLBuffer;

  private colorLocation: WebGLUniformLocation;

  private positionLocation: number;

  private resolutionLocation: WebGLUniformLocation;

  constructor(element: string, scale: number) {
    this.canvas = document.getElementById(element) as HTMLCanvasElement;
    this.gl = this.canvas.getContext('webgl', { antialias: false });

    const vertexShader = this.createShader(`
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    void main() {
      // convert the rectangle from pixels to 0.0 to 1.0
      vec2 zeroToOne = a_position / u_resolution;
      // convert from 0 -> 1 to 0 -> 2
      vec2 zeroToTwo = zeroToOne * 2.0;
      // convert from 0 -> 2 to -1 -> +1 (clipspace)
      vec2 clipSpace = zeroToTwo - 1.0;
      // Flip 0,0 from bottom left to conventional 2D top left.
      gl_PointSize = ${scale}.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }`, this.gl.VERTEX_SHADER);

    const fragmentShader = this.createShader(`
    precision mediump float;
    uniform vec4 u_color;
    void main() {
      gl_FragColor = u_color;
    }`, this.gl.FRAGMENT_SHADER);

    this.program = this.createGLProgram([vertexShader, fragmentShader]);
    this.gl.useProgram(this.program);

    // WebGL setup
    this.colorLocation = this.gl.getUniformLocation(this.program, 'u_color');
    this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
    this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);

    // Create a buffer.
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform4f(this.colorLocation, 1, 1, 1, 1);
    this.gl.clearColor(0, 0, 0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  setColor(r: number, g: number, b: number, a: number) {
    this.gl.uniform4f(this.colorLocation, r / 255, g / 255, b / 255, a);
  }

  drawPixel(x: number, y: number) {
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(
      [x + Config.scale / 2, y + Config.scale / 2],
    ), this.gl.STATIC_DRAW);
    this.gl.drawArrays(this.gl.POINTS, 0, 1);
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  createGLProgram(shaders: Array<WebGLShader>) {
    const program = this.gl.createProgram();
    for (let i = 0; i < shaders.length; i += 1) {
      this.gl.attachShader(program, shaders[i]);
    }

    this.gl.linkProgram(program);

    const linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!linked) {
      const lastError = this.gl.getProgramInfoLog(program);
      window.console.error(`Error in program linking: ${lastError}`);
      this.gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  createShader(shaderScriptText: string, shaderType: number) : WebGLShader {
    const shader = this.gl.createShader(shaderType);

    // Load the shader source
    this.gl.shaderSource(shader, shaderScriptText);

    // Compile the shader
    this.gl.compileShader(shader);
    return shader;
  }
}

export default WebGL;
