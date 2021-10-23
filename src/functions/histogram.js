export const drawHistogram = (cv, image, channel) => {
    let srcVec = new cv.MatVector();
    srcVec.push_back(image);

    // options
    let accumulate = false;
    let channels = [channel];
    let histSize = [256];
    let ranges = [0, 255];
    let hist = new cv.Mat();
    let mask = new cv.Mat();
    let color = new cv.Scalar(255, 255, 255);
    let scale = 2;

    // You can try more different parameters
    cv.calcHist(srcVec, channels, mask, hist, histSize, ranges, accumulate);
    let result = cv.minMaxLoc(hist, mask);
    let max = result.maxVal;
    let dst = new cv.Mat.zeros(image.rows, histSize[0] * scale, cv.CV_8UC3);

    // draw histogram
    for (let i = 0; i < histSize[0]; i++) {
        let binVal = hist.data32F[i] * image.rows / max;
        let point1 = new cv.Point(i * scale, image.rows - 1);
        let point2 = new cv.Point((i + 1) * scale - 1, image.rows - binVal);
        cv.rectangle(dst, point1, point2, color, cv.FILLED);
    }

    return dst;
}