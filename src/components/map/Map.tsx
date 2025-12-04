"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
    }>;
    className?: string;
}

export default function Map({
    center = [51.505, -0.09],
    zoom = 13,
    markers = [],
    className = "h-full w-full rounded-lg"
}: MapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className={`flex items-center justify-center bg-muted/20 ${className}`}>
                <span className="text-muted-foreground">Loading Map...</span>
            </div>
        );
    }

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            className={className}
            style={{ zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={defaultIcon}
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
