// Add this right before ctx.drawImage(video, 0, 0);
canvas.width = video.videoWidth * 2; // Double the size for better detail
canvas.height = video.videoHeight * 2;
ctx.scale(2, 2);

// Add a filter to make text sharper
ctx.filter = "contrast(1.5) grayscale(1) brightness(1.1)";
ctx.drawImage(video, 0, 0);
