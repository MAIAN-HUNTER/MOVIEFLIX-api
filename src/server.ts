import express from 'express';
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/movies', async (_, res) => {
   const movies = await prisma.movies.findMany({
   orderBy: { title: 'asc', },
   include: { genres: true, languages: true }
 });
   res.json(movies);
});

app.post('/movies', async (req, res) => {

  const { title, genre_id, language_id, oscar_count, release_date } = req.body;
    
  try{

       const movieWithSameTitle = await prisma.movies.findFirst({
       where: { 
           title: { equals: title, mode: "insensitive" }
       }, 
   });

   if (movieWithSameTitle) {
     res
        .status(409)
        .send({ message: "Já existe um filme com esse título" });
   }
 await prisma.movies.create({
   data: {
     title,
     genre_id,
     language_id,
     oscar_count,
     release_date: new Date(release_date),
   }
 });
}catch(error){
   res.status(500).send({message:"Falha ao cadastrar um filme"});
}

 res.status(201).send();
});

app.put('/movies/:id', async (req, res) => {
   const id = Number(req.params.id);

   try{
   const movie = await prisma.movies.findUnique({
     where: { id },
   });

   if (!movie) {
     res.status(404).send({ message: "Filme não encontrado" });
   }
   const data = { ...req.body };
    data.release_date = data.release_date
     ? new Date(data.release_date)
     : undefined;

     await prisma.movies.update({ where: { id }, data });
  }catch(error){
    res.status(500).send({ message: "Falha ao atualizar o registro" });
  }
    res.status(200).send()
});

app.delete('/movies/:id', async (req, res) => {
   const id = Number(req.params.id);

   try{
     const movie = await prisma.movies.findUnique({
     where: { id }})

 

     if (!movie) {
       res.status(404).send({ message: 'Filme não encontrado' });
     }

       await prisma.movies.delete({ where: { id }});
   
     }catch(error) {
       res.status(500).send({ message: 'Falha ao remover o registro' });
     }
   
 res.status(200).send({message: "Filme removido com sucesso"});
});

app.get("/movies/:genreName", async(req, res) => {
    try {
           const moviesFilteredByGenreName = await prisma.movies.findMany({
               include: {
                    genres: true,
                    languages: true,
                },
                where: {
                    genres: {
                            name: {
                                 equals: req.params.genreName,
                                  mode: "insensitive",
                             },
                    },
                 },
            });

                   res.status(200).send(moviesFilteredByGenreName);
   } catch (error) {
       res.status(500).send({ message: "Falha ao atualizar um filme" });
   }

});

app.listen(port, () => {
   console.log(`Servidor em execução em http://localhost:${port}`);
});            