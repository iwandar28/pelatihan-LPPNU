"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, Phone, UserCheck, Award, Users } from "lucide-react";

// Fix for Leaflet default icon paths in Next.js
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom colored icons for membership status
const getMarkerIcon = (status: string) => {
  let color = "22c55e"; // Green for Active
  if (status === "ALUMNI") color = "3b82f6"; // Blue for Alumni
  if (status === "FIELD_COMPANION") color = "f97316"; // Orange for Companion

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
      status === "ALUMNI" ? "blue" : status === "FIELD_COMPANION" ? "orange" : "green"
    }.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

interface Participant {
  id: string;
  fullName: string;
  district: string;
  village: string;
  commodity: string;
  membershipStatus: "ACTIVE" | "ALUMNI" | "FIELD_COMPANION";
  latitude: number;
  longitude: number;
  address?: string | null;
  bioOrNotes?: string | null;
}

interface Props {
  participants: Participant[];
  selectedParticipantId?: string | null;
}

export default function ParticipantMapClient({ participants, selectedParticipantId }: Props) {
  // Center of Magelang Regency coordinates
  const defaultCenter: [number, number] = [-7.5492, 110.2641];

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-emerald-200/80 shadow-md relative">
      <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {participants.map((p) => {
          const isSelected = selectedParticipantId === p.id;
          return (
            <Marker key={p.id} position={[p.latitude, p.longitude]} icon={getMarkerIcon(p.membershipStatus)}>
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-2 max-w-xs font-sans">
                  <div className="flex items-center gap-2 border-b pb-1">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full text-white ${
                        p.membershipStatus === "ACTIVE"
                          ? "bg-emerald-600"
                          : p.membershipStatus === "ALUMNI"
                          ? "bg-blue-600"
                          : "bg-orange-600"
                      }`}
                    >
                      {p.membershipStatus === "ACTIVE"
                        ? "Anggota Aktif"
                        : p.membershipStatus === "ALUMNI"
                        ? "Alumni Training"
                        : "Pendamping Field"}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{p.fullName}</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    <strong className="text-slate-800">Komoditas:</strong> {p.commodity}
                  </p>
                  <p className="text-xs text-slate-500">
                    📍 Kecamatan {p.district}, Desa {p.village}
                  </p>
                  {p.address && <p className="text-[11px] text-slate-400 italic">{p.address}</p>}
                  {p.bioOrNotes && (
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100 text-[11px] text-slate-600">
                      {p.bioOrNotes}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1.5 z-[1000]">
        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">Status Keanggotaan</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span className="text-slate-700">Anggota Aktif</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
          <span className="text-slate-700">Alumni Pelatihan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
          <span className="text-slate-700">Pendamping Lapangan</span>
        </div>
      </div>
    </div>
  );
}
