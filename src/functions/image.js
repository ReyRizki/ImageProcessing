export const getImageMatrix = (cv, canvasId) => {
    const imageElement = document.getElementById(canvasId);
    const image = cv.imread(imageElement);

    return image;
}

export const showImageMatrix = (cv, image, canvasId) => {
    cv.imshow(canvasId, image);
}
