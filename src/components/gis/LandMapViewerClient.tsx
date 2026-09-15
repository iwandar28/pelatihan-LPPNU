"use client";

import { useState } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import { Layers } from "lucide-react";

interface LandData {
  id: string;
  ownerName: string;
  status: string;
  farmerGroup: string;
  address: string;
  areaHectares: number;
  commodity: string;
  cultivator: string;
  geoJsonData: string;
  colorHex: string;
}

interface Props {
  initialLands: LandData[];
}

export default function LandMapViewerClient({ initialLands }: Props) {
  const [activeLands] = useState<LandData[]>(initialLands);

  const defaultCenter: [number, number] = [-7.5492, 110.2641];

  // Tile layer sources
  const BASEMAPS = {
    streets: {
      name: "Peta Jalan (Streets)",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    satellite: {
      name: "Satelit GPS (Esri)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS",
    },
    topography: {
      name: "Peta Topografi",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  };

  return (
    <div className="space-y-6">

      {/* Main Multi-Layer Leaflet Map */}
      <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-emerald-200 shadow-md relative">
        <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom={true} className="w-full h-full">
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name={BASEMAPS.streets.name}>
              <TileLayer attribution={BASEMAPS.streets.attribution} url={BASEMAPS.streets.url} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name={BASEMAPS.satellite.name}>
              <TileLayer attribution={BASEMAPS.satellite.attribution} url={BASEMAPS.satellite.url} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name={BASEMAPS.topography.name}>
              <TileLayer attribution={BASEMAPS.topography.attribution} url={BASEMAPS.topography.url} />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Database Land Polygons */}
          {activeLands.map((land) => {
            try {
              const parsedGeoJson = typeof land.geoJsonData === "string" ? JSON.parse(land.geoJsonData) : land.geoJsonData;

              return (
                <GeoJSON
                  key={land.id}
                  data={parsedGeoJson}
                  style={{
                    color: land.colorHex || "#22c55e",
                    weight: 3,
                    fillOpacity: 0.4,
                  }}
                  onEachFeature={(feature, layer) => {
                      const popupContent = `
                        <div class="p-2 space-y-1 min-w-[200px]">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Polygon Lahan GIS</div>
                        <h4 class="font-bold text-sm text-slate-900">${land.ownerName}</h4>
                        <div class="flex items-center gap-2">
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">${land.status}</span>
                        </div>
                        <p class="text-xs text-slate-500">📍 ${land.address}</p>
                        <p class="text-xs font-medium text-emerald-700">🌱 ${land.commodity} (${land.areaHectares} Ha)</p>
                        <p class="text-xs text-slate-600"><strong>Penggarap:</strong> ${land.cultivator || "-"}</p>
                        </div>
                      `;
                    layer.bindPopup(popupContent);
                  }}
                />
              );
            } catch (e) {
              return null;
            }
          })}
        </MapContainer>

        {/* Floating Layer Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-200 text-xs space-y-2 z-[1000] max-w-xs">
          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-600" />
            Legenda Lapisan Peta
          </div>
          <div className="space-y-1 text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500/60 border border-emerald-600 inline-block"></span>
              <span>Lahan Pertanian Database</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
