import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';

import Quagga from '@ericblade/quagga2';

function getMedian(arr) {
  arr.sort((a, b) => a - b);
  const half = Math.floor(arr.length / 2);
  if (arr.length % 2 === 1) {
    return arr[half];
  }
  return (arr[half - 1] + arr[half]) / 2;
}

function getMedianOfCodeErrors(decodedCodes) {
  const errors = decodedCodes
    .filter((x) => x.error !== undefined)
    .map((x) => x.error);
  const medianOfErrors = getMedian(errors);
  return medianOfErrors;
}

const ScannerVideo = ({ onDetected, enabled }) => {
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const scannerRef = useRef(null);
  const errorCheck = useCallback(
    (result) => {
      if (!onDetected) {
        return;
      }
      //console.log('check errors', result.codeResult.decodedCodes);
      const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
      // if Quagga is at least 75% certain that it read correctly, then accept the code.
      if (err < 0.25) {
        onDetected(result.codeResult.code);
      }
    },
    [onDetected]
  );

  const handleProcessed = (result) => {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;
    drawingCtx.font = '24px Arial';
    drawingCtx.fillStyle = 'green';

    // console.warn('* quagga onProcessed', result);
    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute('width')),
          parseInt(drawingCanvas.getAttribute('height'))
        );
        result.boxes
          .filter((box) => box !== result.box)
          .forEach((box) => {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
              color: 'purple',
              lineWidth: 2,
            });
          });
      }
      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
          color: 'blue',
          lineWidth: 2,
        });
      }
    }
  };

  if (scannerInitialized) {
    if (enabled) {
      console.log('STARTING SCANNNNNNEEEERRRRRR');
      Quagga.start();
    } else {
      console.log('Stopping SCANNNNEEEEERRRRRs');
      Quagga.stop();
    }
  }

  useLayoutEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 1280,
            height: 720,
            facingMode: 'environment',
          },
          target: scannerRef.current,
        },
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency || 0,
        readers: ['ean_reader', 'upc_reader'],
        locate: true,
      },
      (err) => {
        Quagga.onProcessed(handleProcessed);

        if (err) {
          return console.log('Error starting Quagga:', err);
        }
        console.log('SCANNNEEEERRRRRR INIITTIAAALLLIZZEED');
        setScannerInitialized(true);
      }
    );
    Quagga.onDetected(errorCheck);

    return () => {
      Quagga.offDetected(errorCheck);
      Quagga.offProcessed(handleProcessed);
      Quagga.stop();
    };
  }, [errorCheck]);
  return (
    <div ref={scannerRef} style={{ position: 'relative' }}>
      <canvas
        className="drawingBuffer"
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          height: '100%',
          width: '100%',
        }}
        width="640"
        height="480"
      />
    </div>
  );
};

export default ScannerVideo;
