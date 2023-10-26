let video;
let canvas;
let cv;
let emotionModel;

async function onOpenCvReady() {
  cv = window.cv;
  video = document.getElementById('webcam');
  canvas = document.getElementById('canvas');

  // Load the Haar Cascade for face detection
  const faceCascade = new cv.CascadeClassifier();
  faceCascade.load('haarcascade_frontalface_default.xml');

  // Load the MobileNet-based emotion recognition model
  emotionModel = await tf.loadLayersModel('model.json');

  startWebcam();
}

async function startWebcam() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  video.addEventListener('play', () => {
    const src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    const gray = new cv.Mat();
    const faces = new cv.RectVector();

    const cap = new cv.VideoCapture(video);

    function processVideo() {
      cap.read(src);
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      faceCascade.detectMultiScale(gray, faces);

      for (let i = 0; i < faces.size(); i++) {
        const face = faces.get(i);
        const x = face.x;
        const y = face.y;
        const w = face.width;
        const h = face.height;

        // Extract the face region
        const faceImageData = getFaceImageData(src, x, y, w, h);

        // Preprocess the face image for emotion recognition
        const preprocessedImage = preprocessImage(faceImageData);

        // Classify emotions
        classifyEmotion(preprocessedImage);

        // Draw a rectangle around the detected face
        cv.rectangle(
          src,
          new cv.Point(x, y),
          new cv.Point(x + w, y + h),
          new cv.Scalar(0, 255, 0, 255),
          2
        );
      }

      cv.imshow(canvas, src);
      requestAnimationFrame(processVideo);

      src.delete();
      gray.delete();
      faces.delete();
    }

    processVideo();
  });
}

function getFaceImageData(src, x, y, w, h) {
  const rect = new cv.Rect(x, y, w, h);
  const faceImage = new cv.Mat();
  src.roi(rect).copyTo(faceImage);
  return faceImage;
}

function preprocessImage(faceImageData) {
  const tensor = tf.browser.fromPixels(faceImageData);
  const resized = tf.image.resizeBilinear(tensor, [224, 224]);
  const normalized = resized.div(255.0);
  return normalized;
}

async function classifyEmotion(faceImage) {
  const prediction = emotionModel.predict(faceImage);
  const emotions = [
    'Angry',
    'Disgust',
    'Fear',
    'Happy',
    'Sad',
    'Surprise',
    'Neutral',
  ];
  const maxIndex = prediction.argMax().dataSync()[0];
  const emotion = emotions[maxIndex];
  console.log('Detected Emotion: ' + emotion);
}
