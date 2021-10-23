import React from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';

import { getImageMatrix, showImageMatrix } from '../../functions/image';
import { chageIntensity } from '../../functions/filter';

import './styles.scss';

export default class RgbModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preview: null,
      rgbValues: [0, 0, 0],
    }

    this.loadPreview = this.loadPreview.bind(this);
  }

  loadPreview() {
    const image = getImageMatrix(this.props.cv, 'image-src');

    showImageMatrix(this.props.cv, image, 'canvas-preview');

    this.setState({
      preview: image,
      rgbValues: [0, 0, 0],
    });
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
        <Modal.Body className="px-4">
          <Container className="d-flex">
            <canvas id="canvas-preview" className="mx-auto"></canvas>
          </Container>
          <Container id="range-container" className="mt-3">
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
              onClick={() => {
                const image = getImageMatrix(this.props.cv, 'image-src');
                const result = chageIntensity(image, this.state.rgbValues);

                showImageMatrix(this.props.cv, result, 'canvas-preview');

                this.setState({
                  preview: result,
                })
              }}
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
              // showImageMatrix(this.props.cv, this.state.preview, 'canvas-output');
              this.props.setImageResult(this.state.preview);
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
