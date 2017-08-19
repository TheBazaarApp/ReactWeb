import React, { Component } from 'react'
import '../css/App.css'
import { Button, Image, FormGroup, FormControl, DropdownButton, MenuItem, Carousel } from 'react-bootstrap' //TODO: Are all these used?
import { browserHistory } from 'react-router'

export default class MyItems extends Component {

	constructor() {
		super();
		//Event handlers
	}

	render() {
		let category = this.props.params.category;
		let items = null;
		switch(categoy) {
			case 'unsold':
			if (this.state.albumView) {
				items = this.props.albums.map( (item) =>
					return(<Image src={item.pic} />)
				)
			// } else {
			// 	items = this.props.unsoldItems.map( (item) =>
			// 		return(<Image src={item.pic} />)
			// 	)
			// }
				

			case 'sold':
				items = this.props.soldItems;
			case 'purchased':
				items = this.props.purchasedItems;
		}



		return(
			Hello World
			)
	}
}