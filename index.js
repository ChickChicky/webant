'use strict';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const env = {
    mx : -1,
    my : -1,
    k : {},
};

canvas.onmousemove =
    e => {
        env.mx = e.offsetX;
        env.my = e.offsetY;
        return true;
    }
;

document.onkeydown =
    e => {
        env.k[e.key] = true;
    }
;

document.onkeyup =
    e => {
        delete env.k[e.key];
    }
;

{
    function update() {
        canvas.width = env.w = window.innerWidth;
        canvas.height = env.h = window.innerHeight;
        canvas.style.width = `${env.w}px`;
        canvas.style.height = `${env.h}px`;
        requestAnimationFrame(update);
    }
    update();
    env.update = update;
}

// -- THE "GAME" -- //

/** @type {WebAssembly.Instance} */
var instance;
/** @type {Uint8Array}  */
var memory;
/** @type {DataView} */
var memory_view;

const WasmLib = {
    'env': {
        set_render_data(...args) {
            console.log(args);
        }
    },
};

;(async()=>{

    try {
        const wasm = await fetch('sim.wasm');
        ( { instance } = await WebAssembly.instantiate(await wasm.arrayBuffer(),WasmLib) );
        memory = new Uint8Array(instance.exports.memory.buffer);
        memory_view = new DataView(instance.exports.memory.buffer);
        
        instance.exports.init();
        
        while (true) {
            instance.exports.tick(0,0);
            await new Promise( r=>setTimeout(r,1) );
        }
    } catch (e) {
        console.error(e);
    }

})();