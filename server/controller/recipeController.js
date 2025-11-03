require('../models/database')
const { resolveInclude } = require('ejs');
const category = require('../models/category.js');
const Category=require('../models/category.js')
const Recipe=require('../models/Recipe.js');



exports.homepage=async(req,res)=> {
    try{
        const limitNumber=5;
        const categories=await Category.find({}).limit(limitNumber);
        const latest=await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
        const Thai=await Recipe.find({category:'Thai'}).limit(limitNumber);
        const American=await Recipe.find({category:'American'}).limit(limitNumber);
        const Spanish=await Recipe.find({category:'Spanish'}).limit(limitNumber);




        const food={latest,Thai,American,Spanish}
    
        res.render('index',{title:'Cooking Blog-Homepage',categories,food});
    }catch(error)
    {
        res.status(500).send({message:error.message||"Error Occured"});
        console.log(error)
    }
}

exports.exploreCategories=async(req,res)=> {
    try{
        const limitNumber=20;
        const categories=await Category.find({}).limit(limitNumber);
    
        res.render('categories',{title:'Cooking Blog-Categories',categories});
    }catch(error)
    {
        res.status(500).send({message:error.message||"Error Occured"});
        console.log(error)
    }
}



exports.exploreCategoriesById=async(req,res)=> {
    try{
        let categoryId=req.params.id;
        const limitNumber=20;
        const categoriesById=await Recipe.find({'category':categoryId}).limit(limitNumber);
    
        res.render('categories',{title:'Cooking Blog-Categories',categoriesById});
    }catch(error)
    {
        res.status(500).send({message:error.message||"Error Occured"});
        console.log(error)
    }
}








exports.exploreRecipes=async(req,res)=> {
    try{
       const recipeId=req.params.id;
       const recipe=await Recipe.findOne({_id:recipeId})
       res.render('recipe',{title:'Cooking Blog-Recipe',recipe});
    
    }catch(error)
    {
        res.status(500).send({message:error.message||"Error Occured"});
        console.log(error)
    }
}





exports.searchRecipe=async(req,res)=> {
    try{
        let searchTerm=req.body.searchTerm;
        let recipe=await Recipe.find({$text:{$search:searchTerm, $diacriticSensitive:true}})
        res.render('search',{title:'Cooking Blog-Search',recipe});

    }catch(error)
    {
        res.status(500).send({message:error.message||"Error Occured"});
        console.log(error)
    }
   
    
}




exports.exploreLatest=async(req,res)=> {
    try{
       const limitNumber=20;
       const recipe=await Recipe.find({}).sort({_id:-1}).limit(limitNumber)
       res.render('explorelatest',{title:'Cooking Blog-Recipe',recipe});
    
    }catch(error)
    {
        res.status(500).send({message:error.message||"Error Occured"});
        console.log(error)
    }
}



exports.exploreRandom=async(req,res)=> {
    try{
       let count=await Recipe.find().countDocuments();
       let random=Math.floor(Math.random()*count);
       let recipe=await Recipe.findOne().skip(random).exec();
       res.render('explore-random',{title:'Cooking Blog-Random',recipe});
       
    
    }catch(error)
    {
        res.status(500).send({message:error.message||"Error Occured"});
        console.log(error)
    }
}




exports.submitRecipe=async(req,res)=> {
    const infoErrorsObj=req.flash('infoErrors')
    const infoSubmitObj=req.flash('infoSubmit')


    res.render('submit-recipe',{title:'Cooking Blog-Submit',infoErrorsObj,infoSubmitObj});

}


exports.submitRecipeOnPost=async(req,res)=> {
    try{
        let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded.');
    } else {
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;

        uploadPath = require('path').resolve('./public/uploads/') + newImageName;

        imageUploadFile.mv(uploadPath, function(err) {
            if (err) return res.status(500).send(err);
        });
    }
        const newRecipe= new Recipe({
            name:req.body.name,
            description:req.body.description,
            email:req.body.email,
            ingredients:req.body.ingredients,
            category:req.body.category,
            image:newImageName
        })

    await newRecipe.save();
    req.flash('infoSubmit','Recipe has been added')
    res.redirect('/submit-recipe');
    }catch(error){
        //res.json(error)
        req.flash('infoErrors',error)
        res.redirect('/submit-recipe');

    }
}


// async function insertDummycategorydata(){
//     try{

//         await Category.insertMany([
//             {
//                 "name":"Thai",
//                 "image":"thai-food.jpg"
//             },
//             {
//                 "name":"American",
//                 "image":"american-food.jpg"
//             },
//             {
//                 "name":"Mexican",
//                 "image":"mexican-food.jpg"
//             },
//             {
//                 "name":"India",
//                 "image":"indian-food.jpg"
//             },
//             {
//                 "name":"Spanish",
//                 "image":"spanish-food.jpg"
//             }
//         ]);
//     }catch(error)
//     {

//         console.log('err',+error)

//     }
    
// }

// insertDummycategorydata();



// async function insertDummyRecipeData() {
//     try {
//         await Recipe.insertMany([
//             // {
//                 name: "Pad Thai",
//                 description: "A delicious Thai noodle dish with shrimp, tofu, peanuts, and lime.",
//                 email: "chef@thai.com",
//                 ingredients: ["Rice noodles", "Shrimp", "Tofu", "Peanuts", "Lime", "Bean sprouts", "Egg"],
//                 category: "Thai",
//                 image: "pad-thai.jpg"
//             },
//             {
//                 name: "American Cheeseburger",
//                 description: "Classic American burger with a juicy beef patty and cheddar cheese.",
//                 email: "chef@american.com",
//                 ingredients: ["Beef patty", "Burger bun", "Cheddar cheese", "Lettuce", "Tomato", "Onion"],
//                 category: "American",
//                 image: "cheeseburger.jpg"
//             },
//             {
//                 name: "Tacos al Pastor",
//                 description: "Mexican-style tacos with marinated pork, pineapple, and cilantro.",
//                 email: "chef@mexican.com",
//                 ingredients: ["Pork", "Pineapple", "Cilantro", "Onions", "Corn tortillas"],
//                 category: "Mexican",
//                 image: "tacos-al-pastor.jpg"
//             },
//             {
//                 name: "Butter Chicken",
//                 description: "Indian-style butter chicken cooked in a rich tomato and butter sauce.",
//                 email: "chef@indian.com",
//                 ingredients: ["Chicken", "Butter", "Tomato", "Cream", "Garam masala"],
//                 category: "Indian",
//                 image: "butter-chicken.jpg"
//             },
//             {
//                 name: "Paella",
//                 description: "Traditional Spanish seafood paella with saffron-infused rice.",
//                 email: "chef@spanish.com",
//                 ingredients: ["Rice", "Shrimp", "Mussels", "Saffron", "Bell peppers", "Tomato"],
//                 category: "Spanish",
//                 image: "paella.jpg"
//             }
// {
//     "name": "Tom Yum Soup",
//     "description": "A hot and sour Thai soup with shrimp, lemongrass, and lime.",
//     "email": "thaiflavors@example.com",
//     "ingredients": ["Shrimp", "Lemongrass", "Kaffir lime leaves", "Fish sauce", "Chili", "Mushrooms", "Lime"],
//     "category": "Thai",
//     "image": "tom-yum-soup.jpg"
//   },
//   {
//     "name": "Som Tam (Green Papaya Salad)",
//     "description": "A spicy, tangy Thai salad made with shredded green papaya and peanuts.",
//     "email": "spicysalad@example.com",
//     "ingredients": ["Green papaya", "Peanuts", "Tomatoes", "Garlic", "Chili", "Lime juice", "Fish sauce"],
//     "category": "Thai",
//     "image": "som-tam.jpg"
//   },
//   {
//     "name": "Massaman Curry",
//     "description": "A rich and mildly spiced Thai curry with coconut milk, potatoes, and peanuts.",
//     "email": "currylovers@example.com",
//     "ingredients": ["Beef", "Coconut milk", "Potatoes", "Peanuts", "Cinnamon", "Cardamom", "Tamarind"],
//     "category": "Thai",
//     "image": "massaman-curry.jpg"
//   },
//   {
//     "name": "Thai Basil Chicken (Pad Krapow Gai)",
//     "description": "A popular Thai street food dish with stir-fried chicken and basil.",
//     "email": "streetfoodfan@example.com",
//     "ingredients": ["Chicken", "Garlic", "Thai basil", "Soy sauce", "Oyster sauce", "Chili"],
//     "category": "Thai",
//     "image": "thai-basil-chicken.jpg"
//   }

// {
//     "name": "New York Style Pizza",
//     "description": "Thin-crust pizza topped with tomato sauce, mozzarella cheese, and classic toppings.",
//     "email": "pizzafans@example.com",
//     "ingredients": ["Pizza dough", "Tomato sauce", "Mozzarella cheese", "Olive oil", "Basil", "Pepperoni"],
//     "category": "American",
//     "image": "ny-style-pizza.jpg"
//   },
//   {
//     "name": "Clam Chowder",
//     "description": "A creamy New England-style soup with clams, potatoes, and bacon.",
//     "email": "souplovers@example.com",
//     "ingredients": ["Clams", "Potatoes", "Bacon", "Heavy cream", "Celery", "Onions", "Thyme"],
//     "category": "American",
//     "image": "clam-chowder.jpg"
//   },
//   {
//     "name": "Cornbread",
//     "description": "A golden, buttery cornbread with a slightly sweet taste, perfect with chili.",
//     "email": "cornbreadfan@example.com",
//     "ingredients": ["Cornmeal", "Flour", "Eggs", "Milk", "Sugar", "Butter", "Baking powder"],
//     "category": "American",
//     "image": "cornbread.jpg"
//   },
//   {
//     "name": "Apple Pie",
//     "description": "A classic American dessert with cinnamon-spiced apples in a flaky crust.",
//     "email": "bakersdelight@example.com",
//     "ingredients": ["Apples", "Pie crust", "Sugar", "Cinnamon", "Butter", "Nutmeg", "Lemon juice"],
//     "category": "American",
//     "image": "apple-pie.jpg"
//   },

//   {
//     "name": "Gazpacho",
//     "description": "A refreshing cold tomato soup with cucumbers, peppers, and olive oil.",
//     "email": "souplovers@example.com",
//     "ingredients": ["Tomatoes", "Cucumber", "Red bell pepper", "Garlic", "Olive oil", "Vinegar"],
//     "category": "Spanish",
//     "image": "gazpacho.jpg"
//   },
//   {
//     "name": "Patatas Bravas",
//     "description": "Crispy fried potatoes served with a spicy tomato sauce.",
//     "email": "tapasfan@example.com",
//     "ingredients": ["Potatoes", "Olive oil", "Tomato sauce", "Garlic", "Paprika", "Chili powder"],
//     "category": "Spanish",
//     "image": "patatas-bravas.jpg"
//   },
//   {
//     "name": "Churros",
//     "description": "Crispy fried dough sticks dusted with sugar and served with chocolate sauce.",
//     "email": "dessertlover@example.com",
//     "ingredients": ["Flour", "Butter", "Water", "Sugar", "Salt", "Cinnamon"],
//     "category": "Spanish",
//     "image": "churros.jpg"
//   },
//   {
//     "name": "Fabada Asturiana",
//     "description": "A rich white bean stew with chorizo and morcilla sausage.",
//     "email": "stewmaster@example.com",
//     "ingredients": ["White beans", "Chorizo", "Morcilla", "Paprika", "Onion", "Garlic"],
//     "category": "Spanish",
//     "image": "fabada-asturiana.jpg"
//   },
//   {
//     "name": "Pimientos de Padrón",
//     "description": "Small green peppers fried in olive oil and sprinkled with sea salt.",
//     "email": "snacklover@example.com",
//     "ingredients": ["Padrón peppers", "Olive oil", "Sea salt"],
//     "category": "Spanish",
//     "image": "pimientos-padron.jpg"
//   }



//         ]);
//     }catch(error)
//     {
//         console.log("error")
//     }
// }

// insertDummyRecipeData()
