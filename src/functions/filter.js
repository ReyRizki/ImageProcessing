const adjustValue = (x, n) => {
    x += n;

    if (x > 255) {
        x = 255;
    }

    if (x < 0) {
        x = 0;
    }

    return x;
}

export const chageIntensity = (image, rgbValues) => {
    for (let row = 0; row < image.rows; row++) {
        for (let col = 0; col < image.cols; col++) {
            if (image.isContinuous()) {
                const pos = row * image.cols * image.channels() + col * image.channels();

                for (let i = 0; i < 3; i++) {
                    image.data[pos + i] = adjustValue(image.data[pos + i], rgbValues[i]);
                }
            }
        }
    }

    return image;
}

export const negative = (image) => {
    const result = image.clone();

    for (let row = 0; row < result.rows; row++) {
        for (let col = 0; col < result.cols; col++) {
            if (result.isContinuous()) {
                const pos = row * result.cols * result.channels() + col * result.channels();

                for (let i = 0; i < 3; i++) {
                    result.data[pos + i] = 255 - result.data[pos + i];
                }
            }
        }
    }

    return result;
}

export const sampling = (cv, image, type) => {
    let result = new cv.Mat();

    if (type === 'up') {
        cv.pyrUp(image, result, new cv.Size(0, 0), cv.BORDER_DEFAULT);
    } else if (type === 'down') {
        cv.pyrDown(image, result, new cv.Size(0, 0), cv.BORDER_DEFAULT);
    }

    return result;
}

export const quantization = (cv, image, k) => {
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

export const lowpassFilter = (cv, image) => {
    let result = new cv.Mat();
    let arr = [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9];
    let M = cv.matFromArray(3, 3, cv.CV_32FC1, arr);
    let anchor = new cv.Point(-1, -1);
    cv.filter2D(image, result, cv.CV_8U, M, anchor, 0, cv.BORDER_DEFAULT);

    return result;
}

export const highpassFilter = (cv, image) => {
    let result = new cv.Mat();
    let ksize = new cv.Size(0, 0);

    cv.GaussianBlur(image, result, ksize, 3);

    result.data.forEach((value, index) => {
        result.data[index] = image.data[index] - value + 127;
    })

    return result;
}

export const bandpassFilter = (cv, image) => {
    let g1 = new cv.Mat(), g2 = new cv.Mat();

    cv.GaussianBlur(image, g1, new cv.Size(1, 1), 1);
    cv.GaussianBlur(image, g2, new cv.Size(3, 3), 3);

    let result = image.clone();

    for (let row = 0; row < result.rows; row++) {
        for (let col = 0; col < result.cols; col++) {
            if (result.isContinuous()) {
                const pos = row * result.cols * result.channels() + col * result.channels();

                for (let c = 0; c < 3; c++) {
                    result.data[pos + c] = g2.data[pos + c] - g1.data[pos + c];
                }
            }
        }
    }

    return result;
}
