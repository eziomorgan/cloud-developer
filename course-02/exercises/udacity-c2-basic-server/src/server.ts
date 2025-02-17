import express, { Router, Request, Response } from 'express';
// import bodyParser from 'body-parser'; deprecated
const bodyParser = require('body-parser')

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express application
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 
  app.use(express.urlencoded({ extended: true })) //for requests from forms-like data

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;
      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  app.get("/cars/", (req: Request, res: Response) => {
    let { make } = req.query;
    if(!make) {
      return res.status(200).send(cars);
    }
    const foundCars = cars.filter((car) => car.make === make)
    if(foundCars.length === 0){
      return res.status(404).send('no car matching the make provided');
    } else {
      return res.status(200).send(foundCars);
    }
  })

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/car/", (req: Request, res: Response) => {
    let {id} = req.query;
    if(!id){
      return res.status(400).send('id is required');
    }
    const parsedId = parseInt(id as string, 10);
    const foundCar = cars.find((car) => car.id === parsedId);
    if(!foundCar){
      return res.status(404).send('no car matching the id provided');
    } else{
      return res.status(200).send(foundCar);
    }
  })

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post("/car/", (req: Request, res: Response) => {
    let { id, type, model, cost, make} = req.body;
    if(!id || !type || !model || !cost){
      return res.status(400).send('require id, type, model and cost');
    }
    const newCar = {
      id : parseInt(id as string, 10),
      type : type,
      model : model,
      make : make,
      cost : parseFloat(cost as string)
    }
    cars.push(newCar);
    console.log(newCar);
    return res.status(201).send('new car added');
  })

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
