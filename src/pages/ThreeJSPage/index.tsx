import {useRef, useEffect} from 'react';
import * as THREE from 'three';
import {playCube} from './playCube';

const ThreeJSPage = () => {
    const domRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    const init = () => {
        rendererRef.current = new THREE.WebGLRenderer();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }
    
    useEffect(() => {
        init();
        if (domRef.current && rendererRef.current) {
            // const renderer = play();
            const renderer = rendererRef.current;
            if (domRef.current.querySelector('canvas')) {
                domRef.current.replaceChild(
                    renderer.domElement,
                    domRef.current.querySelector('canvas') as HTMLCanvasElement,
                );
            } else {
                domRef.current.appendChild(renderer.domElement);
            }
            playCube(renderer);
        }
    }, []);

    return (
        <div ref={domRef}>
            <h1>ThreeJSPage</h1>
        </div>
    )
};

export default ThreeJSPage;