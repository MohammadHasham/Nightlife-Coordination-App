import React, { Component } from 'react';
import logo from './logo.svg';
import Zomato from 'zomato.js';
import './App.css';
import axios from 'axios';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arr:{},
			status: "",
			toInc:true
		};
	}
	componentWillMount() {
		this.getCats();
	}
	getCats = () => {
		console.log('cat')
		axios.get(`/${this.state.text}`).then((data)=>{
			console.log("working herere");
					this.setState({ restaurants: data.data.restaurants });
					axios.post(`/buttonStatus`, { name: data.data.restaurants }).then(response => {
					if(response.data == "not logged"){
						this.setState({status:"not"});
					}
					 this.setState({arr:{...response.data}});
					});
		})
		.catch(function(err) {
		 		console.error(err);
	 	});
	};
	updateCount = id => {
		//apply this.state.toInc
		axios.post('/updatestate', { name: id, toInc: this.state.toInc }).then(response => {
			this.setState({toInc:!this.state.toInc});
			this.getCats();
		});
	};
	getNames() {
		if (!this.state.restaurants) return <li>Loading</li>;
		return this.state.restaurants.map((names, key) => {
			return (
				<li key={key} className="row">
					<div className="col-md-10">
						<h2>
							<a
								style={{ textDecoration: 'none', color: 'black' }}
								href={names.url}>
								{names.name}
							</a>
						</h2>
					</div>
					<div className="col-md-2">
						<button
							className="btn btn-warning"
							onClick={() => this.updateCount(names.id)}>
							{this.state.arr[names.id] ? `Going ${this.state.arr[names.id]}`:"Not Going"}
						</button>
					</div>
				</li>
			);
		});
	}
	render() {
		if(!this.state.arr || !this.state.status) return <h1>Loading</h1>;
		if(this.state.status == "not") alert("You are not logged in,\nPlease login to see the user's that are going to a resturant");
		return (
			<div className="container-fluid" style={{ backgroundColor: '#7e57c2' }}>
				<h1 className="text-center" style={{ marginTop: '3%' }}>
					Nightlife Cordination App
				</h1>
				<div className="row" style={{ marginTop: '3%' }}>
					<div className="col-md-3" />
					<div className="col-md-5">
						<input
							class="form-control"
							type="text"
							placeholder="Enter Text Here"
							onChange={e => this.setState({ text: e.target.value })}
						/>
					</div>
					<div className="col-md-4">
						<button className="btn btn-warning" onClick={this.getCats}>Submit</button>
						<a style={{marginLeft:"2%"}} className="btn btn-warning" href="/auth/twitter">Login with twitter</a>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-md-1" />
						<div className="col-md-10">
							<ul style={{ marginTop: '5%' }}>{this.getNames()}</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
