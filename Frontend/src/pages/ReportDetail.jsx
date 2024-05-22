import React, { useState } from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Map from "../components/Map";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function ReportDetail() {
  const location = useLocation();
  const report = location.state?.report || {};

  const { title, content, latitude, longitude, images } = report;

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
  };

  const [imgFirebase, setImgFirebase] = useState();

  const getImages = async () => {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const storageRef = ref(storage, "images/" + images);
    const url = await getDownloadURL(storageRef);
    setImgFirebase(url);
  };

  useEffect(() => {
    getImages().then();
  }, []);

  return (
    <section className="container_home">
      <div className="top-section">
        <Container>
          <h2>Detalle del reporte</h2>
          <p>Titulo: {title}</p>
          <p>Descripción: {content}</p>
          {imgFirebase && <img src={imgFirebase} style={{maxWidth:'420px'}}></img>}
        </Container>
      </div>
      <div className="bottom-section">
        <Map localization={{ lat: latitude, lon: longitude }} />
      </div>
    </section>
  );
}

export default ReportDetail;
