import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { isMobile } from 'react-device-detect';
import ImagenDetection from '../../services/ImagenDetection';
import FormComponent from './FormComponent';

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
      setAnalisis({ title: '', category: '', idCategory: 0 });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageSrc = reader.result;
        setPhoto(imageSrc);
        setCameraActive(false);
        setIsProcessing(true);
        console.log("Imagen cargada");

        try {
          const detectionResult = await ImagenDetection(imageSrc);
          setAnalisis(detectionResult);
        } catch (error) {
          console.error('Error al detectar la imagen:', error);
          setAnalisis({ title: '', category: '', idCategory: 0 });
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setCameraActive(true);
    setAnalisis({});
    console.log("clearPhoto");
  };

  return (
    <div className="App" style={styles.app}>
      {cameraActive && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={styles.webcam}
        />
      )}

      {!cameraActive && (
        <>
          <img src={photo} alt="Tomada" style={styles.photo} />
          {isProcessing ? (
            <p>Procesando...</p>
          ) : (
            analisis && Object.keys(analisis).length > 0 && analisis.title !== 'none' ? (
            <FormComponent analisis={analisis} photo={photo}></FormComponent>
   
            ) : (
              <p>Intente nuevamente.</p>
            )
          )}
        </>
      )}

      <div className="buttons" style={styles.buttons}>
        {cameraActive ? (
          <>
            <button onClick={capturePhoto} >Capturar</button>
            <label htmlFor="upload" >Subir</label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </>
        ) : (
          <>
            <button onClick={clearPhoto}>Reintentar</button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
  },
  webcam: {
    width: '100%',
    height: '70%',
    border: 'solid',
  },
  photo: {
    width: '50%',
    height: '50%',
    border: 'solid',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  }
};

export default App;
