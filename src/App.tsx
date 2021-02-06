import axios from "axios";
import GoogleMapReact from "google-map-react";
import * as React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import {
  FaChevronRight,
  FaExclamationCircle,
  FaSearchLocation,
} from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { MapMarker } from "./components";

type Place = {
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
};

type GoogleGeocodingResponseData = {
  status: string;
  error_message?: string;
  results: {
    formatted_address: string;
    geometry: {
      location: {
        lat: string;
        lng: string;
      };
    };
  }[];
};

const App = () => {
  const [typedAddress, setTypedAddress] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [place, setPlace] = React.useState<Place | null>(null);
  const [error, setError] = React.useState("");

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlace(null);
    setError("");
    setAddress(typedAddress);
    setTypedAddress("");
  };

  React.useEffect(() => {
    if (!address) return;

    axios
      .get<GoogleGeocodingResponseData>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
          address
        )}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
      )
      .then(({ data }) => {
        if (data.status !== "OK") {
          throw new Error(
            data.error_message ? data.error_message : "Unknown error."
          );
        }

        setPlace({
          address: data.results[0].formatted_address,
          coords: {
            lat: parseFloat(data.results[0].geometry.location.lat),
            lng: parseFloat(data.results[0].geometry.location.lng),
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [address]);

  return (
    <div className="bg-dark d-flex flex-column" style={styles.App}>
      <div
        className="bg-light d-flex align-items-center justify-content-center"
        style={styles.MapContainer}
      >
        {place ? (
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY! }}
            defaultCenter={place.coords}
            defaultZoom={17}
          >
            <MapMarker
              lat={place.coords.lat}
              lng={place.coords.lng}
              label={place.address}
            />
          </GoogleMapReact>
        ) : error ? (
          <div
            className="bg-danger text-light d-flex align-items-center"
            style={styles.ErrorContainer}
          >
            <Container>
              <Row>
                <Col
                  xs={12}
                  sm={3}
                  md={2}
                  className="d-flex align-items-center"
                >
                  <FaExclamationCircle />
                  <div className="ml-2 font-weight-bold">Error</div>
                </Col>
                <Col>{error}</Col>
              </Row>
            </Container>
          </div>
        ) : address ? (
          <ClipLoader />
        ) : (
          <div className="font-italic text-muted">
            Please enter an address below.
          </div>
        )}
      </div>
      <Container className="text-light" style={styles.InputContainer}>
        <Form className="h-100" onSubmit={handleAddressSubmit}>
          <Form.Row className="h-100 align-items-center">
            <Col xs={11}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaSearchLocation />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  placeholder="Enter an address..."
                  value={typedAddress}
                  onChange={(e) => setTypedAddress(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col>
              <Button block type="submit">
                <FaChevronRight />
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </Container>
    </div>
  );
};

const styles = {
  App: {
    width: "100vw",
    height: "100vh",
  },
  MapContainer: {
    height: "70%",
  },
  InputContainer: {
    flex: 1,
  },
  ErrorContainer: {
    height: "100%",
    flex: 1,
  },
};

export default App;
