
'use client'

// from cpt-forever shader.js

export async function run_init(shader_info, retries = 3, delay = 1000) {

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Attempt ${attempt} to initialize gpu...`);
            if (!("gpu" in navigator)) {
                throw new Error(
                    "WebGPU is not supported. Enable chrome://flags/#enable-unsafe-webgpu flag."
                );
            }
        
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
              throw new Error("Failed to get GPU adapter.");
            }
            const device = await adapter.requestDevice();
        
            let size = ((shader_info.workgroup_size * shader_info.workgroups * shader_info.locs_per_thread) + shader_info.constant_locs) * 4;
            const mem_arr = new Uint8Array(size);
        
            let init;
            if (shader_info.race_val_strat == "Even") {
              init = 2;
            } else {
              init = 1;
            }
            for (let i = 0; i < mem_arr.byteLength; i++) {
              if (i % 4 == 0) {
                    mem_arr[i] =  init;
                }
                else {
                    mem_arr[i] = 0;
                }
            }
        
            const unit_arr = new Uint8Array(shader_info.workgroup_size * shader_info.workgroups * shader_info.uninit_vars * 4);
            let index_size = shader_info.workgroup_size * shader_info.workgroups * 4 * 5;
            let output_size = shader_info.workgroup_size * shader_info.workgroups * 4 * 5 * 2;
        
            const index_arr = new Uint8Array(index_size);
            const data_arr = new Uint8Array(256 * 4);
            const output_arr = new Uint8Array(output_size);
            const debug_arr = new Uint8Array(4);
        
            for (let i = 0; i < index_arr.byteLength; i++) {
                if (i % 4 == 0) {
                    index_arr[i] =  1;
                }
                else {
                    index_arr[i] = 0;
                }
            }
        
            for (let i = 0; i < output_arr.byteLength; i++) {
                if (i % 4 == 0) {
                    output_arr[i] =  0;
                }
                else {
                    output_arr[i] = 0;
                }
            }
        
            let gpuBuffers = [];
            gpuBuffers.push(device.createBuffer({
                label: "memory",
                mappedAtCreation: true,
                size: mem_arr.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC	
            }));
            gpuBuffers.push(device.createBuffer({
                label: "uninitialized",
                mappedAtCreation: true,
                size: unit_arr.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC	
            }));
            gpuBuffers.push(device.createBuffer({
                label: "index",
                mappedAtCreation: true,
                size: index_arr.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC	
            }));
            gpuBuffers.push(device.createBuffer({
                label: "data",
                mappedAtCreation: true,
                size: data_arr.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC	
            }));
            gpuBuffers.push(device.createBuffer({
                label: "output",
                mappedAtCreation: true,
                size: output_arr.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC	
            }));
            gpuBuffers.push(device.createBuffer({
                label: "debug",
                mappedAtCreation: true,
                size: debug_arr.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC	
            }));
        
            let arr_list = [mem_arr, unit_arr, index_arr, data_arr, output_arr, debug_arr]
            for (let i = 0; i < gpuBuffers.length; i++) {
                const arrayBufferArray = gpuBuffers[i].getMappedRange();
                new Uint8Array(arrayBufferArray).set(arr_list[i]);
                gpuBuffers[i].unmap();
            }
        
            let layoutEntries = [];
            for (let i = 0; i < arr_list.length; i++) {
                layoutEntries.push({
                    binding: i,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: "storage"
                    }
                });
            }
        
            const bindGroupLayout = device.createBindGroupLayout({
                entries: layoutEntries
            });
        
            let bindGroupEntries = [];
            for (let i = 0; i < arr_list.length; i++) {
                bindGroupEntries.push({
                    binding: i,
                    resource: {
                        buffer: gpuBuffers[i],
                    }
                })
            }
        
            const bindGroup = device.createBindGroup({
                layout: bindGroupLayout,
                entries: bindGroupEntries
            });
        
            //await gpuBufferArray.mapAsync(GPUMapMode.READ);
            //const arrayBuffer = gpuReadBuffer.getMappedRange();
            //console.log(new Float32Array(arrayBuffer));
            let readBuffers = [];
            for (let i = 0; i < arr_list.length; i++) {
                readBuffers.push(device.createBuffer({
                    size: arr_list[i].byteLength,
                    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
                }));
            }
        
            let outputBuffers = []
        
        
            return [device, readBuffers, outputBuffers, gpuBuffers, arr_list, bindGroupLayout, bindGroup]


        } catch (error) {
            console.error(`Error initializing gpu (attempt ${attempt}):`, error);

            // If error occurs, retry after a short delay
            if (attempt < retries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay)); // Wait before retrying
            } else {
                console.log("Max retries reached or error not recoverable.");
                return null; // Final failure
            }
        }
    }
    

}

export async function run_shader(shader, shader_info, init) {
    // console.log("init ", init);
    let [device, readBuffers, outputBuffers, gpuBuffers, arr_list, bindGroupLayout, bindGroup] = init
    
    let shaderModule = device.createShaderModule({
        code: shader
    });

    let computePipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        }),
        compute: {
            module: shaderModule,
            entryPoint: "main"
        },
        cache: false
    });

    let commandEncoder = device.createCommandEncoder();
    let passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(shader_info.workgroups >> 0);
    passEncoder.end();

    // clear output buffers to clear memory
    for (let i = 0; i < arr_list.length; i++) {
        delete outputBuffers[i];
    }

    outputBuffers.length = 0;

    outputBuffers = []

    for (let i = 0; i < arr_list.length; i++) {
        commandEncoder.clearBuffer(readBuffers[i])

        commandEncoder.copyBufferToBuffer(
            gpuBuffers[i] /* source buffer */,
            0 /* source offset */,
            readBuffers[i] /* destination buffer */,
            0 /* destination offset */,
            arr_list[i].byteLength /* size */
        );
    }

    let gpuCommands = commandEncoder.finish();
    device.queue.submit([gpuCommands]);

    // await device.queue.onSubmittedWorkDone();

    for (let i = 0; i < arr_list.length; i++) {
        await readBuffers[i].mapAsync(GPUMapMode.READ);

        const arrayBuffer = readBuffers[i].getMappedRange();

        outputBuffers.push(new Uint32Array(arrayBuffer).slice(0));
        readBuffers[i].unmap();
    }

    //set to null to allow garbage collection
    shaderModule = null;
    computePipeline = null; 
    commandEncoder = null;
    gpuCommands = null;
    passEncoder = null;



    console.log("Memory Usage:", performance.memory.usedJSHeapSize / 1024 / 1024, "MB");

    return outputBuffers;
}

// export async function free_gpu(init) {
//     if (!init) {
//         console.warn("No GPU resources to free.");
//         return;
//     }

//     let [device, readBuffers, outputBuffers, gpuBuffers, arr_list, bindGroupLayout, bindGroup] = init;

//     try {
//         console.log("Freeing GPU memory...");

//         // Destroy all GPU buffers
//         gpuBuffers.forEach(buffer => buffer.destroy());
//         readBuffers.forEach(buffer => buffer.destroy());
//         outputBuffers.forEach(buffer => buffer.destroy());

//         // Clear arrays to release references
//         gpuBuffers.length = 0;
//         readBuffers.length = 0;
//         outputBuffers.length = 0;
//         arr_list.length = 0;

//         // Destroy BindGroup and BindGroupLayout
//         bindGroup = null;
//         bindGroupLayout = null;

//         // Lose the GPU device to release memory
//         await device.lost;
//         await device.destroy();
//         device = null;

//         console.log("GPU memory successfully freed.");
//     } catch (error) {
//         console.error("Error freeing GPU memory:", error);
//     }
// }

export async function free_gpu(init) {
    if (!init) {
        console.warn("No GPU resources to free.");
        return;
    }

    let [device, readBuffers, outputBuffers, gpuBuffers, arr_list, bindGroupLayout, bindGroup] = init;

    try {
        console.log("Freeing GPU memory...");

        // Step 1: Ensure device is destroyed before handling buffers
        console.log("Destroying GPU device...");
        device.destroy();  // Destroy device first

        // Step 2: Wait for device loss to ensure cleanup
        try {
            await device.lost; // Wait for device to be officially lost
        } catch (error) {
            console.warn("GPU device lost error:", error);
        }

        // Step 3: Ensure all buffers are unmapped before destroying them
        console.log("Destroying GPU buffers...");
        gpuBuffers.forEach(buffer => {
            try {
                buffer.unmap?.(); // Unmap before destroying
                buffer.destroy();
            } catch (error) {
                console.warn("Error destroying GPU buffer:", error);
            }
        });

        readBuffers.forEach(buffer => {
            try {
                buffer.unmap?.();
                buffer.destroy();
            } catch (error) {
                console.warn("Error destroying read buffer:", error);
            }
        });

        outputBuffers.forEach(buffer => {
            try {
                buffer.unmap?.();
                buffer.destroy();
            } catch (error) {
                console.warn("Error destroying output buffer:", error);
            }
        });

        // Step 4: Clear references to allow garbage collection
        gpuBuffers.length = 0;
        readBuffers.length = 0;
        outputBuffers.length = 0;
        arr_list.length = 0;

        // Step 5: Explicitly release BindGroup and Layout
        console.log("Releasing BindGroup and Layout...");
        bindGroup = null;
        bindGroupLayout = null;

        console.log("GPU memory successfully freed.");
    } catch (error) {
        console.error("Error freeing GPU memory:", error);
    } finally {
        // Step 6: Set device to null to fully release reference
        device = null;
    }
}


