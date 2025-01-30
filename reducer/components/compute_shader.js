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

    // creat shader module
    const module = device.createShaderModule({
        // WGSL code
        // javascript runs on cpu NOT gpu
        // gpu has it's own language-- WGSL
        // this code block is handed to the GPU to run

        
        label: 'doubling compute module',
        // create a variable called data of type storage
            // type as array<f32> --> an array of 32 bit floating point values
            // specify binding location 0 to bindGroup 0
        // then declare a function called computeSomething
            // @compute designates it as a compute shader
            // workgroup_size = 1 (equivalent to 1,1,1)
                // workgroup = small collection of threads, each runs in parallel
                // if workgroup size (3,2,4) we are defining a 3*2*4 = 24 thread workgroup
                // dispatchWorkgroups(4,3,2) means execute a workgroup of 24 threads 4*3*2=24 times = 576 threads
                // in this code, workgroup has 1 parameter id of type vec3u (3 unsigned 32 bit integer values), aka iteration number
            // index data and multiply each value by 2
        code: `
        @group(0) @binding(0) var<storage, read_write> data: array<f32>;

        @compute @workgroup_size(1) fn computeSomething(
            @builtin(global_invocation_id) id: vec3u
        ) {
            let i = id.x;
            data[i] = data[i] * 2.0;
        }
        `,
    });

    const pipeline = device.createComputePipeline({
        label: 'doubling compute pipeline',
        layout: 'auto',
        compute: { module },
    });

    // data to input
    const input = new Float32Array([1, 3, 5]);
        
    // create a buffer on the GPU to hold our computation
    // input and output
    const workBuffer = device.createBuffer({
        label: 'work buffer',
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