const mongoose = require('mongoose');
const places = mongoose.model('places');
const Zomato = require('zomato.js');;
module.exports = app => {
	app.get('/:text', (req, res) => {
		console.log(req.params.text);
		const z = new Zomato('d74995ce044065acd644f82d15b0dacf');
		z
			.search({ q: req.params.text, count: 10 })
			.then(data => {
				res.send(data);
			})
			.catch(function(err) {
				console.error(err);
			});
	});
	app.post('/updatestate', (req, res) => {
		if(!req.user){
			console.log("Not logged in update status");
			return;
		}
		places.findOne(
			{ details: { $elemMatch: { resId: req.body.name } } },
			(err, result) => {
				if (!result) {   //the record does not exist
					const obj = { resId: req.body.name, count: 1 };
					places.findByIdAndUpdate(
						req.user.id,
						{ $push: { details: obj } },
						(err, response) => {
							res.send(response);
						}
					);
				} else { //the record exists
					if(req.body.toInc == true){
						//perform an increment.
						places.update({"_id":req.user.id,details: { $elemMatch: { resId: req.body.name } }},{$inc:{"details.$.count":1}},(err,response)=>{
							console.log(response);
							res.send(response);
						});
					}
					else {
						//perform a decrement.
						places.update({"_id":req.user.id,details: { $elemMatch: { resId: req.body.name } }},{$inc:{"details.$.count":-1}},(err,response)=>{
							console.log(response);
							res.send(response);
						});
					}

				}
			}
		);
	});

	app.post('/buttonStatus', (req, res, next) => {

		if(!req.user){
			res.send("not logged");
			return;
		}
		let arr = {};
		places.findById(req.user.id, (err, result) => {
			// res.send(req.body.name);

			if (err) return next(err);
			for (let i = 0; i < result.details.length; i++) {
				for (let j = 0; j < req.body.name.length; j++) {
					if (result.details[i].resId == req.body.name[j].id) {
						arr[result.details[i].resId]=result.details[i].count;
					}
				}
			}
			res.send(arr);
			console.log(arr);
		});
	});





































	// app.post('/buttonStatus/:text', (req, res, next) => {
	// 	let arr = [];
	// 	places.findById(req.user.id, (err, result) => {
	// 		if (err) return next(err);
	// 		for (let i = 0; i < result.details.length; i++) {
	// 			for (let j = 0; j < req.body.id.length; j++) {
	// 				if (result.details[i].resId === req.body.id[j]) {
	// 					arr.push(result.details[i].going);
	// 				}
	// 			}
	// 		}
	// 		console.log(arr);
	// 		res.send(arr);
	// 	});
	// });
};
