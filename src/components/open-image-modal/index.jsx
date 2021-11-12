import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default class OpenImageModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "images/*",
    }
  }

  render() {
    return (
      <Modal
        show={this.props.isModalShowed}
        size="sm"
        centered
        onHide={this.props.hideModal}
        backdrop="static"
        onEntered={() => this.setState({ type: "images/*" })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose File Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select 
            value={this.state.type}
            onChange={(e) => this.setState({ type: e.target.value }, () => console.log(this.state.type))}
          >
            <option value="images/*">All Types</option>
            <option value=".jpg">JPG</option>
            <option value=".jp2">JPEG-2000</option>
            <option value=".png">PNG</option>
            <option value=".tiff">TIFF</option>
            <option value=".svg">SVG</option>
            <option value=".gif">GIF</option>
            <option value=".bmp">BMP</option>
          </Form.Select> 
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
            onClick={this.props.hideModal}
          >
            Open
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
