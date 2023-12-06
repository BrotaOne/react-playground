import { useRef, useEffect } from 'react'
import enmy1 from './enemy1.png'
import './index.css'

let i = 0;

const randomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255); 
    const b = Math.floor(Math.random() * 255); 
    return `rgba(${(r * 0.393) + (g * 0.769) + (b * 0.189)}, ${(r * 0.349) + (g * 0.686) + (b * 0.168)}, ${(r * 0.272) + (g * 0.534) + (b * 0.131)}, ${Math.random()})`;

}

const drawSomething = (ctx: CanvasRenderingContext2D) => { 
    var posX = 20;
    var posY = 100;
    if (ctx) {
        ctx.fillRect(0, 0, 400, 400);
    }
        
    setInterval(function () {
        if (!ctx) return;
        if (posX > 400) posX = 20
        if (posY > 400) posY = 100;
        ctx.fillStyle = 'black';
        posX += 1;
        posY += 0.25;
        ctx.beginPath();
        ctx.fillStyle = randomColor();
        ctx.arc(posX, posY, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }, 0);
}

const CanvasPage = () => { 
    const canvasRef = useRef<CanvasRenderingContext2D | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => { 
        const dom = document.getElementById('mycanvas') as HTMLCanvasElement;
        if (dom) {
            canvasRef.current = dom.getContext('2d');
        }
      
    }, []);

    useEffect(() => { 
        imageRef.current = new Image();
        imageRef.current.src = enmy1;
        // pic.onload = function () {
        //     // console.log(123)
        //     // ctx.restore();
        //     // ctx.save();
        //     ctx.drawImage(pic, 0, 0);
        //     // ctx.restore();
        // };
    },[])

    const update = () => {
        if (canvasRef.current && !(i++%20)) {
            const ctx = canvasRef.current;
            ctx.clearRect(0, 0, 400, 400);
            

            // 画三角形
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(100, 100);
            ctx.lineTo(200, 200);
            ctx.lineTo(100, 200);


            // ctx.lineCap = 'round';
            // ctx.lineJoin = 'round';
            ctx.lineTo(100, 100);
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(300, 300);
            ctx.rect(300, 300, 20, 50);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.closePath();

            ctx.clearRect(150, 150, 170, 170);
            ctx.restore();

            ctx.save();
            ctx.font = 'Bold 30px Arial';
            ctx.strokeText('hello world', 150, 150);
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(250, 300);
            ctx.bezierCurveTo(200, 100, 400, 100, 400, 20);
            ctx.stroke();
            ctx.restore();



            const width = 293;
            
            imageRef.current && ctx.drawImage(imageRef.current, (i % 6) * width, 0, width, 155, 0, 0, 351.6, 155);
            // imageRef.current && ctx.drawImage(imageRef.current, 0, 0, 351.6, 31, 0, 0, 60, 5);
        
            const data = ctx.getImageData(0, 0, 400, 400);
            const grayscale = function (pixels: ImageData) {
                var d = pixels.data;
                for (var i = 0; i < d.length; i += 4) {
                  var r = d[i];
                  var g = d[i + 1];
                  var b = d[i + 2];
                  d[i] = d[i + 1] = d[i + 2] = (r + g + b) / 3;
                }
                return pixels;
            };
            console.log(data)
            ctx.putImageData(grayscale(data), 0, 0);
        }
        requestAnimationFrame(update);
        // setTimeout(update, 0);
    };

    useEffect(() => {
        update();
        // drawSomething(canvasRef.current as CanvasRenderingContext2D)
    }, [])

    const download = () => { 
        if(canvasRef.current) {
            const link = document.createElement('a');
            link.download = 'canvas.png';
            link.href = canvasRef.current.canvas.toDataURL();
            link.click();
        }
    }
    

    return (
        <div >
            <canvas
                id="mycanvas"
                width="400"
                height="400"
            />
            <button onClick={download}>下载图片</button>
        </div>
    )
}

export default CanvasPage