"use client";

// whats next: 
// with the shaders we want to run, they have a more complex interface-- need to get sizes right
// being able to copy and paste shader into webpage
// code that runs the shaders exists in javascript, just have to port it to your website

// in my exmaple website, 
// textbox that takes in shader 
// have it run that shader that you paste in 
// should match gpu harbor interface

// 2 shaders
// i input buffers and sizes, then run shader

// eventually want two shaders and compare output
// do 2 text boxes to compute

// set up these 5 bufferes so that it actually runs
// where is data buffer size stored
// use dummy sizes workgroup_size and workgroups 


import { useCallback } from 'react';

async function main() {
    
    // get a webgpu device
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
        alert('need a browser that supports WebGPU');
        return;
    }

    // creat shader module with code from textbox
    const module = device.createShaderModule({code});

    const pipeline = device.createComputePipeline({
        layout: 'auto',
        compute: { module },
    });

    // from cptforever shader.js: creating 

    // data to input
    const input = new Float32Array([1, 3, 5]);
        
    // create a buffer on the GPU to hold our computation
    // input and output
    const workBuffer = device.createBuffer({
        size: input.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    });
    // Copy our input data to that buffer
    device.queue.writeBuffer(workBuffer, 0, input);

    // create a buffer on the GPU to get a copy of the results
    const resultBuffer = device.createBuffer({
        label: 'result buffer',
        size: input.byteLength,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    // Setup a bindGroup to tell the shader which
    // buffer to use for the computation
    const bindGroup = device.createBindGroup({
        label: 'bindGroup for work buffer',
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: workBuffer } }],
    });

    // Encode commands to do the computation
    const encoder = device.createCommandEncoder({ label: 'doubling encoder' });
    const pass = encoder.beginComputePass({ label: 'doubling compute pass' });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(input.length);
    pass.end();

    // Encode a command to copy the results to a mappable buffer.
    encoder.copyBufferToBuffer(workBuffer, 0, resultBuffer, 0, resultBuffer.size);

    // Finish encoding and submit the commands
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    // Read the results
    await resultBuffer.mapAsync(GPUMapMode.READ);
    const result = new Float32Array(resultBuffer.getMappedRange().slice());
    resultBuffer.unmap();

    console.log('input', input);
    console.log('result', result);
}

export default function WebGPUExample() {
const handleClick = useCallback(() => {
    main();
}, []);

//    <button onClick={handleClick}>Run</button>
return (
    <div>
    <h1>WebGPU Compute Shader Example</h1>
    <button
        onClick={handleClick}
        style={{
          backgroundColor: 'blue', // Set the background color to blue
          color: 'white',           // Set text color to white for contrast
          padding: '10px 20px',     // Increase padding for button size
          fontSize: '16px',         // Increase font size
          borderRadius: '5px',      // Optional: add rounded corners
          border: 'none',           // Remove border
          cursor: 'pointer'         // Change cursor to pointer on hover
        }}
      >
        Run
      </button>
    <canvas></canvas>
    </div>
);
}