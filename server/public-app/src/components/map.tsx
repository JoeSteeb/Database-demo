import View from "ol/View";
import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";
import { useEffect, useRef, useState } from "react";
import { fromLonLat } from "ol/proj";
import { OSM } from "ol/source";

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
      target: mapRef.current!,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
      ],
      view: new View({
        center: fromLonLat(coordinates),
        zoom: 10,
      }),
    });
    return () => {
      mapRef.current = null;
      mapInstance.setTarget("");
    };
  }, []);
  return <div ref={mapRef} className="w-2/3 h-50"></div>;
};
