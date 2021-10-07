import React from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';

import './styles.scss';

export default class RgbModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preview: null,
      rgbValues: [0, 0, 0],
    }

    this.loadPreview = this.loadPreview.bind(this);
    this.changeIntensity = this.changeIntensity.bind(this);
  }

  loadPreview() {
    const imageElement = document.getElementById('image-src');
    const image = cv.imread(imageElement);

    this.props.cv.imshow('canvas-preview', image);
    this.setState({
      preview: image,
      rgbValues: [0, 0, 0],
    });
  }

  changeIntensity() {
    const adjustValue = (x, n) => {
      x += n;

      if (x > 255) {
        x = 255;
      }

      if (x < 0) {
        x = 0;
      }

      return x;
    }

    let image = this.state.preview;
    for (let row = 0; row < image.rows; row++) {
      for (let col = 0; col < image.cols; col++) {
        if (image.isContinuous()) {
          const pos = row * image.cols * image.channels() + col * image.channels();

          for (let i = 0; i < 3; i++) {
            image.data[pos + i] = adjustValue(image.data[pos + i], this.state.rgbValues[i]);
          }
        }
      }
    }

    this.props.cv.imshow("canvas-preview", image);
  }

  copyImage() {
    const destination = document.getElementById('canvas-output');
    const destinationContext = destination.getContext('2d');

    const source = document.getElementById('canvas-preview');
    destinationContext.drawImage(source, 0, 0, source.width, source.height);
  }

  render() {
    const colors = ["Red", "Green", "Blue"];

    return (
      <Modal
        show={this.props.isModalShowed}
        size="lg"
        centered
        onHide={this.props.hideModal}
        backdrop="static"
        onEntered={() => this.loadPreview()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Color Intensity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="d-flex">
            <canvas id="canvas-preview" className="mx-auto"></canvas>
          </Container>
          <Container id="range-container">
            {this.state.rgbValues.map((value, index) => {
              return (
                <Row key={index}>
                  <Col lg={1}>
                    {colors[index]}
                  </Col>
                  <Col lg={10}>
                    <Form.Range
                      min={-255}
                      max={255}
                      value={value}
                      onChange={(e) => {
                        let rgbValues = this.state.rgbValues;
                        rgbValues[index] = e.target.value

                        this.setState({
                          rgbValues: rgbValues
                        })
                      }}
                    />
                  </Col>
                  <Col lg={1} className="d-flex justify-content-end">
                    {value}
                  </Col>
                </Row>
              )
            })}
          </Container>
          <Container className="d-flex justify-content-end gap-2">
            <Button
              variant="outline-dark"
              onClick={() => this.loadPreview()}
            >
              Reset
            </Button>
            <Button
              variant="dark"
              onClick={() => this.changeIntensity()}
            >
              Apply
            </Button>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-dark"
            onClick={this.props.hideModal}
          >
            Cancel
          </Button>
          <Button
            variant="dark"
            onClick={() => {
              this.copyImage();
              this.props.hideModal();
            }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
