export const addVignette = (canvas: HTMLCanvasElement, value: number) => {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let gradient;
    // let outerRadius = Math.sqrt( Math.pow( canvas.width/2, 2 ) + Math.pow( canvas.height/2, 2 ) );
    const outerRadius = canvas.width * (1 - (value/2));

    // Adds outer darkened blur effect
    ctx.globalCompositeOperation = 'source-over';
    gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, outerRadius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.65, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adds central lighten effect
    ctx.globalCompositeOperation = 'lighter';
    gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, outerRadius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};
