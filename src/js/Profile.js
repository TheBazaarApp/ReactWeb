import React, { Component } from 'react'
import '../css/App.css'
//import { Link } from 'react-router'
import { Image, /*Button*/ } from 'react-bootstrap'
import * as firebase from 'firebase'
import { MdStar, MdStarOutline, MdStarHalf} from 'react-icons/lib/md'


export default class Profile extends Component {


	constructor() {
		super();
		this.state = {
			name: "name", 
			collegeName: "Harvey Mudd College",
			profilePic: "cheetah.jpg"
		}
	}

	render() {
		return (
			<div>
				<h2>{this.state.name}</h2>
				<h4>{this.state.collegeName}</h4>
				<div class="side-by-side">
					<MdStar />
				</div>
				<Image src={this.state.profilePic}/>
			</div>
		)
	}


	componentDidMount() {
		this.getProfilePic();
		this.getProfileInfo();
		//this.getItemsForSale();
	}

	//TODO: Test this once I have my phone!!!
	getProfilePic() {
		const storageRef = firebase.storage().ref();
		var imageRef = storageRef.child(this.props.params.college + '/user/' + this.props.params.uid + '/ProfilePic');
		imageRef.getDownloadURL().then(function(url) {
			this.setState({
				profilePic: url
			});
		}.bind(this));
	}


	getProfileInfo() {
		//const profileRef = firebase.database().ref(this.props.params.college + '/user/' + this.props.params.uid + '/profile');
		const profileRef = this.profilePath().child('profile');
		profileRef.on('value', function(snapshot) {
			if (snapshot) {
				console.log("Got a snapshot!" + snapshot);
				const name = snapshot.val().name;
				const rating = snapshot.val().rating;
				const collegeName = "Harvey Mudd College"; //TODO: Get this from their email domain
				this.setState({
					name: name,
					rating: rating,
					collegeName: collegeName
				})
			}
		}.bind(this));
	}


	profilePath() {
		return firebase.database().ref(this.props.params.college + '/user/' + this.props.params.uid);
	}



	// getItemsForSale() {
	// 	this.profilePath().child('/unsoldItems').orderByKey().once('value').then(function(snapshot) {
	// 		snapshot.forEach(function(item) {
	// 			const key = item.key;
	// 			const albumID = item.child('albumKey').val();
	// 			getUnsoldItem(this.state.uid, key, albumID);
	// 		});
	// 	});
	// }


	// getUnsoldItem(uid, key, albumid) {
	// 	const imageRef = firebase.storage().ref().child(this.props.params.college + '/user/' + this.props.params.uid + '/unsoldItems/' + key);
	// 	imageRef.getDownloadURL().then(function(url) {
	// 		console.log("got an unsold item");
	// 	}).catch(function(error) { //TODO: Take out this catch phrase; make the unsold item just not show up.
	// 		console.log("too bad, couldn't get it");
	// 	});
	// }





}
