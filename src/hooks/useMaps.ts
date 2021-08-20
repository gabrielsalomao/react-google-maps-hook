// import MarkerClusterer from "@googlemaps/markerclustererplus";
import { useState } from "react";

export type Map = google.maps.Map;
export type LatLng = google.maps.LatLngLiteral;
export type Marker = google.maps.Marker;
export type MarkerOptions = google.maps.MarkerOptions;

interface Parameters {
  zoom?: number;
  center?: LatLng;
}

export const useMaps = (opt?: Parameters) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [map, setMap] = useState<Map | null>(null);
  const [markerClusterer, setMarkerClusterer] =
    // @ts-ignore MarkerClusterer defined via script
    useState<MarkerClusterer | null>(null);
  const defaultCenter: LatLng = { lat: -36.15786, lng: 163.677811 };
  const defaultZoom = 3;

  const addMarker = (
    options: MarkerOptions,
    onClick?: (marker: Marker) => void
  ) => {
    var marker = new google.maps.Marker({
      ...options,
    });

    setMarkers((old) => [...old, marker]);

    if (onClick) marker.addListener("click", () => onClick(marker));
  };

  const addMarkers = (markers: Marker[]) => {
    markers.forEach((m) => m.setMap(map));
  };

  const getMarkers = (): Marker[] => {
    return markers;
  };

  const getMarker = (index: number): Marker => {
    return markers[index];
  };

  const deleteMarker = (index: number) => {
    hideMarker(index);
    markers.splice(index, 1);
  };

  const deleteMarkers = () => {
    hideMarkers();
    setMarkers([]);
  };

  const hideMarker = (index: number) => {
    markers[index].setMap(null);
  };

  const hideMarkers = () => {
    for (let i = 0; i < markers.length; i++) {
      hideMarker(i);
    }
  };

  const showMarker = (index: number): void => {
    markers[index].setMap(map);
  };

  const showMarkers = () => {
    for (let i = 0; i < markers.length; i++) {
      showMarker(i);
    }
  };

  const enableClusterer = () => {
    // @ts-ignore MarkerClusterer defined via script
    var clusterer = new MarkerClusterer(map!, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });

    setMarkerClusterer(clusterer);
  };

  const disableClusterer = () => {
    markerClusterer?.removeMarkers(markers);
    markerClusterer?.clearMarkers();
    markerClusterer?.setMap(null);
    addMarkers(markers);
  };

  const initMap = (): void => {
    setMap(
      new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: opt?.center || defaultCenter,
        zoom: opt?.zoom || defaultZoom,
      })
    );
  };

  return {
    map,
    initMap,
    markers,
    addMarker,
    getMarker,
    getMarkers,
    showMarkers,
    hideMarkers,
    deleteMarker,
    deleteMarkers,
    enableClusterer,
    disableClusterer,
  };
};
