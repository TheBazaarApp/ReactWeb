import React, { Component } from 'react'

export default class About extends Component {
  render() {
    return (
    	<div>
    		<h1>About</h1>
    		<button onClick={() => this.ss()}>Call Server</button>
    	</div>)
  }	
}

