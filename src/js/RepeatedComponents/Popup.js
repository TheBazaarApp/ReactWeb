import React, { Component } from 'react'
import '../../css/App.css'
import { Modal, 
			Button
		} from 'react-bootstrap'

export default class Popup extends Component {
	render() {
		return (
			<Modal 
				show={this.props.showPopup} 
				onHide={() => this.props.hidePopup()}>

				<Modal.Header closeButton>
					{this.props.title && <Modal.Title>{this.props.title}</Modal.Title>}
				</Modal.Header>

				<Modal.Body>
					{this.props.children}

					{this.props.action &&
					<Button 
						block 
						bsStyle="primary" 
						bsSize="large"
						onClick={this.props.action.bind(this)}>{this.props.actionText}</Button>}
				</Modal.Body>
			</Modal>
		)
	}
}