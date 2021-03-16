const express = require("express");
const app = express();


const mongoose = require("mongoose");

const _ = require("lodash");

mongoose.set('useFindAndModify', false);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));






mongoose.connect("mongodb+srv://admin-Badr:Test123@cluster0.wpont.mongodb.net/todolistDB",  {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true});//here we creted a new db


//our Item schema and kinda the list
const ItemsSchema = {
name:String
};

const Item = mongoose.model("Item" , ItemsSchema);//always singular

const item1 = new Item ({
	name:"<-- hit this to delete an item"
})

const item2 = new Item ({
	name:"<-- hit this to "
})


const item3 = new Item ({
	name:"<-- t this to delete an item"
})


// 
defaultItems = [item1 , item2 , item3];
//ouer list schema
const listSchema = {
name: String,
items: [ItemsSchema]

};


const List = mongoose.model("List" , listSchema);



app.get("/:customeListName" , function(req,res){

	const customeListName = _.capitalize(req.params.customeListName);

    List.findOne({name:customeListName} , function(err , result){
      if(!err){
      	if(!result){

         // console.log("Doesnt Exist")

           const list = new List({
     	name:customeListName,
     	items: defaultItems
     })
     list.save()
     res.redirect("/" + customeListName )

      	}else{
      		res.render("list" ,  {ListTitle: result.name, newListItems: result.items});
      		// console.log("exist")
      	}
      }
     });




   
  });
//modelname.insertmany




// Item.deleteMany({name:"Welcome to your todolist"} , function(err){
// 	if (err){
// 		console.log(err)
// 	}else{
// 		console.log("succsusfully deletd")
// 	}
// })
// Item.deleteMany({name:"Hit this to delete an item"} , function(err){
// 	if (err){
// 		console.log(err)
// 	}else{
// 		console.log("succsusfully deletd")
// 	}
// })
// Item.deleteMany({name:"hit the + to add a new item"} , function(err){
// 	if (err){
// 		console.log(err)
// 	}else{
// 		console.log("succsusfully deletd")
// 	}
// })

app.set("view engine" , "ejs");//ejs stuff



app.get("/" , function(req , res){



Item.find({} , function(err , foundItems){


	if (foundItems.length===0){
     Item.insertMany(defaultItems , function(err){
	if (err) {
		console.log(err);
	} else {
		console.log("added succsusfully")
	}

});
res.redirect("/");

	}else{
		res.render("List" , {ListTitle: "Today", newListItems: foundItems});
		
}
});		

});



//the logic 

// var currentDay = today.getDay()

// console.log(today.toLocaleDateString("en-US")); // 9/17/2016
// console.log(today.toLocaleDateString("en-US", options)); // Saturday, September 17, 2016
// console.log(today.toLocaleDateString("hi-IN", options)); // शनिवार, 17 सितंबर 2016

// //my solution 
// var c = ["Sunday","Monday","Tuesday","Wedensday","Thursday","Friday","Saturday"]


// if (currentDay === 6 || currentDay === 0){


// Day = c[currentDay]
// 	// res.write("<h1>hooray es ist der wochenende</h1>");
// }
// else{
	
// 	Day =  c[currentDay]
// 	// res.write("<h1>ahh wann kommt das wochenende</h1>");
// 	// res.write("<p>Es ist nicht das wochenende</p>");
// 	// res.send();
	
// } 
// //her solution 
// switch (currentDay){
// 	case 0:
// 	Day = "Sunday"
// 	break;
// case 1:
// 	Day = "Monday"

// 	break;
	
// 	case 2:
// 		Day = "Tuesday"

// 	break;
	
// 	case 3:
// 		Day = "Wednesday"

// 	break;
	
// 	case 4:
// 		Day = "Thursdayday"

// 	break;
	
// 	case 5:
// 		Day = "Frieday"

// 	break;
	
// 	case 6:
// 		Day = "Saturdayday"

// 	break;
// default:	
//console.log("error current day is equal to "+ currentDay);



// }



app.post("/", function(req , res){

const itemName = req.body.newItem;

const listName = req.body.List;


const item = new Item({

	name: itemName

});

if (listName ==="Today"){

item.save();

res.redirect("/");	
}else{
	List.findOne({name:listName} , function(err , ListInput){

	ListInput.items.push(item);
	ListInput.save();

	res.redirect("/" + listName);
	});
}

});






app.post("/delete" , function(req , res){
	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;

	if(listName === "Today"){
Item.findByIdAndRemove(checkedItemId , function(err){
	
      if(!err){
      	console.log("Succssufully deleted")

      	res.redirect("/");
      }

});


	}else{
		List.findOneAndUpdate({name: listName}, {$pull: {items: {_id:checkedItemId}}} , function(err , foundlist){
           
         if(!err){
         	res.redirect("/" + listName);
         }

		} )

	}


});






app.get("/about" , function(req,res){
res.render("about")

});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}





app.listen(port, function (){
	console.log("server is started")


});








