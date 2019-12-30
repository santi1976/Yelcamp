var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment"); 

var data = [
    {
        name: "Cloud's Rest",
        image: "https://gardenbetty-gardenbetty.netdna-ssl.com/wp-content/uploads/2013/08/2013-08-29-51.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consequat lorem quis mattis sodales. Suspendisse in vestibulum nisi. Nunc auctor tempus nisi id pharetra. Praesent hendrerit elit neque, vitae gravida neque rutrum a. Cras est nibh, varius in nisl sit amet, cursus convallis risus. Donec auctor dui dolor, ut egestas nisl porttitor eget. Etiam diam ipsum, viverra quis molestie sed, finibus et mi. Pellentesque non arcu sed libero ullamcorper elementum quis quis quam. Quisque ultrices tellus ipsum, quis vehicula libero eff"
    },
    {
        name: "Zion National Park",
        image: "https://www.nps.gov/zion/planyourvisit/images/WatchmanCG_Watchman_r.jpg?maxwidth=650&autorotate=false",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consequat lorem quis mattis sodales. Suspendisse in vestibulum nisi. Nunc auctor tempus nisi id pharetra. Praesent hendrerit elit neque, vitae gravida neque rutrum a. Cras est nibh, varius in nisl sit amet, cursus convallis risus. Donec auctor dui dolor, ut egestas nisl porttitor eget. Etiam diam ipsum, viverra quis molestie sed, finibus et mi. Pellentesque non arcu sed libero ullamcorper elementum quis quis quam. Quisque ultrices tellus ipsum, quis vehicula libero eff"

        
    },

    {
        name: "The Alps Camping",
        image: "https://cdn3.foap.com/images/0db5f6c3-0dcb-46f1-9c96-6c1097af32f9/w640.jpg?1510613823",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consequat lorem quis mattis sodales. Suspendisse in vestibulum nisi. Nunc auctor tempus nisi id pharetra. Praesent hendrerit elit neque, vitae gravida neque rutrum a. Cras est nibh, varius in nisl sit amet, cursus convallis risus. Donec auctor dui dolor, ut egestas nisl porttitor eget. Etiam diam ipsum, viverra quis molestie sed, finibus et mi. Pellentesque non arcu sed libero ullamcorper elementum quis quis quam. Quisque ultrices tellus ipsum, quis vehicula libero eff"
    },

];


/* async function seedDB(){
    try {
        await Campground.deleteMany({});
        console.log("campgrounds removed!");
        await Comment.deleteMany({});
        console.log("comments removed!");
        
    
        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log("campground created");
            let comment = await Campground.create(
                
            
                {
                    text:"un lugar increíble!",
                    author:"Panchisco"
    
                }
            );
            console.log("comment created");
            campground.comments.push(comment);
            campground.save();
            console.log("comment added to campground");
    
        }                  
        

    } catch (err) {
        console.log(err);
    }
}
 */

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
          if(err){
             console.log(err);
         }
         console.log("removed campgrounds!");
          //add a few campgrounds
         data.forEach(function(seed){
             Campground.create(seed, function(err, campground){
                 if(err){
                     console.log(err)
                 } else {
                     console.log("added a campground");
                     //create a comment
                     Comment.create(
                         {
                             text: "This place is great, but I wish there was internet",
                             author: "Homer"
                         }, function(err, comment){
                             if(err){
                                 console.log(err);
                             } else {
                                 campground.comments.push(comment);
                                 campground.save();
                                 console.log("Created new comment");
                             }
                         });
                 }
             });
         }); 
     }); 
     //add a few comments
 } 

module.exports = seedDB; 

