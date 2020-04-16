const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkRespositoryExists = (request, response, next) => {

  const {id} = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository Not Found!'});
  }

  response.locals.repositoryIndex = repositoryIndex;

  return next();
};

app.use("/repositories/:id*", checkRespositoryExists);


app.get("/repositories", (request, response) => {
  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const {title, url, techs} = request.body;

  const newRepository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  
  const {id} = request.params;
  const repositoryIndex = response.locals.repositoryIndex;
  const {title, url, techs} = request.body;
  
  const foundRepository = repositories[repositoryIndex];
  const changedRepository = { id, title, url, techs, likes: foundRepository.likes };

  repositories[repositoryIndex] = changedRepository;

  return response.json(changedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  
  const {id} = request.params;
  const repositoryIndex = response.locals.repositoryIndex;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  
  const {id} = request.params;
  const repositoryIndex = response.locals.repositoryIndex;

  const foundRepository = repositories[repositoryIndex];
  foundRepository.likes = foundRepository.likes + 1;

  repositories[repositoryIndex] = foundRepository;

  return response.json(foundRepository);
});

module.exports = app;
