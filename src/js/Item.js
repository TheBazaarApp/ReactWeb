import React, { Component } from 'react'
import '../css/App.css'
import { Image } from 'react-bootstrap'

export default class Item extends Component {
	render() {
		let price = null;
		if (this.props.showPrice) {
			price = this.props.item.price;
		}
		return (
			<div className="center red feed-item" onClick={() => this.props.onClick(this.props.sellerCollege, this.props.sellerID, this.props.item.imageKey)}>
				
					<div className="center item-price">{price}</div>
					<Image className="default-pic small-width" src={this.props.item.picture} />
				
			</div>
		)
	}
}