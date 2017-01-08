import React, { Component } from 'react'
import '../css/App.css'
import { MenuBar } from './Navbar'
import { Feed } from './Feed'
import { NewAlbum } from './NewAlbum'


class App extends Component {
	render() {
		return (
			<div className="App">
				<MenuBar />
				<Feed />
			</div>
		);
	}
}

export default App;


 