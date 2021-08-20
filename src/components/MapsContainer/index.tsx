import React, { useEffect, useState } from "react";

export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const loadGoogleMapsApiScript = (onload: () => void) => {
  const mapsURL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&language=pt-Br&region=pt-Br&libraries=places&libraries=drawing&v=weekly`;
  const scripts = document.getElementsByTagName("script");

  // verifica se já existe uma tag script do google maps
  for (let i = 0; i < scripts.length; i += 1) {
    if (scripts[i].src.indexOf(mapsURL) === 0) {
      return;
    }
  }

  const script = document.createElement("script");
  script.src = mapsURL;
  script.async = true;
  script.defer = true;
  script.onload = onload;

  window.document.body.appendChild(script);
};

const GoogleMapsLoadScriptContainer: React.FC = ({ children }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    loadGoogleMapsApiScript(() => {
      setScriptLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (scriptLoaded) {
      console.log("mapa carregado !!!");
    }
  }, [scriptLoaded]);

  return scriptLoaded ? <>{children}</> : <></>;
};

export default GoogleMapsLoadScriptContainer;
