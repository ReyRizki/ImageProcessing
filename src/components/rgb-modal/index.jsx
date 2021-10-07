import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';

export default class RgbModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preview: null,
    }

    this.loadPreview = this.loadPreview.bind(this);
  }

  loadPreview() {
    const imageElement = document.getElementById('image-src');
    const image = cv.imread(imageElement);

    this.props.cv.imshow('canvas-preview', image);
    this.setState({
      preview: image
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
          <Modal.Title>Change Color Intensity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="d-flex">
            <canvas id="canvas-preview" className="mx-auto"></canvas>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-dark"
            onClick={this.props.hideModal}
          >
            Cancel
          </Button>
          <Button variant="dark">OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
