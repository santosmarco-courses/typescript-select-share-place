import * as React from "react";
import { BiTargetLock } from "react-icons/bi";

type MapMarkerProps = {
  lat: number;
  lng: number;
  label: string;
};

export const MapMarker = (props: MapMarkerProps) => (
  <div
    className="d-flex align-items-center position-absolute"
    style={styles.MapMarker}
  >
    <BiTargetLock size={45} />
    <div
      className="position-relative p-2 rounded bg-white shadow"
      style={styles.MapMarkerLabel}
    >
      {props.label}
    </div>
  </div>
);

const styles = {
  MapMarker: {
    width: "300px",
  },
  MapMarkerLabel: {
    maxWidth: "70%",
    left: "10px",
    top: "25px",
  },
};
