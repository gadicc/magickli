import React, { useEffect, useState } from "react";

export default function useGeo() {
  const [geoData, setGeoData] = useState();

  useEffect(() => {
    fetch("https://get.geojs.io/v1/ip/geo.json")
      .then((response) => response.json())
      .then((json) => {
        json.latitude = Number(json.latitude);
        json.longitude = Number(json.longitude);
        setGeoData(json);
      });
  }, []);

  return geoData;
}
