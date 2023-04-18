import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import Joi from "joi";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = 5000;

let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

app.post("/cadastro", async (req, res) => {

    const { nome, email, senha, confirmeSenha } = req.body;

    const cadastroSchema = Joi.object({
        nome: Joi.required(),
        email: Joi.email().required(),
        senha: Joi.min(3).required(),
        confirmeSenha: Joi.required()
    })

    const cadastrados = {email, senha}

    const validation = cadastroSchema.validate(req.body, {abortEarly: false})

    if(validation.error){
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(422).send(errors);
    }

    try {
        await db.collection("cadastrados").insertOne(cadastrados);
        res.sendStatus(201);

    } catch (err) {
        res.sendStatus(500);
    }
})

app.post("/login", async (req, res)=>{
    
})











app.listen(PORT, () => console.log("Servidor rodando na porta 5000"));