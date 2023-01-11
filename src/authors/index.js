import express from "express";
import fs from "fs";

import uniqid from "uniqid";
import { getAuthors, writeAuthors } from "../lib/fs-tools.js";

// ..........................................Creating CRUD operations...............................
const authorsRouter = express.Router(); //declaring the Router that connects our operations to the server

// 1. Create
authorsRouter.post("/", async (request, response) => {
  const newAuthor = {
    ...request.body,
    createdAt: new Date(),
    id: uniqid(),
    avatar: `https://ui-avatars.com/api/?name=${request.body.firstName}+${request.body.lastName}`,
  }; //new author is contained by the spreaded req body, and also serverGenerated values
  const authorsArray = await getAuthors(); //reading and assigning the JSON file according to the pathname
  authorsArray.push(newAuthor); //pushing the newAuthor to the previously declared array
  await writeAuthors(authorsArray); //writing to the pathname the JSON Array
  response.status(200).send({ id: newAuthor.id }); //sending back the response
});

// 2. Read
authorsRouter.get("/", async (request, response) => {
  const authors = await getAuthors();
  response.send(authors); //sending the JSON body
});

// 3. Read individual author
authorsRouter.get("/:id", async (request, response) => {
  const authorId = request.params.id; //reading params from the URL
  const authorsArray = await getAuthors(); //reading and assigning the JSON file according to the pathname
  const searchedAuthor = authorsArray.find((author) => author.id === authorId); //retrieves the OBJ of the array that corresponds to the criteria
  response.send(searchedAuthor); //sends back the response
});

// 4. Update
authorsRouter.put("/:id", async (request, response) => {
  const authorId = request.params.id; //reading params from the URL
  const authorsArray = await getAuthors(); //reading and assigning the JSON file according to the pathname
  const oldAuthorIndex = authorsArray.findIndex(
    (author) => author.id === authorId
  ); //retrieves the index corresponding to the user's passed ID
  const oldAuthor = authorsArray[oldAuthorIndex]; //assigning the correct old author based on the previously found index
  const updatedAuthor = {
    ...oldAuthor,
    ...request.body,
    updatedAt: new Date(),
  }; //updating the old OBJ body with the req body, adding server generated values
  authorsArray[oldAuthorIndex] = updatedAuthor; //updating the array at correct index with the new OBJ
  await writeAuthors(authorsArray); //writing the new JSON file with the updated Array
  response.send(updatedAuthor); //sends back the updated version of the oldAuthor
});

// 5.DELETE
authorsRouter.delete("/:id", async (request, response) => {
  const authorId = request.params.id; //reading params from the URL
  const authorsArray = await getAuthors(); //reading and assigning the JSON file according to the pathname
  const filteredAuthorsArray = authorsArray.filter(
    (author) => author.id !== authorId
  ); //returns a new array of authors just with authors that don't have the id equal to the passed authorId (aka deletes the corresponding author)
  await writeAuthors(filteredAuthorsArray); //writing the new JSON file with the new filtered Array
  response.status(204).send(); //response just with status
});

// 6. Create a new author with condition
authorsRouter.post("/checkEmail", async (request, response) => {
  const newAuthor = { ...request.body, createdAt: new Date(), id: uniqid() }; //assigning to a new OBJ the values from req body
  const authorsArray = await getAuthors(); //reading and assigning the JSON file according to the pathname
  const existingAuthor = authorsArray.find(
    (author) => author.email === newAuthor.email
  ); //returns or not an OBJ with the corresponding criteria
  existingAuthor
    ? response.send({ isEmailAlreadyInUse: true })
    : response.send({ isEmailAlreadyInUse: false }); //if previously OBJ exists, return true, if not, false
});

export default authorsRouter;