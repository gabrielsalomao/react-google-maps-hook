// import MarkerClusterer from "@googlemaps/markerclustererplus";
import { useState } from "react";

export type Map = google.maps.Map;
export type LatLng = google.maps.LatLngLiteral;
export type Marker = google.maps.Marker;
export type MarkerOptions = google.maps.MarkerOptions;
export type DrawingManager = google.maps.drawing.DrawingManager;

interface Parameters {
  zoom?: number;
  center?: LatLng;
  enableDrawing?: boolean;
}

export const useMaps = (opt?: Parameters) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [map, setMap] = useState<Map | null>(null);
  const [markerClusterer, setMarkerClusterer] =
    // @ts-ignore MarkerClusterer defined via script
    useState<MarkerClusterer | null>(null);
  const defaultCenter: LatLng = { lat: -36.15786, lng: 163.677811 };
  const [drawingManager, setDrawingManager] = useState<DrawingManager | null>(
    null
  );
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
    const newMap = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: opt?.center || defaultCenter,
        zoom: opt?.zoom || defaultZoom,
      }
    );

    if (opt?.enableDrawing) {
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        markerOptions: {
          icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        },
        // circleOptions: {
        //   fillColor: "#ffff00",
        //   fillOpacity: 1,
        //   strokeWeight: 5,
        //   clickable: false,
        //   editable: true,
        //   zIndex: 1,
        // },
      });

      google.maps.event.addListener(
        drawingManager,
        "circlecomplete",
        function (circle: any) {
          var radius = circle;
          console.log(radius);
        }
      );

      google.maps.event.addListener(
        drawingManager,
        "polygoncomplete",
        (polygon: any) => {
          var path = polygon.getPath();
          var coordinates = [];
          for (var i = 0; i < path.length; i++) {
            coordinates.push({
              lat: path.getAt(i).lat(),
              lng: path.getAt(i).lng(),
            });
          }
          console.log(coordinates);
        }
      );

      drawingManager.setMap(newMap);
      setDrawingManager(drawingManager);
    }

    setMap(newMap);
  };

  const addPolygon = () => {
    var latLngs = [
      {
        lat: -41.29640367175032,
        lng: 130.19148287499996,
      },
      {
        lat: -9.863364109647094,
        lng: 112.96492037499998,
      },
      {
        lat: -17.20642255648777,
        lng: 141.44148287499996,
      },
      {
        lat: -36.37045797211259,
        lng: 150.40632662499996,
      },
      {
        lat: -15.18086105607723,
        lng: 166.40242037499996,
      },
      {
        lat: -52.20257569391751,
        lng: 148.82429537499996,
      },
    ];

    const bermudaTriangle = new google.maps.Polygon({
      paths: latLngs,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
    });
    bermudaTriangle.addListener("click", (e: any) => {
      console.log(bermudaTriangle);
    });
    bermudaTriangle.setMap(map);
  };

  return {
    map,
    addPolygon,
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
