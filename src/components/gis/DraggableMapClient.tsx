"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet default icon paths in Next.js
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Props {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

function LocationMarker({ position, setPosition }: { position: L.LatLng; setPosition: (p: L.LatLng) => void }) {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [setPosition]
  );

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

export default function DraggableMapClient({ latitude, longitude, onLocationChange }: Props) {
  const [position, setPosition] = useState<L.LatLng>(new L.LatLng(latitude, longitude));

  useEffect(() => {
    onLocationChange(position.lat, position.lng);
  }, [position, onLocationChange]);

  // Update internal state if props change significantly (initial load)
  useEffect(() => {
    setPosition(new L.LatLng(latitude, longitude));
  }, [latitude, longitude]);

  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden border border-emerald-300 shadow-sm relative z-0">
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <div className="absolute top-2 right-2 bg-white/90 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-700 shadow border border-slate-200 z-[1000] pointer-events-none">
        {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
      </div>
    </div>
  );
}
