# Express Routing System & CRUD Operations

- read
- create

## CRUD(R) - Read  

In this day we will learn how to use express routing.

- create a new folder
- add an entry point file
- initialize npm in the project
- add express as dependency

```bash

touch app.js
npm init -y
npm i express
# install nodemon (optional)
npm i -D nodemon
# install dotenv (optional)
npm i -D dotenv
```

Next move into the app.js file and add create our express server instance.

```js
const express = require('express')
const app = express()

// static files (optional)
app.use(express.static('/public'))


app.listen(3000, () => {
  console.log("Server started on port 3000")
});
```

now let's edit our package json and add a script to start and one to watch the files for changes.

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js",
    "dev": "node --watch --env-file=.env app.js"
  },
```

Make sure to create a file called `.env` for the environment variables.

>NOTE: You can use `nodemon` and `dotenv` packages to start the server and read the environment variables, however we will not use them as recent versions of node are using native support for this.

### Add a new route to our app

Now that our server is ready we can add a new route to respond to get requests from the client and return a json response to the user with our menu of pizzas.

We will start by adding our menu in a dedicated file called `menu.js` in the db foder

```bash
mkdir db
touch db/menu.js

```

In the menu.js file we will export an array with the menu items.

```js
const menu = [
  {
    id: 1,
    name: "Margherita",
    slug: "margherita",
    type: "classica",
    image: "pizze/margherita.webp",
    ingredients: ["pomodoro", "mozzarella"],
  },
  {
    id: 2,
    name: "Marinara",
    slug: "marinara",
    type: "classica",
    image: "pizze/marinara.jpeg",
    ingredients: ["pomodoro", "aglio", "origano"],
  },
  {
    id: 3,
    name: "Diavola",
    slug: "diavola",
    type: "speciale",
    image: "pizze/diavola.jpeg",
    ingredients: ["pomodoro", "mozzarella", "salame piccante"],
  },
  {
    id: 3,
    name: "Bufalina",
    slug: "bufalina",
    type: "speciale",
    image: "pizze/bufalina.jpeg",
    ingredients: ["pomodoro", "mozzarella di bufala"],
  },
  {
    id: 4,
    name: "4 formaggi",
    slug: "4-formaggi",
    type: "classica",
    image: "pizze/4_formaggi.jpeg",
    ingredients: ["pomodoro", "mozzarella", "gorgonzola", "parmigiano", "ricotta"],
  }
]

module.exports = menu;
```

Now with the data available let's return the json response from our first endpoint.

Back in the app.js file let's import our menu and create our first endpoint.

```js
// import the menu.js file
const menu = require('./db/menu.js')

// Let's now create our first endpoints
// (index) Get all pizzas
app.get('/pizze', (req, res) => {
  res.json({ data: menu, count: menu.length })
});
```

next let's create a second endpoint that will return a single pizza based on its id.

```js
// (show) Get a single pizza by its ID
app.get('/pizze/:id', (req, res) => {

  // find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id))
  if (!pizza) {
    return res.status(404).json({ error: "No pizza found with that id" })
  }
  return res.status(200).json({ data: pizza })
});

```

In the route above we used the request to read the current parameter value (the id) that we will use to find a specific value from the menu array and read its information as JSON.

> NOTE: when we use res.json or res.send the execution of the code isn't stopped therefore if we don't use the return keyword or an else block express with try to send two responses resulting in headers already sent error when there is no pizza with that ID found.

### Refactoring - using a controller

As we have seen yesterday we can use controllers to organize our code.
So the first thing we want to do is create a new folder and place our controller file in it. Next we will move our routes inthere.

```bash
mkdir controllers
touch controllers/pizza-controller.js

```

In the controllr file we can move our menu import and update its path
then we can grab the functions we created for our routes earlier and place them inside a controller.

### Index method

```js
// pizza-controller.js
const menu = require('../db/menu.js')
```

Now its the turn of the function

```js
// pizza-controller.js

const index = (req, res) => {
  res.json({ data: menu, count: menu.length })
}
```

and we can export it at the bottom of the controller file.

```js
module.exports = {
  index
}
```

> NOTE: we return an object since we will export other methods from this controller

**Update the app.js file**
Now we can update the app.js file to use our new controller.

First import the controller file and then use it in the routes.

```js
const PizzaController = require('./controllers/PizzaController');

// .. then use it
app.get('/pizze', PizzaController.index);

```

Let's test this in postman and move on.

### Show method

Now let's follow the same steps to update our show route.
Move the function from the app.js file and create a show method in the controller file, like so:

```js
// PizzaController.js

const show = (req, res) => {

  // find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id))
  if (!pizza) {
    return res.status(404).json({ error: "No pizza found with that id" })
  }
  return res.status(200).json({ data: pizza })
}
```

Now we need to update our export and then the app.js file.

```js
// PizzaController.js
module.exports = {
  index,
  show
}

```

And now we can use it

**update the app.js file**

```js
// (show) Get a single pizza by its ID
app.get('/pizze/:id', PizzaController.show);
```

Let's test this in postman and we are almost there!
Great if it still works we are done!

Now let's see how we can implement the express router in our application and make our code even more clean and readable.

### Express Router

In the previous section, we created a new controller file to handle all the routes. This is not necessary but it makes our code cleaner. Now we will use the express router and update our code.

> NOTE: there is nothing wrong with the previous approach. It's just that we are using a more advanced approach.

This is where we are now and how our app.js file looks like:

```js
const express = require('express')
const app = express()
const PizzaController = require('./controllers/PizzaController');
// static files (optional)
app.use(express.static('/public'))

app.listen(3000, () => {
  console.log("Server started on port 3000")
});

// Let's now create our first endpoints
// (index) Get all pizzas
app.get('/pizze', PizzaController.index);

// (show) Get a single pizza by its ID
app.get('/pizze/:id', PizzaController.show);

```

### Create the router file

Let's create a new folter where we can place all routes related to a given entity. In our case, it will be pizza.js.

```bash
mkdir routes
touch routes/pizza.js

```

Now we can move our routes inside the file and export them as a module.

In the routes file pizza.js

```js
// import express and create the router instance
const express = require('express')
const router = express.Router()


// your routes go here


module.exports = router

```

Now let's move our routes from app.js to pizza.js file and replace app with an instance of router.

We will change from this

```js
// your routes go here

// (index) Get all pizzas
app.get('/pizze', PizzaController.index);

// (show) Get a single pizza by its ID
app.get('/pizze/:id', PizzaController.show);
```

to this

```js
// (index) Get all pizzas
router.get('/pizze', PizzaController.index);

// (show) Get a single pizza by its ID
router.get('/pizze/:id', PizzaController.show);
```

But as of now things aren't working because we need to move our controller import to the routes file too.

**import the controller**
at the top of the file with the other imports

```js
const PizzaController = require('../controllers/PizzaController');

```

### Use the router

Now we can use the router in app.js and replace the app instance with the router instance.

```js

// import the pizza routes
const pizzaRoutes = require('./routes/pizza')

// use the middleware to use the routes
app.use('/pizze', pizzaRoutes)

```

> NOTE: notice that we can pass a `/pizze` as a prefix for all routes. This is useful when you want to have a common prefix for all routes.

Since we used the prefix when calling our routes, we need to update the routes file too to reflect this change.

```js
// routes/pizza.js
// (index) Get all pizzas
app.get('/', PizzaController.index);

// (show) Get a single pizza by its ID
app.get('/:id', PizzaController.show);
```

### Final version

This is our final version of the routes file.

```js
// routes/pizza.js
const express = require('express')
const router = express.Router()
const PizzaController = require('../controllers/PizzaController');


// your routes go here

// Let's now create our first endpoints
// (index) Get all pizzas
router.get('/', PizzaController.index);

// (show) Get a single pizza by its ID
router.get('/:id', PizzaController.show);


module.exports = router
```

Below there is the final version of app.js file.

```js
// app.js
const express = require('express')
const app = express()
//const PizzaController = require('./controllers/PizzaController');
const pizzaRoutes = require('./routes/pizza')
// static files (optional)
app.use(express.static('/public'))


app.listen(3000, () => {
  console.log("Server started on port 3000")
});

app.use("/pizze", pizzaRoutes)


```

And here is our controller.

```js
// controllers/PizzaController.js
// import the menu.js file
const menu = require('../db/menu.js')


const index = (req, res) => {
  res.json({ data: menu, count: menu.length })
}

const show = (req, res) => {

  // find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id))
  if (!pizza) {
    return res.status(404).json({ error: "No pizza found with that id" })
  }
  return res.status(200).json({ data: pizza })
}

module.exports = {
  index,
  show
}

```

Let's test it in postman or in the browser and we are done!

## CRUD (C) - Create a new a new pizza

In this section I will be showing you how to add a new pizza. I will be using Postman for this.

Let's start by creating a new route in our routes file that will handle the incoming request and the data we want to send.

```js


// routes/pizza.js
router.post("/pizze", PizzaController.store)

```

The route must use the post method to handle the incoming data.

Now let's create a new controller's method for this route.

```js
// /controllers/PizzaController.js
const store = (req, res) => {
  // add the pizza to our menu array
}
```

In the store function we will be adding the data that is sent in the request body and then pushing it into the menu array.
The first thing we should do is to check if we can read the request body to do that le'ts add a console.log
of the `req.body`

```js
const store = (req, res) => {
  // add the pizza to our menu array
  console.log(req.body);
}
```

Before this can work we need to export the method, so we need to update the export in our controller file.

```js

module.exports = {
  index,
  show,
  store
}
```

Now let's add a new pizza and see if it works!

**Add a pizza**
To test this we will use postman. In the body section of the request I will be sending a json object with the name and ingredients property.

Open postman and in the body tab and select raw and then select JSON (application/json).

```json
{
    "name": "5 formaggi",
    "ingredients": [
        "pomodoro",
        "mozzarella",
        "gorgonzola",
        "parmigiano",
        "ricotta"
    ]
}
```

**Result**
As you can see in the console we have an empty json object response. This is because we need to parse the request body
to a json object before we can access it's properties. To do that we will add a new middleware in our server file.

Add the code below in the `app.js` file, make sure to restart the server.
> Server Restart: not necessary if using nodemon or --watch flag.

```js

// parse incoming requests data (optional)
app.use(express.json())

```

With this in place try again seinging a new post request to our endpoint and see the response.

Now that we have access to the response we can add a new pizza.

### Add a new pizza to the menu.js array

Now we know that the body can be parsed correctly, let's add a new pizza.

Update the `store` method with the following code

```js
  // create the new pizza object
  const pizza = {
    id: Number(menu[menu.length - 1].id + 1), // get the id of the last item in the array and add one
    name: req.body.name, // get the name from the request body
    slug: req.body.slug,  // get the slug from the request body
    image: req.body.image || "https://via.placeholder.com/350x150", // get the image from the request body or use a placehodler
    ingredients: req.body.ingredients, // get the ingredients from the request body
  };

  // push it to our menu array
  // 💡 The update will not persist as the array is in memory.
  menu.push(pizza)

 
  // return the new menu
  return res.status(201).json({
    status: 201,
    data: menu,
    count: menu.length
  })


```

The code above returns the new menu with a 201 status and the new pizza added to it. Hovever, the new pizza is not persistently added since we are
not using a database but an array in memory. We will fix that later adding a real database but in the meantime we can use a file system to store our data.

### Update the menu.js file

Thanks to the previous code, we have a new pizza added to the menu. Now let's update the `menu.js` file. We can do that using the
built-in node module `fs`.

Fist of all we need to import it at the top of our controller file.

```js
const fs = require('fs')
```

Now we can update our store method. We need to use the `writeFileSync()` method instead of the `push()` method to make things persistent a little bit.

```js
// update the js file
fs.writeFileSync('./db/menu.js', `module.exports = ${JSON.stringify(menu, null, 4)}`)
```

In the code above we used the `writeFileSync()` method to write back our menu array into a file called `menu.js`. The first parameter is the path of the file and the second one is the content that will be written into.

The `JSON.stringify()` method converts an object or any other value in JSON. Note that we passed the third argument to format our JSON properly.

**Final code**
Our store method now looks like this:

```js

const store = (req, res) => {
  // add the new pizza to the menu array
  console.log(req.body);

  // create the new pizza object
  const pizza = {
    id: Number(menu[menu.length - 1].id + 1),
    name: req.body.name,
    slug: req.body.slug,
    image: req.body.image || "https://via.placeholder.com/350x150",
    ingredients: req.body.ingredients,
  };

  // push it to our menu array
  // 💡 The update will not persist as the array is in memory.
  //menu.push(pizza)

  // update the js file
  fs.writeFileSync('./db/menu.js', `module.exports = ${JSON.stringify(menu, null, 4)}`)
  // return the new menu
  return res.status(201).json({
    status: 201,
    data: menu,
    count: menu.length
  })

}

```

## CRUD (U) - Update an existing pizza

In this section we will learn how to update a pizza in our system. We are not yet using a db but we are going to use the node filesyetem module to make our life easier and obtain data persistency.

### Step 1. Add the route

The first thing do to is to add a new route to our `/routes/pizza.js` file and use the `put` method to create a route that respond to a PUT requests.

```js
// routes/pizza.js
router.put("/:id", PizzaController.update)

```

### Step 2. Add the controller method

Now we need to add a new method in our controller to make things happen and be able to update the pizza.

Inside `controllers/PizzaController` file, add this method:

```js

const update = (req, res) => {
  // find the pizza by id


  // check if the user is updating the correct pizza


  // update the pizza object


  // update the js file


  // return the updated menu item


}

```

Inside our method we have outlined the tasks that we need to do in the order they needs to happen. Before talking about the implementation let's export the method from the controller so it can be used by the route we created earlier.

### Step 3. Export the method to the controller

You need to update the exported object in `controllers/PizzaController` file to include this new method otherwise you will not be able to use for the route we created above.

```js

module.exports = {
  index,
  show,
  create,
  update // <-- add this line
}

```

Now our app can handle requests made to the following endpoint `/pizza/:id` to update a pizza given its id paramenter.

### Step 4. Implement the update method logic

We have outlined in the previous step what we need to do, now let's recap:

1. find the pizza by id
2. check if the user is updating the correct pizza
3. update the pizza object
4. update the js file
5. return the updated menu item

Let's start with the fist task, find the pizza by its id parameter and save it in a variable called `pizza`. We can use this variable to check if the user is updating the correct pizza, if not we should return a 404 error since we don't have it in our menu.

**1 Find the pizza**:

```js

const update = (req, res) => {
  // 1 find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id));
  // continue...
}

```

**2 Check if the user is updating the correct pizza**:
Now that we have the pizza object in our variable let's check if it exists, if not return a 404 error.

```js
const update = (req, res) => {
  // 1 find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id));
  // 2 check if the user is updating the correct pizza
  if (!pizza) {
    return res.status(404).json({ error: "No pizza found with that id" })
  }
}

```

In the next step we can finally update the pizza item object then we will move to the next step.

```js

const update = (req, res) => {
  // 1 find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id));

  // 2 check if the user is updating the correct pizza
  if (!pizza) {
    return res.status(404).json({ error: "No pizza found with that id" })
  }

  // 3 update the pizza object
  pizza.name = req.body.name;
  pizza.slug = req.body.slug;
  pizza.image = req.body.image || "https://via.placeholder.com/350x150";
  pizza.ingredients = req.body.ingredients;

  // continue...
}
```

This step is critical because we need to return the updated pizza object back to the user or in our case we want to return the entire list of pizzas.

Before we do that, let's make the pizza update persistent and update out menu file

```js

  // 4. update the js file
  fs.writeFileSync('./db/menu.js', `module.exports = ${JSON.stringify(menu, null, 4)}`)

```

The line above will convert our array of pizza objects into a string and then write it back to the menu.js file. Now our menu is updated and we can finally return the updated pizzas to the user.

```js
  // return the updated menu item
  res.status(200).json({
    status: 200,
    data: menu
  })

```

Now our `update` method should look like this:

```js
const update = (req, res) => {
  // 1 find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id));

  // 2 check if the user is updating the correct pizza
  if (!pizza) {
    return res.status(404).json({ error: "No pizza found with that id" })
  }

  // 3 update the pizza object
  pizza.name = req.body.name;
  pizza.slug = req.body.slug;
  pizza.image = req.body.image || "https://via.placeholder.com/350x150";
  pizza.ingredients = req.body.ingredients;


  // 4 update the js file
  fs.writeFileSync('./db/menu.js', `module.exports = ${JSON.stringify(menu, null, 4)}`)

  // 5 return the updated menu item
  res.status(200).json({
    status: 200,
    data: menu
  })


}

```

Our endpoint is ready for testing with Postman. Let's test it out!
Create a new request in postman and set the method as `PUT` and the URL to `http://localhost:3000/pizze/2`

The dynamic parameter in the URL is replaced by the id of the pizza we want to update.
In the body tab (in Postman) we can set the body as `raw` and then select `JSON` as the content type.

Try passing this json to the request and press SEND.

```json
{
    "name": "Vegan Super Pizza",
    "slug": "margherita",
    "type": "classica",
    "image": "pizze/margherita.webp",
    "ingredients": [
        "pomodoro",
        "mozzarella"
    ]
}
```

If everything is ok, you should see the updated pizza object in the response body togheter with the rest of our menu.

🎊 Congratulations! 🎉

## CRUD (D) - Delete an existing pizza

In this section we will learn how to update a pizza in our system. We are not yet using a db but we are going to use the node filesyetem module to make our life easier and obtain data persistency.

### Step 1. Add the route

The first thing do to is to add a new route to our `/routes/pizza.js` file and use the `delete` method to create a route that respond to a PUT requests.

```js
// routes/pizza.js
router.delete("/:id", PizzaController.destroy)

```

### Step 2. Add the controller method

Now we need to add a new method in our controller to make things happen and be able to delete the pizza.

Inside `controllers/PizzaController` file, add this method:

```js

const destroy = (req, res) => {
  // find the pizza by id


  // check if the user is updating the correct pizza


  // remove the pizza from the menu

  
  // update the js file


  // return the updated menu item


}

```

Inside our method we have outlined the tasks that we need to do in the order they needs to happen. Before talking about the implementation let's export the method from the controller so it can be used by the route we created earlier.

### Step 3. Export the method to the controller

You need to update the exported object in `controllers/PizzaController` file to include this new method otherwise you will not be able to use for the route we created above.

```js

module.exports = {
  index,
  show,
  create,
  update,
  destroy // <-- add this line here
}

```

> note: we are calling the method `destroy` that we created above instead of `delete` as the method name suggests because in js the word delete is not available.

Now our app can handle requests made to the following endpoint `/pizza/:id` to delete a pizza given its id paramenter.

### Step 4. Implement the update method logic

We have outlined in the previous step what we need to do, now let's recap:

1. find the pizza by id
2. check if the user is destroying the correct pizza
3. destroy the pizza object
4. update the js file
5. return the updated menu item

Let's start with the fist task, find the pizza by its id parameter and save it in a variable called `pizza`. We can use this variable to check if the user is updating the correct pizza, if not we should return a 404 error since we don't have it in our menu.

**1 Find the pizza**:

```js

const destroy = (req, res) => {
  // 1 find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id));
  // continue...
}

```

**2 Check if the user is updating the correct pizza**:
Now that we have the pizza object in our variable let's check if it exists, if not return a 404 error.

```js
const destroy = (req, res) => {
  // 1 find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id));

  // 2 check if the user is deleting the correct pizza
  if (!pizza) {
    return res.status(404).json({ error: "No pizza found with that id" })
  }
}

```

In the next step we can delete the array item using filter method and return a new array excluding the deleted item.

```js

const destroy = (req, res) => {
  // 1 find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id));

  // 2 check if the user is updating the correct pizza
  if (!pizza) {
    return res.status(404).json({ error: "No pizza found with that id" })
  }

  // 3 remove the pizza from the menu
  const newMenu = menu.filter((pizza) => pizza.id !== parseInt(req.params.id));

  // continue...
}
```

This step is critical because we need to return the updated pizza object back to the user or in our case we want to return the entire list of pizzas.

Before we do that, let's make the pizza update persistent and update out menu file

```js

  // 4. update the js file
  fs.writeFileSync('./db/menu.js', `module.exports = ${JSON.stringify(newMenu, null, 4)}`)

```

The line above will convert our array of pizza objects into a string and then write it back to the menu.js file. Now our menu is updated and we can finally return the updated pizzas to the user.

```js
  // return the updated menu item
  res.status(200).json({
    status: 200,
    data: menu
  })

```

Now our `destroy` method should look like this:

```js
const destroy = (req, res) => {
  // find the pizza by id
  const pizza = menu.find((pizza) => pizza.id === parseInt(req.params.id));

  // check if the user is deleting the correct pizza
  if (!pizza) {
    return res.status(404).json({ error: "No pizza found with that id" })
  }

  // remove the pizza from the menu
  const newMenu = menu.filter((pizza) => pizza.id !== parseInt(req.params.id));

  // update the js file
  fs.writeFileSync('./db/menu.js', `module.exports = ${JSON.stringify(newMenu, null, 4)}`)

  // return the updated menu item
  res.status(200).json({
    status: 200,
    data: newMenu,
    counter: newMenu.length
  })

}


```

Our endpoint is ready for testing with Postman. Let's test it out!
Create a new request in postman and set the method as `DELETE` and the URL to `http://localhost:3000/pizze/3`

The dynamic parameter in the URL is replaced by the id of the pizza we want to update.
This tyme the body of our request will be empty as we don't have any data to send.

If everything is ok, you should see the updated pizza menu in the response body.

🎊 Congratulations! 🎉

## Middleware

As you noticed if we try to use a url that does not exist, we will not get a proper 404 error handled by us. This is because node/express do not handle errors. We need to add a middleware for this.

A middleware is a function that has access to the `req` object, the `res` object and the `next` function, that must be invoked to pass the request to the next middleware in the chain. A middleware runs on every request, there are different types of middleware. Middeware can also be associated to a given path, and restrict its actions to run only on that path and those within it.

It can be used to check if the user is authenticated, or to check if the user has access to the resource they are trying to reach but has also many other use cases.

In our case we will catch any route that does not exist and return a 404 error.

Steps:

- Create a new file in the `middlewares` folder called `notFound.js`.
- add the middleware code below to the file.

```js
const notFoundMiddleware = (req, res, next) => {
  res.status(404).send("Sorry can't find that!")
}

module.exports = notFoundMiddleware;

```

This function has access to three params, the request object, response object and a next function. The next function is used to call the next middleware in the chain. In the middleware function above we haven't called `next` function because we don't want to call any other middleware in this chain, we just want to return a 404 error.

So we informed the client that the response is completed using the `send()` method that ends the application request-response cycle.

After that we export the middleware as `notFoundMiddleware`.
Now we need to add the middleware to our app.js file.

## Add the middleware to the app.js file

Open the `app.js` file and scroll to the bottom of the file. Our middleware needs to be added after the last route of our app so it will be executed if none of the routes match.

Import the middleware at the top of your app.js file

```js
const notFoundMiddleware = require('./middleware/notFoundMiddleware.js')
```

Add this at the bottom of the app.js file.

```js

// this needs to be the last call in the app, right after all the routes are defined.
app.use(notFoundMiddleware);
```

## Add the custom logger middleware to the app.js file

Now that we can handle 404 errors, let's add a custom middleware logger that will print in the console every time a request is made to our server plus some key information.

Create a new file in the middlewares folder called `loggerMiddleware.js`.

```js
// create a miggleware function
// notice the third parameter of the function, it's a next function call.
const loggerMiddleware = (req, res, next) => {
  const now = new Date().toString();
  console.error(`
    Date: ${now} 
    Method: ${req.method} 
    URL: ${req.url}`);

  // we need to call next to avoid the request is hanging forever.
  next();

}
// export the function created.
module.exports = loggerMiddleware;
```

Now that we have a custom middleware, let's add it to our app.js file.

**import** the middleware at the top of your app.js file

```js
const loggerMiddleware = require('./middleware/loggerMiddleware')

```

next use it. This middleware will be executed before every request is made to the /pizze endpoints.

```js
app.use('/pizze', loggerMiddleware)
```

🎊 Congratulations! You have created your first custom middleware.

## Lets add a custom error handler middleware to the app.js file

Now let's complete our project by handling also potential server errors happening in our endpoints.

### Trigger a server error

Before we do that, let's trigger a server error and then see what happens.
To do that we will add a route based middleware to our app.js file.
We will place it before our routes definition.

```js

// middleware to trigger a 500 error
app.use('/pizze', (req, res, next) => {
  throw new Error("You broke everything dude! 💥");
}); 

// Your routes here
// ...
```

> NOTE: ⚠️ place this before all routes `/pizze` to test the error handling middleware that we will create soon, but remember to removed the code above after we tested the error handling middleware otherwise our endpoints will be broken.

### Lets create a custom error handler middleware

Now let's create a custom error handler middleware. This middleware will be executed when an error is triggered after the client requests any our our endpoints.

> NOTE: Put this middleware at the bottom of your app.js file.
> nothing should be after it because it will not work.

```js

// Last middleware to handle errors
app.use((err, req, res, next) => {
  console.log("Error: ", err.message);
  // this prints the stack trace of the error
  console.error(err.stack);
  res.status(500).send({
    message: "Something went wrong",
    error: err.message
  })
});

```

Now when we try to send a request to any of our endpoints prefixed with `/pizze` we should see the error message and the stack trace.

This completes the chapter about error handling.
🎊 Congratulations!