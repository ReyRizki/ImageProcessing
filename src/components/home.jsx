import React, { useEffect, useState } from 'react';
import { useOpenCv } from 'opencv-react';
import { Navbar, Container, Nav, NavDropdown, Row, Col } from 'react-bootstrap';

export default function Home() {
  const { loaded, cv } = useOpenCv();
  const [imageSrc, setImageSrc] = useState(null);

  const openFileSelector = () => {
    document.getElementById("file-selector").click();
  }

  const manipulateImage = () => {
    const imageElement = document.getElementById('image-src');
    const image = cv.imread(imageElement);

    console.log(image);

    const result = new cv.Mat();

    cv.cvtColor(image, result, cv.COLOR_RGBA2GRAY);
    cv.imshow('canvasOutput', result);

    image.delete();
    result.detele();
  }

  return (
    <>
      <Navbar variant="dark" bg="dark" expand="lg" className="mb-2">
        <Container>
          <Navbar.Collapse id="navbar-dark-example">
            <Nav>
              <NavDropdown
                id="nav-dropdown-dark-example"
                title="Menu"
                menuVariant="dark"
              >
                <NavDropdown.Item onClick={() => openFileSelector()}>Open Image</NavDropdown.Item>
                <NavDropdown.Item onClick={() => manipulateImage()}>Manipulate</NavDropdown.Item>
              </NavDropdown>
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
              onChange={(e) => setImageSrc(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null)}
            />
          </Col>
          <Col md={6} sm={12}>
            <h2>Result</h2>
            <canvas id="canvasOutput"></canvas>
          </Col>
        </Row>
      </Container>
    </>
  );
}
