
export const switchColor = (gl: WebGLRenderingContext) => { 
    const getRandColor: () => [number, number, number, number] =
        () => ([Math.random(), Math.random(), Math.random(), 1]);
        
    gl.clearColor(...getRandColor());
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log(gl, gl.COLOR_BUFFER_BIT)
}