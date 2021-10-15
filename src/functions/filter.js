export const quantization = (cv, image, k) => {
    console.log(typeof k);
    // create float 32 matrix
    let sample = new cv.Mat(image.rows * image.cols, 3, cv.CV_32F);
    for (let y = 0; y < image.rows; y++) {
        for (let x = 0; x < image.cols; x++) {
            for (let z = 0; z < 3; z++) {
                sample.floatPtr(y + x * image.rows)[z] = image.ucharPtr(y, x)[z];
            }
        }
    }

    // k-means clustering
    let clusterCount = k;
    let labels = new cv.Mat();
    let attempts = 5;
    let centers = new cv.Mat();

    let crite = new cv.TermCriteria(cv.TermCriteria_EPS + cv.TermCriteria_MAX_ITER, 10000, 0.0001);

    cv.kmeans(sample, clusterCount, labels, crite, attempts, cv.KMEANS_RANDOM_CENTERS, centers);

    // create uint 8 matrix for result
    let newImage = new cv.Mat(image.size(), image.type());
    for (let y = 0; y < image.rows; y++) {
        for (let x = 0; x < image.cols; x++) {
            var cluster_idx = labels.intAt(y + x * image.rows, 0);

            let redChan = new Uint8Array(1);
            let greenChan = new Uint8Array(1);
            let blueChan = new Uint8Array(1);
            let alphaChan = new Uint8Array(1);

            redChan[0] = centers.floatAt(cluster_idx, 0);
            greenChan[0] = centers.floatAt(cluster_idx, 1);
            blueChan[0] = centers.floatAt(cluster_idx, 2);
            alphaChan[0] = 255;

            newImage.ucharPtr(y, x)[0] = redChan;
            newImage.ucharPtr(y, x)[1] = greenChan;
            newImage.ucharPtr(y, x)[2] = blueChan;
            newImage.ucharPtr(y, x)[3] = alphaChan;
        }
    }

    return newImage;
}