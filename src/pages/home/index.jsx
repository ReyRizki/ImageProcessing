import React, { useState } from 'react';
import { useOpenCv } from 'opencv-react';
import { Navbar, Container, Nav, NavDropdown, Row, Col, Spinner } from 'react-bootstrap';

import RgbModal from '../../components/rgb-modal';
import SamplingModal from '../../components/sampling-modal';

import './styles.scss';

export default function Home() {
  const { loaded, cv } = useOpenCv();
  const [imageSrc, setImageSrc] = useState(null);
  const [isRgbModalShowed, toggleRgbModal] = useState(false);
  const [isSamplingModalShowed, toggleSamplingModal] = useState(false);

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
            isModalShowed={isRgbModalShowed}
            hideModal={() => toggleRgbModal(false)}
            cv={cv}
          />
          <SamplingModal
            isModalShowed={isSamplingModalShowed}
            hideModal={() => toggleSamplingModal(false)}
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
                      <NavDropdown.Item onClick={() => toggleSamplingModal(true)}>
                        Sampling
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => {
                        manipulateImage((image, result) => {
                          // create float 32 matrix
                          let sample = new cv.Mat(image.rows * image.cols, 3, cv.CV_32F);
                          for (let y = 0; y < image.rows; y++) {
                            for (let x = 0; x < image.cols; x++) {
                              for (let z = 0; z < 3; z++) {
                                sample.floatPtr(y + x * image.rows)[z] = image.ucharPtr(y, x)[z];
                              }
                            }
                          }

                          // k-means clustering
                          let clusterCount = 8;
                          let labels = new cv.Mat();
                          let attempts = 5;
                          let centers = new cv.Mat();

                          let crite = new cv.TermCriteria(cv.TermCriteria_EPS + cv.TermCriteria_MAX_ITER, 10000, 0.0001);
                          let criteria = [1, 10, 0.0001];

                          cv.kmeans(sample, clusterCount, labels, crite, attempts, cv.KMEANS_RANDOM_CENTERS, centers);

                          // create uint 8 matrix for result
                          let newImage = new cv.Mat(image.size(), image.type());
                          for (let y = 0; y < image.rows; y++) {
                            for (let x = 0; x < image.cols; x++) {
                              var cluster_idx = labels.intAt(y + x * image.rows, 0);

                              let redChan = new Uint8Array(1);
                              let greenChan = new Uint8Array(1);
                              let blueChan = new Uint8Array(1);
                              let alphaChan = new Uint8Array(1);

                              redChan[0] = centers.floatAt(cluster_idx, 0);
                              greenChan[0] = centers.floatAt(cluster_idx, 1);
                              blueChan[0] = centers.floatAt(cluster_idx, 2);
                              alphaChan[0] = 255;

                              newImage.ucharPtr(y, x)[0] = redChan;
                              newImage.ucharPtr(y, x)[1] = greenChan;
                              newImage.ucharPtr(y, x)[2] = blueChan;
                              newImage.ucharPtr(y, x)[3] = alphaChan;
                            }
                          }

                          return newImage;
                        })
                      }}>
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
