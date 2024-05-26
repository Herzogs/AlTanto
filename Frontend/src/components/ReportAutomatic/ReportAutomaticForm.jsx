import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { isMobile } from 'react-device-detect';
import ImagenDetection from '../../services/ImagenDetection';

const App = () => {
  const [cameraActive, setCameraActive] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [analisis, setAnalisis] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: 'user',
  };

  useEffect(() => {
    console.log('Cámara activada automáticamente');
  }, []);

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
    setCameraActive(false);
    setIsProcessing(true);
    console.log("se guardo la foto");

    try {
      const detectionResult = await ImagenDetection(imageSrc);
      setAnalisis(detectionResult);
    } catch (error) {
      console.error('Error al detectar la imagen:', error);
      setAnalisis({ title: '', category: '', idCategory: null });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setCameraActive(true);
    setAnalisis({});
  };

  return (
    <div className="App">
      {cameraActive && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{ width: '100%', height: '70%', border: 'solid' }}
        />
      )}

      {!cameraActive && (
        <>
          <img src={photo} alt="Tomada" style={{ width: '50%', height: '50%', border: 'solid' }} />
          {isProcessing ? (
            <p>Procesando...</p>
          ) : (
            analisis && Object.keys(analisis).length > 0 ? (
              <div>
                <h2>Resultado del Análisis:</h2>
                <p>Título: {analisis.title}</p>
                <p>Categoría: {analisis.category}</p>
                <p>ID de Categoría: {analisis.idCategory}</p>
              </div>
            ) : (
              <p>Intente nuevamente.</p>
            )
          )}
        </>
      )}

      <div className="buttons">
        {cameraActive ? (
          <>
            <button onClick={capturePhoto}>Capturar</button>
            <button onClick={capturePhoto}>Subir (no anda)</button>
          </>
        ) : (
          <>
            <button onClick={clearPhoto}>Reintentar</button>
            <button onClick={capturePhoto}>Generar</button>
          </>
        )}
      </div>

      <style jsx>{`
        .App {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .buttons {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
