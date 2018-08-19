export function handleImgUpload(event: any, cb: (src: string, thumbSrc: string, error?: boolean) => void) {
    const files = event.target.files;
    const imgFile = files[0];
    if (!imgFile.type.match(/image.*/)) {
        return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.onload = () => {
            const origSrc = getOrigSrc(img);
            const thumbSrc = getThumbSrc(img);
            cb(origSrc, thumbSrc);
        };
    };
    reader.readAsDataURL(imgFile);
}

function getOrigSrc(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 1000;
    const MAX_HEIGHT = 1000;
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/png');
}

function getThumbSrc(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 120;
    const MAX_HEIGHT = 120;
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/png');
}
