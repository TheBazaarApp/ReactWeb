import React, { Component } from 'react'
import '../css/App.css'
import { Button, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap'
import { MenuBar } from './Navbar'


export default class NewAlbum extends Component {
	render() {
		return (
			<div>
				<MenuBar />
				<h1>Add New Album</h1>
				<FormGroup>
					<ControlLabel>Album Name:</ControlLabel>
					<FormControl type="text" />
					<ControlLabel>Tag All:</ControlLabel>
					<TagDropdown />
				</FormGroup>
				<div id="new-item-box center">
					<NewItem pic="cheetah.jpg" />
				</div>
			</div>
		)
	}
}



class NewItem extends Component {
	render() {
		const filterCategories = ["All Albums", "All Items", "Fashion", "Electronics", "Appliances", "Transportation", "Furniture", "School Supplies", "Services"];
		return (
			<div className="white">
				<div>
					<FormGroup>
						<ControlLabel>Item Name:</ControlLabel>
						<FormControl type="text" />
					</FormGroup>
					<FormGroup>
						<ControlLabel>Tag All:</ControlLabel>
						<FormControl componentClass="select">
							{filterCategories.map((category, index) => {
								return ( <option key={index} value="select">{category}</option> );
							})}	
						</FormControl>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Description:</ControlLabel>
						<FormControl componentClass="textarea" />
					</FormGroup>
				</div>
				<Button>
					<img src={this.props.pic} /> {/*Why doesn't Image work here?*/}
				</Button>
			</div>
		)
	}
}




//TODO: Possibly categories dropdown
class TagDropdown extends Component {
	render() {
		const filterCategories = ["All Albums", "All Items", "Fashion", "Electronics", "Appliances", "Transportation", "Furniture", "School Supplies", "Services"];
		
		return (
			<DropdownButton id="tag" title="Category">
				<MenuItem key="-1">None</MenuItem>
				{filterCategories.map((category, index) => {
					return ( <MenuItem key={index}>{category}</MenuItem> );
				})}
			</DropdownButton>
		)
	}
}