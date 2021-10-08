import React, { useState } from 'react';
import { useOpenCv } from 'opencv-react';
import { Navbar, Container, Nav, NavDropdown, Row, Col, Spinner } from 'react-bootstrap';

import RgbModal from '../../components/rgb-modal';

import './styles.scss';

export default function Home() {
  const { loaded, cv } = useOpenCv();
  const [imageSrc, setImageSrc] = useState(null);
  const [isModalShowed, toggleModal] = useState(false);

  const openFileSelector = () => {
    document.getElementById("file-selector").click();
  }

  const manipulateImage = (operation) => {
    const imageElement = document.getElementById('image-src');
    const image = cv.imread(imageElement);

    let result = new cv.Mat();

    result = operation(image, result);

    cv.imshow('canvas-output', result);
  }

  return (
    <>
      {loaded ? (
        <>
          <RgbModal
            isModalShowed={isModalShowed}
            hideModal={() => toggleModal(false)}
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
                      <NavDropdown.Item onClick={() => {
                        toggleModal(true);
                      }}>
                        Color Intensity
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => {
                        manipulateImage((image, result) => {
                          result = image.clone();

                          for (let row = 0; row < result.rows; row++) {
                            for (let col = 0; col < result.cols; col++) {
                              if (result.isContinuous()) {
                                const pos = row * result.cols * result.channels() + col * result.channels();

                                for (let i = 0; i < 3; i++) {
                                  result.data[pos + i] = 255 - result.data[pos + i];
                                }
                              }
                            }
                          }

                          return result;
                        })
                      }}>
                        Negative
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={() => {
                        manipulateImage((image, result) => {
                          cv.pyrDown(image, result, new cv.Size(0, 0), cv.BORDER_DEFAULT);

                          return result;
                        })
                      }}>
                        Downsample
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
