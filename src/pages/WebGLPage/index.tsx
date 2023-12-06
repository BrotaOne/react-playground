import { useRef, useEffect, useState } from 'react'
import { switchColor } from './switchColor';
import { squareAnimation } from './squareAnimation';

const WebGLPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const [info, setInfo] = useState<{
        status: 'stop' | 'start';
        score: number;
        missed: number;
    }>({ status: 'stop', score: 0, missed: 0 })
    const { start, stop, playerClick } = squareAnimation((obj) => {
        console.log(obj, info);
        if(obj.type === 'stop' || obj.type === 'start') {
            setInfo(info=>({...info, status: obj.type as 'stop' | 'start'}));
        }
        if (!obj.value) {
            return;
        }
        if(obj.type === 'got') {
            setInfo(info=> ({...info, score: obj.value as number}));
        }
        if(obj.type === 'miss') {
            setInfo(info=>({...info, missed: obj.value as number}));
        }   
    });
    const isStop = info.status === 'stop';

    const handleAnimation = () => { 
        if (isStop) {
            const timeDom = document.getElementById('game-time') as HTMLInputElement;
            start(glRef.current as WebGLRenderingContext, Number(timeDom?.value));
        } else {
            stop();
            setInfo(info=> ({...info, score: 0, missed: 0}))
        }
        setInfo(info=> ({...info, status: isStop ? 'start' : 'stop'}))
    }

    useEffect(() => {
        let callback: (evt: any) => void;
        if (canvasRef.current) {
            // canvasRef.current.width = 100;
            // canvasRef.current.height = 100;
            const gl = canvasRef.current.getContext('webgl');
            if (gl instanceof WebGLRenderingContext) {
                callback = playerClick(gl);
                console.log('Congratulations! Your browser supports WebGL.')
                glRef.current = gl;
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                canvasRef.current.addEventListener('click', callback , false)
            }
        }
        return () => {
            if(canvasRef.current instanceof HTMLCanvasElement && callback) {
                canvasRef.current.removeEventListener('click', callback, false);
            }
        }
    }, [])

    return (
        <div>
            <h1>WebGLPage</h1>
            <button onClick={()=> glRef.current && switchColor(glRef.current)}>切换颜色</button>
            <button onClick={handleAnimation}>{isStop ? '开始动画' : '结束'}</button>
            <div>
                时长
                <input
                    id="game-time"
                    type="number"
                    min={0}
                    max={10}
                    step={1}
                    style={{ width: 200 }}
                />
                分数: {info.score}
                错误: {info.missed}
            </div>
            <canvas
                id="webgl-canvas"
                width="200"
                height="200"
                ref={canvasRef}
                style={{backgroundColor: 'black'}}
            />
        </div>
    )
};

export default WebGLPage;