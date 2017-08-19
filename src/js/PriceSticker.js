import React, { Component } from 'react'
import '../css/App.css'

export default class PriceSticker extends Component {
	render() {
		return (
			<div className="bluesticker">
				{this.props.price}
			</div>
		)
	}
}