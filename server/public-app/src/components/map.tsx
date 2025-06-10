import View from "ol/View";
import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";

import { useEffect, useRef } from "react";
import { fromLonLat } from "ol/proj";

type MapViewProps = {
  coordinates?: [number, number];
  zoom?: number;
};

export const MapView = ({ coordinates, zoom }: MapViewProps) => {
  if (!coordinates) {
    return <div className="w-50 h-50">No coordinates provided</div>;
  }
  if (!zoom) {
    zoom = 15; // Default zoom level
  }

  console.log("MapView coordinates:", coordinates);

  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = mapRef.current;
    if (!target) return;

    const mapInstance = new Map({
      target: target,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
      ],
      view: new View({
        center: fromLonLat(coordinates),
        zoom: zoom,
      }),
    });

    // Create the pin feature
    const marker = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    });

    // Optional: use an icon instead of default style
    marker.setStyle(
      new Style({
        image: new Icon({
          src: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // or any other icon
          scale: 0.05,
          anchor: [0.5, 1],
        }),
      })
    );

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker],
      }),
    });

    mapInstance.addLayer(vectorLayer);

    return () => {
      mapInstance.setTarget("");
    };
  }, [coordinates, zoom]);

  return <div ref={mapRef} className="w-2/3 h-full"></div>;
};
