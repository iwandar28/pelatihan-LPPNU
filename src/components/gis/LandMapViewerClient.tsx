"use client";

import { useState } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import L from "leaflet";
import { kml } from "@tmcw/togeojson";
import { Layers, Upload, FileText, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

interface LandData {
  id: string;
  title: string;
  farmerGroup: string;
  district: string;
  village: string;
  areaHectares: number;
  commodity: string;
  geoJsonData: string;
  colorHex: string;
}

interface Props {
  initialLands: LandData[];
}

export default function LandMapViewerClient({ initialLands }: Props) {
  const [activeLands, setActiveLands] = useState<LandData[]>(initialLands);
  const [uploadedGeoJSON, setUploadedGeoJSON] = useState<any | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  // Handle KML or GeoJSON File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let parsedGeoJson: any = null;

        if (file.name.toLowerCase().endsWith(".kml")) {
          const domParser = new DOMParser();
          const kmlDom = domParser.parseFromString(text, "text/xml");
          parsedGeoJson = kml(kmlDom);
        } else if (file.name.toLowerCase().endsWith(".json") || file.name.toLowerCase().endsWith(".geojson")) {
          parsedGeoJson = JSON.parse(text);
        } else {
          throw new Error("Format file tidak didukung. Harap upload file berformat .KML atau .GeoJSON");
        }

        if (!parsedGeoJson || !parsedGeoJson.features) {
          // If single feature object
          if (parsedGeoJson.type === "Feature" || parsedGeoJson.type === "Polygon") {
            parsedGeoJson = {
              type: "FeatureCollection",
              features: [parsedGeoJson.type === "Feature" ? parsedGeoJson : { type: "Feature", geometry: parsedGeoJson }],
            };
          } else {
            throw new Error("Struktur file GeoJSON/KML tidak valid.");
          }
        }

        setUploadedGeoJSON(parsedGeoJson);
      } catch (err: any) {
        setUploadError(err.message || "Gagal membaca file spasial.");
        setUploadedGeoJSON(null);
      }
    };
    reader.readAsText(file);
  };

  const clearUploadedFile = () => {
    setUploadedGeoJSON(null);
    setUploadFileName("");
    setUploadError(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload File Map Control Panel */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-600" />
            Upload File Peta (Simulasi KML / GeoJSON)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Pengunjung & Admin dapat mencoba mengunggah file polygon peta `.kml` atau `.geojson` untuk ditampilkan langsung di atas peta.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all">
            <FileText className="w-4 h-4" />
            Pilih File KML / GeoJSON
            <input type="file" accept=".kml,.json,.geojson" onChange={handleFileUpload} className="hidden" />
          </label>

          {uploadedGeoJSON && (
            <button
              onClick={clearUploadedFile}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus File Upload
            </button>
          )}
        </div>
      </div>

      {uploadFileName && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${uploadedGeoJSON ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"}`}>
          <div className="flex items-center gap-2">
            {uploadedGeoJSON ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>
              <strong>File Upload:</strong> {uploadFileName} {uploadedGeoJSON ? "(Berhasil dirender di peta)" : uploadError}
            </span>
          </div>
        </div>
      )}

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
                      <div class="p-2 space-y-1 font-sans">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Polygon Lahan GIS</div>
                        <h4 class="font-bold text-sm text-slate-900">${land.title}</h4>
                        <p class="text-xs text-slate-600"><strong>Poktan:</strong> ${land.farmerGroup}</p>
                        <p class="text-xs text-slate-600"><strong>Luas:</strong> ${land.areaHectares} Hektar</p>
                        <p class="text-xs text-slate-600"><strong>Komoditas:</strong> ${land.commodity}</p>
                        <p class="text-xs text-slate-500">📍 Desa ${land.village}, Kec. ${land.district}</p>
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

          {/* User Uploaded KML/GeoJSON Layer */}
          {uploadedGeoJSON && (
            <GeoJSON
              key="user-upload-layer"
              data={uploadedGeoJSON}
              style={{
                color: "#3b82f6",
                weight: 4,
                fillOpacity: 0.5,
                dashArray: "4",
              }}
              onEachFeature={(feature, layer) => {
                const name = feature.properties?.name || "Lahan Hasil Upload File";
                layer.bindPopup(`
                  <div class="p-2 font-sans">
                    <div class="text-[10px] font-bold uppercase text-blue-600">File KML/GeoJSON Parsed</div>
                    <h4 class="font-bold text-sm text-slate-900">${name}</h4>
                  </div>
                `);
              }}
            />
          )}
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
            {uploadedGeoJSON && (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-blue-500/60 border border-blue-600 inline-block"></span>
                <span>Polygon File Upload (.KML/.GeoJSON)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
