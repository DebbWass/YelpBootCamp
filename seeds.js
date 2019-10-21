var mongoose 	= require("mongoose"),
	Campground	= require("./models/campground"),
	Comment		= require("./models/comment");
	

var data = [
	{name: "Musasa (Charadza)", 
	 image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsEijtNZLgXX4WzxsFrsTIWzBHXvyXndZVm3SFgQx87RJo9EH6",
	description: "Musasa kana charadza (Camping place) zvinoreva nzvimbo yamirwa nevanhu vachigarapo munguva yokunge vachivhima kana kuti vachifamba zvavo zvokutandara nokuona nyika. Mazuva ano musasa unomiswa matendhe kana caravan."},
	{
	name: "Sugarloaf provincial park", 
	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5lzRX_9hFYrFBtln-dn-Giw0Ke982Mj9bArhP9IlftpbtvkGw",
	description: "two dome tents surrounded by trees."
	},
	{
	name: "Crawford Notch State Park", 
	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqfXmG5Bjyjm6WJReaZYm-DDvZh-z2fuqziW__lyvCeT9Npkl3",
	description: "Dry River - Crawford Notch State Park in New Hampshire: 10 Campsite Reviews, 51 Camper Photos, plus available amenities at Dry 		River - Crawford Notch State Park."
	}
	
];

var comments = [
	{
		text: "Very clean and cozy campground!!",
		author : "Mark"
	}
];

function seedDB(){
	//remove all campgrounds
	Campground.remove({},function(err){
	// 	if (err){
	// 		console.log(err);
	// 	}else{
	// // 		console.log("data removed!");
	// // 		//add new campgrounds
	// // 		data.forEach(function(seed){
	// // 			Campground.create(seed, function(err,campground){
	// // 				if(err){
	// // 					console.log(err);
	// // 				}else{
	// // 					console.log("campground added");
	// // 					//create comment
	// // 					Comment.create(
	// // 						{text: "Very clean and cozy campground!!",
	// // 						 author : "Mark"}, function(err, comment){
	// // 							 if(err){
	// // 								 console.log(err);
	// // 							 }else{
	// // 								 campground.comments.push(comment);
	// // 								 campground.save();
	// // 								 console.log("comment added");
	// // 							 }
							
							
								 
	// // 						 });
	// // 				}
	// // 			});
	// // 		});
	// 	}
	});
}



module.exports = seedDB;