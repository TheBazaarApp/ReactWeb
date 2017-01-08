import React, { Component } from 'react'
import '../css/App.css'
import { MenuBar } from './Navbar'


class App extends Component {

	render() {
		return (
			<div className="App">
				<MenuBar />
				{this.props.children}
			</div>
		);
	}


}

export default App;
