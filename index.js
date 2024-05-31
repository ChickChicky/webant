'use strict';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const env = {
    mx : -1,
    my : -1,
    mb : {},
    s : 1,
    k : {},
    /** @type {Uint32Array} */
    screen : null,
    screen_w : null,
    screen_h : null,
    ox : 0,
    oy : 0,
    speed : 10,
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
        if (instance && instance.exports && instance.exports.tick) {
            instance.exports.render(env.ox,env.oy);
        }
        if (env.screen) {
            const img = ctx.createImageData(env.screen_w,env.screen_h,{colorSpace:'srgb'});
            img.data.set(new Uint8Array(env.screen.buffer),0);
            ctx.imageSmoothingEnabled = false;
            const ox = env.w/2-env.screen_w*env.s/2;
            const oy = env.h/2-env.screen_h*env.s/2;
            const c = new OffscreenCanvas(env.screen_w,env.screen_h);
            c.getContext('2d').putImageData(img,0,0);
            ctx.drawImage(
                c,
                0,0,
                env.screen_w, env.screen_h,
                ox,oy,
                env.screen_w*env.s, env.screen_h*env.s,
            );
            // ctx.putImageData(img,0,0);
        }
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
            const [ addr, w, h ] = args;
            const sz = w*h;
            env.screen = new Uint32Array(memory.buffer.slice(addr,addr+sz*4));
            env.screen_w = w;
            env.screen_h = h;
        }
    },
};

canvas.addEventListener( 'mousemove',
    ev => { ev.preventDefault();
        if (env.mb[0]) {
            env.ox -= ev.movementX/env.s;
            env.oy -= ev.movementY/env.s;
        }
    return true; },
    true
);

canvas.addEventListener( 'mousedown',
    ev => { ev.preventDefault();
        env.mb[ev.button] = true;
    return true; },
    true
);

canvas.addEventListener( 'mouseup',
    ev => { ev.preventDefault();
        // delete env.mb[ev.button];
        env.mb[ev.button] = false;
    return true; },
    true
);

canvas.addEventListener( 'touchstart',
    ev => { ev.preventDefault();
        
    return true; },
    true
);

canvas.addEventListener( 'touchmove',
    ev => { ev.preventDefault();

        
        
    return true; },
    true
);

canvas.addEventListener( 'touchend',
    ev => { ev.preventDefault();

        
        
    return true; },
    true
);

canvas.addEventListener( 'wheel',
    ev => { ev.preventDefault();
        if (ev.ctrlKey) {
            let d = (ev.deltaX + ev.deltaY) / 100;
            env.s *= 2**d;
        } else {
            env.ox -= ev.deltaX/env.s;
            env.oy -= ev.deltaY/env.s;
        }
    return true; },
    true
);

;(async()=>{

    try {
        const wasm = await fetch('sim.wasm');
        ( { instance } = await WebAssembly.instantiate(await wasm.arrayBuffer(),WasmLib) );
        memory = new Uint8Array(instance.exports.memory.buffer);
        memory_view = new DataView(instance.exports.memory.buffer);
        
        console.log(instance.exports);
        // instance.exports.speed = 100;

        instance.exports.init();
        
        while (true) {
            instance.exports.tick();
            await new Promise( r=>setTimeout(r,2) );
        }
    } catch (e) {
        console.error(e);
    }

})();