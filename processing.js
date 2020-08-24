var model;

async function loadModel() {

  model = await tf.loadGraphModel('TFJS/model.json')

}

function predictImage() {

  // Reading the image from the canvas
  let image = cv.imread(canvas);

  // Conversion to grayscale
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);

  // Increasing the contrast (making the digit white)
  cv.threshold(image, image, 140, 255, cv.THRESH_BINARY);

  // Finding the contours of the digit
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  // Finding the bounding rectangle from the Contours and cropping the image
  let cnt = contours.get(0);
  let rect = cv.boundingRect(cnt);
  image = image.roi(rect);

  // Resizing the image to fit in a 20x20 canvas
  var height = image.rows;
  var width = image.cols;
  var scaleFactor;

  if (height > width) {
    scaleFactor = height / 20;
  } else {
    scaleFactor = width / 20;
  }

  height = Math.round(height / scaleFactor);
  width = Math.round(width / scaleFactor);
  let newSize = new cv.Size(width, height);

  cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

  // Adding the padding
  const LEFT_PAD = Math.ceil(4 + (20 - width) / 2);
  const RIGHT_PAD = Math.floor(4 + (20 - width) / 2);
  const TOP_PAD = Math.ceil(4 + (20 - height) / 2);
  const BOTTOM_PAD = Math.floor(4 + (20 - height) / 2);

  let BLACK_COLOR = new cv.Scalar(0,0,0,255);
  cv.copyMakeBorder(image, image, TOP_PAD, BOTTOM_PAD, LEFT_PAD, RIGHT_PAD, cv.BORDER_CONSTANT, BLACK_COLOR);

  // Calculating the Centre of Mass
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  cnt = contours.get(0);
  const Moments = cv.moments(cnt, false);

  const cx = Moments.m10 / Moments.m00;
  const cy = Moments.m01 / Moments.m00;
  // console.log(`M00: ${Moments.m00}, cx: ${cx}, cy: ${cy}`);

  // Shifting the image
  const X_SHIFT = Math.round(image.cols / 2.0) - cx;
  const Y_SHIFT = Math.round(image.rows / 2.0) - cy;

  let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
  let dsize = new cv.Size(image.rows, image.cols);
  cv.warpAffine(image, image, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK_COLOR);

  // Normalizing pixel values
  let pixelValues = Float32Array.from(image.data);
  // console.log(pixelValues); // Print Acutal values
  pixelValues = pixelValues.map(function(item) {
    return item / 255;
  });
  //console.log(`scaled array: ${pixelValues}`); // Print New Values

  // Creating a tensor
  const X = tf.tensor([pixelValues]);
  // console.log(`Shape of Tensor: ${X.shape}`);
  // console.log(`Dtype of Tensor: ${X.dtype}`);

  const prediction = model.predict(X);
  prediction.print();
  const output = prediction.dataSync()[0];

  // console.log(tf.memory());

  // // Testing (to delete later)
  // const outputCanvas = document.createElement('CANVAS');
  // cv.imshow(outputCanvas, image);
  // document.body.appendChild(outputCanvas);


  // Cleanup
  image.delete();
  contours.delete();
  hierarchy.delete();
  cnt.delete();
  M.delete();

  X.dispose();
  prediction.dispose();

  // Return the prediction
  return output;

}
