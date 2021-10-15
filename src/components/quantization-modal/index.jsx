import React from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';

import { getImageMatrix, showImageMatrix } from '../../functions/image';
import { quantization } from '../../functions/filter';

export default class RgbModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preview: null,
      cluster: 2
    }

    this.loadPreview = this.loadPreview.bind(this);
  }

  loadPreview() {
    const image = getImageMatrix(this.props.cv, 'image-src');

    showImageMatrix(this.props.cv, image, 'canvas-preview');

    this.setState({
      preview: image,
      cluster: 2,
    });
  }

  render() {
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
          <Modal.Title>Color Quantization</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <Container className="d-flex">
            <canvas id="canvas-preview" className="mx-auto"></canvas>
          </Container>
          <Container id="range-container" className="mt-3">
            <Row>
              <Col lg={2}>
                Clusters
              </Col>
              <Col lg={8}>
                <Form.Range
                  min={2}
                  max={16}
                  value={this.state.cluster}
                  onChange={(e) => {
                    this.setState({
                      cluster: parseInt(e.target.value)
                    })
                  }}
                />
              </Col>
              <Col lg={2} className="d-flex justify-content-end">
                {this.state.cluster}
              </Col>
            </Row>
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
                const result = quantization(this.props.cv, image, this.state.cluster);

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
              showImageMatrix(this.props.cv, this.state.preview, 'canvas-output');
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
