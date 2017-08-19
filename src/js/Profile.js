import React, { Component } from 'react'
import '../css/App.css'
import { Image, Button, FormGroup, FormControl, HelpBlock } from 'react-bootstrap'
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
			rating: 5,
			tempName: null,
			tempCollege: null
		}
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleCollegeChange = this.handleCollegeChange.bind(this);
	}

	render() {
		return (
			<div>
				{ (!this.state.edit) && <h2>{this.state.name}</h2>}
				{ (this.state.edit) && 
					<FormGroup className="small-width center">
						<FormControl type="text" defaultValue={this.state.name} value={this.state.tempName} onChange={(event) => this.handleNameChange(event)} />
						<HelpBlock>Name</HelpBlock>
					</FormGroup>}
				{ (!this.state.edit) && <h4>{this.state.collegeName}</h4>}
				{ (this.state.edit) && 
					<FormGroup className="small-width center">
						<FormControl type="text" defaultValue={this.state.collegeName} value={this.state.tempCollege} onChange={(event) => this.handleCollegeChange(event)} />
						<HelpBlock>College</HelpBlock>
					</FormGroup>}
				<div className="side-by-side">
					{[1,2,3,4,5].map((starNum) => this.getRatingStar(starNum))}
				</div>
			{/*TODO: Choose image size using the column thing.*/}
				<Image className="img-circle newPic" src={this.state.profilePic}/>
				{ (!this.state.edit) && <Button className="center" onClick={() => this.toggleEdit(true)} >Edit</Button> }
				{ (this.state.edit) && <Button className="center" onClick={() => this.toggleEdit(false)}>Cancel</Button>}
				{ (this.state.edit) && <Button className="center" onClick={() => this.saveProfile()}>Save</Button>}
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
		const profileRef = this.profilePath();
		profileRef.on('value', function(snapshot) {
			if (snapshot) {
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
		return firebase.database().ref(this.props.params.college + '/user/' + this.props.params.uid + "/profile");
	}

	toggleEdit(isOn) {
		this.setState({edit: isOn})
	}       

	saveProfile() {
		const profileRef = this.profilePath();
		const newProfile = {
			name: this.state.tempName,
			collegeName: this.state.tempCollege
		}
		console.log("saving profile", profileRef);
		console.log(newProfile);
		profileRef.update(newProfile);
		this.toggleEdit(false);
		
	}

	handleNameChange(event) {
		this.setState({tempName:event.target.value});
		console.log("changine name")
	}

	handleCollegeChange(event) {
		this.setState({tempCollege:event.target.value});
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
