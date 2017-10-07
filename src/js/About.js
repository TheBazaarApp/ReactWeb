import React, { Component } from 'react'
import $ from 'jquery';

export default class About extends Component {
  render() {
    return (
    	<div>
    		<h1>About</h1>
    		<button onClick={() => this.ss()}>Call Server</button>
    	</div>)
  }

	ss() {
		console.log("ss called");
		this.serverWrite({hello: "world"}, "test")
  }

	serverWrite(data, funcName) {
		console.log("server write");
		var url = "http://localhost:8000/";
		$.ajax({
			type: "POST",
			url: url + funcName,
			data: JSON.stringify(data),
			success: function(result) {
				console.log("GOT A RESPONSE!");
			}
		});
	}
}

