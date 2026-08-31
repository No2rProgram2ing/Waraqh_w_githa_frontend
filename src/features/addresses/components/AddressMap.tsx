import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface AddressMapProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER: [number, number] = [15.3694, 44.2066]; // Sana'a, Yemen

function LocationMarker({ position, setPosition }: { position: L.LatLng | null; setPosition: (pos: L.LatLng) => void }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
          map.flyTo(pos, map.getZoom());
        },
      }}
    />
  );
}

function LocateControl({ setPosition }: { setPosition: (pos: L.LatLng) => void }) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const locateUser = () => {
    setIsLocating(true);
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
      setIsLocating(false);
    }).on("locationerror", function () {
      alert("تعذر تحديد موقعك.");
      setIsLocating(false);
    });
  };

  return (
    <div className="absolute bottom-6 right-4 z-[1000]">
      <button
        type="button"
        onClick={(e) => {
            e.preventDefault();
            locateUser();
        }}
        disabled={isLocating}
        className="flex items-center gap-2 rounded-full border border-[#d2d8c8] bg-white/95 px-4 py-2.5 text-[13px] font-semibold text-[#3e483a] shadow-md transition-all hover:bg-gray-50 focus:outline-none disabled:opacity-70"
      >
        <Navigation className={`h-4 w-4 ${isLocating ? 'animate-pulse' : ''}`} />
        <span>تحديد موقعي</span>
      </button>
    </div>
  );
}

function MapUpdater() {
  const map = useMap();
  
  useEffect(() => {
    const mapContainer = map.getContainer();
    
    // استخدام مراقب الأبعاد كأفضل ممارسة لضمان حساب حجم الخريطة فور فتح النافذة
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(mapContainer);

    return () => {
      resizeObserver.unobserve(mapContainer);
      resizeObserver.disconnect();
    };
  }, [map]);
  
  return null;
}

export function AddressMap({ latitude, longitude, onChange }: AddressMapProps) {
  const [position, setPositionState] = useState<L.LatLng | null>(
    latitude && longitude ? new L.LatLng(latitude, longitude) : null
  );

  const handlePositionChange = (pos: L.LatLng) => {
    setPositionState(pos);
    onChange(pos.lat, pos.lng);
  };

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden z-0 border border-[#dfe5d8] shadow-sm [&_.leaflet-pane_img]:!max-w-none">
      <MapContainer
        center={position || DEFAULT_CENTER}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: "100%", width: "100%", zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        <MapUpdater />
        <LocationMarker position={position} setPosition={handlePositionChange} />
        <LocateControl setPosition={handlePositionChange} />
      </MapContainer>
    </div>
  );
}