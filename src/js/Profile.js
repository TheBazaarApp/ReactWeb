import React, { Component } from 'react'
import '../css/App.css'
import { Image } from 'react-bootstrap'
import * as firebase from 'firebase'
import { MdStar, MdStarOutline, MdStarHalf} from 'react-icons/lib/md'

//CURRENT STATUS:
//		- Normal profile info and pic shows up fine
//		- No way to edit profile yet
//		- Doesn't display sold/unsold/purchased items



//Profile - Class for the profile page
export default class Profile extends Component {

	constructor() {
		super();
		this.state = {
			name: "name", 
			collegeName: "Harvey Mudd College",
			profilePic: "cheetah.jpg",
			rating: 5
		}
	}

	render() {
		return (
			<div>
				<h2>{this.state.name}</h2>
				<h4>{this.state.collegeName}</h4>
				<div className="side-by-side">
					{[1,2,3,4,5].map((starNum) => this.getRatingStar(starNum))}
				</div>
			{/*TODO: Choose image size using the column thing.*/}
				<Image className="img-circle newPic" src={this.state.profilePic}/>
			</div>
		)
	}

	//Get all relevant info
	componentDidMount() {
		this.getProfilePic();
		this.getProfileInfo();
		//this.getItemsForSale();
	}


	//Get and return a star (empty, half, or full) for the user's rating
	//		starNum - which star is it? (leftmost is 1)
	getRatingStar(starNum) {
		const rating = this.state.rating;
		if (!rating) {
			return; //If you don't have a rating yet, no stars
		}
		if (rating > starNum - .25) { //Full star
			return <MdStar key={starNum} size={30} />;
		} else if (rating > starNum - .75) { //Half star
			return <MdStarHalf key={starNum} size={30} />;
		} else { //Empty star
			return <MdStarOutline key={starNum} size={30} />;
		}
	}


	//Get the user's profile pic, save it to the state
	getProfilePic() {
		const storageRef = firebase.storage().ref();
		var imageRef = storageRef.child(this.props.params.college + '/user/' + this.props.params.uid + '/ProfilePic');
		imageRef.getDownloadURL().then(function(url) {
			this.setState({
				profilePic: url
			});
		}.bind(this));
	}


	//Get the user's personal profile info, save it to the state
	getProfileInfo() {
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


	//Return a database reference to the user's profile.
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
