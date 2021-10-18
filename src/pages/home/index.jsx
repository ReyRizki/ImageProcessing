import React, { useState } from 'react';
import { useOpenCv } from 'opencv-react';
import { Navbar, Container, Nav, NavDropdown, Row, Col, Spinner } from 'react-bootstrap';

import RgbModal from '../../components/rgb-modal';
import SamplingModal from '../../components/sampling-modal';
import QuantizationModal from '../../components/quantization-modal';

import { getImageMatrix, showImageMatrix } from '../../functions/image';
import { negative } from '../../functions/filter';

import './styles.scss';

export default function Home() {
  const { loaded, cv } = useOpenCv();
  const [imageSrc, setImageSrc] = useState(null);
  const [isRgbModalShowed, toggleRgbModal] = useState(false);
  const [isSamplingModalShowed, toggleSamplingModal] = useState(false);
  const [isQuantizationModalShowed, toggleQuantizationModal] = useState(false);

  const openFileSelector = () => {
    document.getElementById("file-selector").click();
  }

  return (
    <>
      {loaded ? (
        <>
          <RgbModal
            isModalShowed={isRgbModalShowed}
            hideModal={() => toggleRgbModal(false)}
            cv={cv}
          />
          <SamplingModal
            isModalShowed={isSamplingModalShowed}
            hideModal={() => toggleSamplingModal(false)}
            cv={cv}
          />
          <QuantizationModal
            isModalShowed={isQuantizationModalShowed}
            hideModal={() => toggleQuantizationModal(false)}
            cv={cv}
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
                    <NavDropdown.Item onClick={() => openFileSelector()}>Open Image</NavDropdown.Item>
                  </NavDropdown>
                  {imageSrc && (
                    <NavDropdown
                      id="nav-dropdown-dark-example"
                      title="Filter"
                      menuVariant="dark"
                    >
                      <NavDropdown.Item onClick={() => toggleRgbModal(true)}>
                        Color Intensity
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => {
                        const image = getImageMatrix(cv, 'image-src');
                        const result = negative(image);

                        showImageMatrix(cv, result, 'canvas-output');
                      }}>
                        Negative
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={() => toggleSamplingModal(true)}>
                        Sampling
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => toggleQuantizationModal(true)}>
                        Quantization
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
                <input
                  type="file"
                  id="file-selector"
                  name="file"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => {
                    setImageSrc(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null)

                    const canvas = document.getElementById('canvas-output');
                    const context = canvas.getContext('2d');

                    context.clearRect(0, 0, canvas.width, canvas.height);
                  }}
                />
              </Col>
              <Col md={6} sm={12}>
                <h2>Result</h2>
                <canvas id="canvas-output"></canvas>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <Container
          id="loading-container"
          className="d-flex align-items-center"
        >
          <Spinner
            animation="grow"
            variant="dark"
            className="mx-auto"
          />
        </Container>
      )}
    </>
  );
}
