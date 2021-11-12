import React, { useState, useEffect } from "react";
import { useOpenCv } from "opencv-react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Row,
  Col,
  Spinner,
  Dropdown,
} from "react-bootstrap";

import RgbModal from "../../components/rgb-modal";
import QuantizationModal from "../../components/quantization-modal";
import OpenImageModal from "../../components/open-image-modal";

import { getImageMatrix, showImageMatrix } from "../../functions/image";
import { drawHistogram } from "../../functions/histogram";
import {
  negative,
  lowpassFilter,
  highpassFilter,
  bandpassFilter,
  sampling,
} from "../../functions/filter";

import "./styles.scss";

export default function Home() {
  const { loaded, cv } = useOpenCv();
  const [mode, setMode] = useState("image");
  const [imageSrc, setImageSrc] = useState(null);
  const [imageResult, setImageResult] = useState(null);

  const [isOpenImageModalShowed, toggleOpenImageModal] = useState(false);
  const [isRgbModalShowed, toggleRgbModal] = useState(false);
  const [isQuantizationModalShowed, toggleQuantizationModal] = useState(false);

  let imageElement = document.getElementById("image-src");
  const colors = ["Red", "Green", "Blue"];

  const clearCanvas = (canvasId) => {
    const canvas = document.getElementById(canvasId);

    if (canvas) {
      const context = canvas.getContext("2d");

      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Container
      fluid
      className="px-0 d-flex justify-content-between"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      onMouseOver={(e) => {
        e.preventDefault();

        onClick(e);
      }}
    >
      <span>{children}</span>
      <span>&#9656;</span>
    </Container>
  ));

  useEffect(() => {
    if (imageSrc && loaded) {
      imageElement.onload = () => {
        const image = cv.imread(imageElement);

        setImageResult(image);
      };
    } else if (imageSrc === null) {
      setImageResult(null);

      setMode("image");
    }
  }, [imageSrc, imageElement, loaded, cv]);

  useEffect(() => {
    if (mode === "image") {
      clearCanvas("canvas-output");
    } else if (mode === "histogram") {
      for (let i = 0; i < 3; i++) {
        clearCanvas("canvas-histogram-" + i);
      }
    }

    if (imageResult && loaded) {
      if (mode === "image") {
        showImageMatrix(cv, imageResult, "canvas-output");
      } else if (mode === "histogram") {
        for (let i = 0; i < 3; i++) {
          const result = drawHistogram(cv, imageResult, i);

          showImageMatrix(cv, result, "canvas-histogram-" + i);
        }
      }
    }
  }, [mode, imageResult, loaded, cv]);

  return (
    <>
      {loaded ? (
        <>
          <OpenImageModal
            isModalShowed={isOpenImageModalShowed}
            hideModal={() => toggleOpenImageModal(false)}
            setImageSrc={setImageSrc}
          />
          <RgbModal
            isModalShowed={isRgbModalShowed}
            hideModal={() => toggleRgbModal(false)}
            cv={cv}
            setImageResult={setImageResult}
          />
          <QuantizationModal
            isModalShowed={isQuantizationModalShowed}
            hideModal={() => toggleQuantizationModal(false)}
            cv={cv}
            setImageResult={setImageResult}
          />
          <Navbar variant="dark" bg="dark" expand="lg" className="mb-2">
            <Container>
              <Navbar.Collapse id="navbar-dark-example">
                <Nav>
                  <NavDropdown
                    id="nav-dropdown-dark-example"
                    title="File"
                    menuVariant="dark"
                  >
                    <NavDropdown.Item onClick={() => toggleOpenImageModal(true)}>
                      Open Image
                    </NavDropdown.Item>
                    {imageSrc && (
                      <>
                        <NavDropdown.Item onClick={() => setImageSrc(null)}>
                          Remove Image
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() => {
                            const image = getImageMatrix(cv, "image-src");

                            setImageResult(image);
                          }}
                        >
                          Reset Result
                        </NavDropdown.Item>
                      </>
                    )}
                  </NavDropdown>
                  {imageSrc && (
                    <NavDropdown
                      id="nav-dropdown-dark-example"
                      title="Edit"
                      menuVariant="dark"
                    >
                      <NavDropdown.Item onClick={() => toggleRgbModal(true)}>
                        Color Intensity
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => {
                          const image = getImageMatrix(cv, "image-src");
                          const result = negative(image);

                          setImageResult(result);
                        }}
                      >
                        Negative
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item>
                        <Dropdown variant="dark" drop="end">
                          <Dropdown.Toggle as={CustomToggle}>
                            Sampling
                          </Dropdown.Toggle>
                          <Dropdown.Menu variant="dark">
                            <Dropdown.Item
                              onClick={() => {
                                const image = getImageMatrix(cv, "image-src");
                                const result = sampling(cv, image, "up");

                                setImageResult(result);
                              }}
                            >
                              Upsampling
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                const image = getImageMatrix(cv, "image-src");
                                const result = sampling(cv, image, "down");

                                setImageResult(result);
                              }}
                            >
                              Downsampling
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => toggleQuantizationModal(true)}
                      >
                        Quantization
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item>
                        <Dropdown variant="dark" drop="end">
                          <Dropdown.Toggle as={CustomToggle}>
                            Filter
                          </Dropdown.Toggle>
                          <Dropdown.Menu variant="dark">
                            <Dropdown.Item
                              onClick={() => {
                                const image = getImageMatrix(cv, "image-src");
                                const result = lowpassFilter(cv, image);

                                setImageResult(result);
                              }}
                            >
                              Low Pass Filter
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                const image = getImageMatrix(cv, "image-src");
                                const result = highpassFilter(cv, image);

                                setImageResult(result);
                              }}
                            >
                              High Pass Filter
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                const image = getImageMatrix(cv, "image-src");
                                const result = bandpassFilter(cv, image);

                                setImageResult(result);
                              }}
                            >
                              Band Pass Filter
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                  {imageSrc && (
                    <NavDropdown
                      id="nav-dropdown-dark-example"
                      title="Result Mode"
                      menuVariant="dark"
                    >
                      <NavDropdown.Item onClick={() => setMode("image")}>
                        Image
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => setMode("histogram")}>
                        Histogram
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Container>
            <Row>
              <Col md={6} sm={12}>
                <h2>Image</h2>
                <img id="image-src" alt="" src={imageSrc} />
              </Col>
              <Col md={6} sm={12}>
                <h2>Result</h2>
                {mode === "image" ? (
                  <canvas id="canvas-output"></canvas>
                ) : (
                  <Row>
                    {colors.map((value, index) => {
                      return (
                        <Col md={4} key={index}>
                          <canvas id={"canvas-histogram-" + index}></canvas>
                          <Container className="d-flex">
                            <p className="mx-auto">{value}</p>
                          </Container>
                        </Col>
                      );
                    })}
                  </Row>
                )}
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <Container id="loading-container" className="d-flex align-items-center">
          <Spinner animation="grow" variant="dark" className="mx-auto" />
        </Container>
      )}
    </>
  );
}
