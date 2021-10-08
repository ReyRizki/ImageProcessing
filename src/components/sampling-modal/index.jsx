import React from 'react';
import { Modal, Button, Container, ButtonGroup } from 'react-bootstrap';

import './styles.scss';

export default class SamplingModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preview: null,
    }

    this.loadPreview = this.loadPreview.bind(this);
    this.sampling = this.sampling.bind(this);
  }

  loadPreview() {
    const imageElement = document.getElementById('image-src');
    const image = cv.imread(imageElement);

    this.props.cv.imshow('canvas-preview', image);
    this.setState({
      preview: image,
    });
  }

  sampling(operation) {
    let image = this.state.preview;
    let result = new this.props.cv.Mat();

    result = operation(image, result);

    cv.imshow('canvas-preview', result);

    this.setState({
      preview: result,
    })
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
          <Modal.Title>Image Sampling</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <Container className="d-flex">
            <canvas id="canvas-preview" className="mx-auto"></canvas>
          </Container>
          <Container className="d-flex">
            <ButtonGroup aria-label="Basic example" className="mx-auto mt-3">
              <Button
                variant="dark"
                onClick={() => {
                  this.sampling((image, result) => {
                    this.props.cv.pyrUp(image, result, new this.props.cv.Size(0, 0), this.props.cv.BORDER_DEFAULT);

                    return result;
                  })
                }}
              >
                Upsample
              </Button>
              <Button
                variant="outline-dark"
                onClick={this.loadPreview}
              >
                Reset
              </Button>
              <Button
                variant="dark"
                onClick={() => {
                  this.sampling((image, result) => {
                    this.props.cv.pyrDown(image, result, new this.props.cv.Size(0, 0), this.props.cv.BORDER_DEFAULT);

                    return result;
                  })
                }}
              >
                Downsample
              </Button>
            </ButtonGroup>
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
              this.props.cv.imshow("canvas-output", this.state.preview);
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
