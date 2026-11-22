"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet with Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

interface MapProps {
    center?: [number, number];
    zoom?: number;
    markers?: Array<{
        id: string;
        position: [number, number];
        title: string;
        description?: string;
        isSoloFriendly?: boolean;
        rating?: number;
        order?: number;
        color?: string;
    }>;
    routes?: Array<{
        positions: [number, number][];
        color: string;
    }>;
    className?: string;
}

function MarkerViewport({ positions }: { positions: [number, number][] }) {
    const map = useMap();

    useEffect(() => {
        if (positions.length === 0) {
            map.setView([20, 0], 2);
        } else if (positions.length === 1) {
            map.setView(positions[0], 12);
        } else if (positions.length > 1) {
            map.fitBounds(positions, { padding: [40, 40], maxZoom: 12 });
        }
    }, [map, positions]);

    return null;
}

export default function Map({
    center = [51.505, -0.09],
    zoom = 13,
    markers = [],
    routes = [],
    className = "h-full w-full rounded-lg"
}: MapProps) {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            className={className}
            style={{ zIndex: 0 }}
        >
            <MarkerViewport positions={markers.map((marker) => marker.position)} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {routes.map((route, index) => route.positions.length > 1 && (
                <Polyline
                    key={`${route.color}-${index}`}
                    positions={route.positions}
                    pathOptions={{ color: route.color, weight: 5, opacity: 0.82, lineCap: "round", lineJoin: "round" }}
                />
            ))}
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={marker.order ? L.divIcon({
                        className: "",
                        html: `<div style="width:30px;height:30px;border-radius:999px;background:${marker.color ?? "#0f8b8d"};color:white;border:3px solid white;box-shadow:0 4px 12px rgba(15,61,67,.28);display:flex;align-items:center;justify-content:center;font:700 12px system-ui">${marker.order}</div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 15],
                        popupAnchor: [0, -18],
                    }) : defaultIcon}
                >
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-sm">{marker.title}</h3>
                            {marker.description && (
                                <p className="text-xs text-muted-foreground mt-1 mb-2">{marker.description}</p>
                            )}

                            <div className="border-t pt-2 mt-2">
                                <p className="text-[10px] font-semibold mb-1 text-muted-foreground">IS THIS SOLO FRIENDLY?</p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 gap-1">
                                        <ThumbsUp className="h-3 w-3 text-green-500" /> Yes
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 gap-1">
                                        <ThumbsDown className="h-3 w-3 text-red-500" /> No
                                    </Button>
                                </div>
                                {marker.isSoloFriendly && (
                                    <div className="mt-2 text-[10px] text-green-600 font-medium flex items-center gap-1">
                                        <ThumbsUp className="h-3 w-3" /> 95% say yes
                                    </div>
                                )}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
