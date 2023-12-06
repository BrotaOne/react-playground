import { getRandColor } from './utils';

type SquareType = {
    size: [number, number];
    color: [number, number, number, number];
    velocity: number;
    position: [number, number];
}

class Square implements SquareType {
    size: [number, number];
    color: [number, number, number, number];
    velocity: number;
    position: [number, number];

    constructor( gl: WebGLRenderingContext) { 
        const nums = Array.from({ length: 4 }, () => Math.random());
        const size: SquareType['size'] = [
            5 + 120 * nums[0],
            5 + 120 * nums[1],
        ];
        this.color = getRandColor();
        this.size = size;
        this.velocity = nums[2] * 6.0 + 1.0;
        this.position = [
            nums[3] * (gl.drawingBufferWidth - size[0]),
            gl.drawingBufferHeight,
        ];
        
        gl.clearColor(...this.color);
    }
}

let stop = true;
let rect: SquareType | null;
let score = 0;
let missed = 0;

type OnStatusChange = ({ type, value }: { type: 'start' | 'stop' | 'got' | 'miss', value?: number }) => void;

export const squareAnimation = (onStatusChange?: OnStatusChange) => { 
    const start = (gl: WebGLRenderingContext) => {
        if (!rect) { 
            rect = new Square(gl);
        }

        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(...rect.position, ...rect.size);
        gl.clear(gl.COLOR_BUFFER_BIT);

        rect.position[1] -= rect.velocity;

        if (rect.position[1] < 0) {
            rect = new Square(gl);
            missed++;
            console.log('score', score, 'missed', missed)
            onStatusChange && onStatusChange({
                type: 'miss',
                value: missed,
            });
        }

        !stop && requestAnimationFrame(() => start(gl));
    };

    const stopGame = () => {
        stop = true;
        score = 0;
        missed = 0;
        rect = null;
    };

    return {
        start: (gl: WebGLRenderingContext, time: number = 0) => {
            stop = false;
            start(gl);
            time && setTimeout(() => {
                stopGame();
                onStatusChange && onStatusChange({
                    type: 'stop',
                })
            }, time*1000);
        },
        stop: stopGame,
        playerClick: (gl: WebGLRenderingContext) => (evt: any) => { 
            if (!evt.target || !rect || stop) {
                return;
            }
            
            const position = [
                evt.pageX - evt.target.offsetLeft,
                gl.drawingBufferHeight - (evt.pageY - evt.target.offsetTop),
            ];
            
            const diffPos = [
                position[0] - rect.position[0],
                position[1] - rect.position[1],
            ];
            if (
                diffPos[0] >= 0 &&
                diffPos[0] < rect.size[0] &&
                diffPos[1] >= 0 &&
                diffPos[1] < rect.size[1]
            ) {
                score += 1;
                // scoreDisplay.textContent = score;
                rect = new Square(gl);
                console.log('score', score, 'missed', missed)
                onStatusChange && onStatusChange({
                    type: 'got',
                    value: score,
                });
            }
        }
    }
}