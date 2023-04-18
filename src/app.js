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
        email: Joi.string().email().required(),
        senha: Joi.string().min(3).required(),
        confirmeSenha: Joi.required()
    })

    const cadastrados = { nome, email, senha, confirmeSenha }

    const validation = cadastroSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
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

app.get("/cadastro", async (req, res) => {
    try {
        const cadastrados = await db.collection("cadastrados").find({}).toArray();
        res.send(cadastrados);

    } catch (err) {
        res.sendStatus(500);
    }
})

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    const logados = { email, senha };

    const loginSchema = Joi.object({
        email: Joi.required(),
        senha: Joi.string().min(3).required()
    })

    const validation = loginSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }


    try {

        const existingEmail = await db.collection("cadastrados").findOne({ email: logados.email });
        if (!existingEmail) {
            return res.status(404).send("O usuário não foi cadastrado!");
        }
        const existingPassword = await db.collection("cadastrados").findOne({ senha: logados.senha });
        if (!existingPassword) {
            return res.status(401).send("Senha incorreta");
        }
        await db.collection("login").insertOne(logados);
        res.sendStatus(200);

    } catch (err) {
        res.sendStatus(500);
    }
})

app.get("/login", async (req, res) => {

    try {
        const onLogin = await db.collection("login").find({}).toArray();
        res.send(onLogin);


    } catch (err) {
        res.sendStatus(500);
    }
})











app.listen(PORT, () => console.log("Servidor rodando na porta 5000"));