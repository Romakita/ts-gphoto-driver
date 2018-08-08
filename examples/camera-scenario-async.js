const { Camera, closeQuietly, CameraWidgets } = require('../lib');
const path = require('path');

const camera = new Camera();

console.log('[GPDRIVER] Camera init');
camera.initialize();

runScenario({
  autoFocus: true,
  triggerCapture: true,
  capture: true,
  preview: true
})
  .catch((er) => {
    console.error(er.message);
    return Promise.resolve();
  })
  .then(() => {
    closeQuietly(camera);
  });


function runScenario({ autoFocus = false, preview = false, capture = false, triggerCapture = false }) {
  console.log('[GPDRIVER] Camera Loaded');

  return Promise
    .resolve()
    .then(() => {
      if (autoFocus) {
        console.log('[GPDRIVER] Autofocus =============================');
        return runAutofocus();
      }
    })
    .then(() => {
      if (preview) {
        console.log('[GPDRIVER] Preview ===============================');
        return runPreview();
      }
    })
    .then(() => {
      if (triggerCapture) {
        console.log('[GPDRIVER] Trigger Capture =======================');
        return runTriggerCapture();
      }
    })
    .then(() => {
      if (capture) {
        console.log('[GPDRIVER] Capture ===============================');
        return runCapture();
      }
    });
}

/**
 *
 */
function runAutofocus() {
  const cfg = new CameraWidgets(camera);

  try {
    cfg.setValue('/actions/autofocusdrive', true);
    cfg.apply();
  } catch (er) {
    console.warn(er);
  } finally {
    closeQuietly(cfg);
  }
}

/**
 *
 */
function runPreview() {
  const filePath = path.join(__dirname, '../.tmp/capture.jpg');

  return camera
    .capturePreviewAsync(filePath)
    .then(() => {
      console.log('File saved on', filePath);
    });
}

/**
 *
 */
function runTriggerCapture() {
  return camera.triggerCaptureAsync()
}

/**
 *
 */
function runCapture() {
  const filePath = path.join(__dirname, '../.tmp/capture.jpg');

  return camera
    .captureImageAsync(filePath)
    .then(() => {
      console.log('File saved on', filePath);
    });
}