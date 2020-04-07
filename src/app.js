const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validId(req, res, next){
  const { id } = req.params;
  if(!isUuid(id)){
    return res.status(400).json({ error: 'Ivalid Repositorie Id' })
  }
  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repositorie);
  return response.json(repositorie);
});

app.put("/repositories/:id", validId, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(rep => rep.id === id);
  if(repositorieIndex < 0){
    return response.status(400).json({ error: 'Repositorie Not Found' });
  }
  const repositorieAtual = repositories.find(rep => rep.id === id);
  const likes = repositorieAtual.likes; 
  const titleAtual = repositorieAtual.title;
  const urlAtual = repositorieAtual.url; 
  const techsAtual = repositorieAtual.techs; 
  const newRepo = {
    id,
    title: title ? title : titleAtual,
    url: url ? url : urlAtual,
    techs: techs ? techs : techsAtual,
    likes
  };
  repositories[repositorieIndex] = newRepo;
  return response.json(newRepo);
});

app.delete("/repositories/:id", validId, (req, res) => {
  const { id } = req.params;
  const repositorieIndex = repositories.findIndex(rep => rep.id === id);
  if(repositorieIndex < 0){
    return res.status(400).json({ error: 'Repositorie Not Found' });
  }
  repositories.splice(repositorieIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", validId, (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(rep => rep.id === id);
  if(repositorieIndex < 0){
    return response.status(400).json({ error: 'Repositorie Not Found' });
  }
  const repositorieAtual = repositories.find(rep => rep.id === id);
  const likesAtual = repositorieAtual.likes; 
  const title = repositorieAtual.title;
  const url = repositorieAtual.url; 
  const techs = repositorieAtual.techs; 
  const newRepo = {
    id,
    title,
    url,
    techs,
    likes: likesAtual + 1
  };
  repositories[repositorieIndex] = newRepo;
  return response.json(newRepo);
});

module.exports = app;
