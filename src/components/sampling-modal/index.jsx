import React from 'react';
import { Modal, Button, Container, ButtonGroup } from 'react-bootstrap';

import { getImageMatrix, showImageMatrix } from '../../functions/image';
import { sampling } from '../../functions/filter';

import './styles.scss';

export default class SamplingModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preview: null,
    }

    this.loadPreview = this.loadPreview.bind(this);
    this.applySampling = this.applySampling.bind(this);
  }

  loadPreview() {
    const imageElement = document.getElementById('image-src');
    const image = this.props.cv.imread(imageElement);

    this.props.cv.imshow('canvas-preview', image);
    this.setState({
      preview: image,
    });
  }

  applySampling(type) {
    const image = getImageMatrix(this.props.cv, 'image-src');
    const result = sampling(this.props.cv, image, type);

    showImageMatrix(this.props.cv, result, 'canvas-preview');

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
                onClick={() => this.applySampling('up')}
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
                onClick={() => this.applySampling('down')}
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
