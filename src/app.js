import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import Joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 5000;

let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

app.post("/cadastro", async (req, res) => {

    const { nome, email, senha } = req.body;

    const cadastroSchema = Joi.object({
        nome: Joi.required(),
        email: Joi.string().email().required(),
        senha: Joi.string().min(3).required(),
    })

    const validation = cadastroSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(422).send(errors);
    }

    try {
        // verifica se o email foi cadastrado ou não
        const usuario = await db.collection("cadastrados").findOne({ email });
        if (usuario) return res.status(409).send("E-mail já cadastrado");

        // criptografa a senha
        const hash = bcrypt.hashSync(senha, 10);

        await db.collection("cadastrados").insertOne({ nome, email, senha: hash });
        res.sendStatus(201)
        // esta funcionando

    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;


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

        const usuario = await db.collection("cadastrados").findOne({ email });
        if (!usuario) {
            return res.status(404).send("O usuário não foi cadastrado!");
        }
        const senhaCorreta = bcrypt.compareSync(senha, usuario.senha)
        if (!senhaCorreta) {
            return res.status(401).send("Senha incorreta");
        }

        const token = uuid();
        await db.collection("login").insertOne({ token, idUsuario: usuario._id });
        res.status(200).send(token);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.post("/nova-transacao/:tipo", async (req, res) => {
    const tipo = req.params.tipo;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "")
    const { valor, descricao } = req.body;
    const data = dayjs().format('DD/MM');

    if (!token) return res.sendStatus(401);

    const transacaoSchema = Joi.object({
        valor: Joi.number().positive().required(),
        descricao: Joi.required(),
        tipo: Joi.string().valid("entrada", "saida"),
    })

    const validation = transacaoSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(422).send(errors);
    }


    try {

        const usuario = await db.collection("login").findOne({ token })
        if (!usuario) return res.sendStatus(401);

        const newobj = { valor: Number(valor).toFixed(2), descricao, data, tipo, idUsuario: usuario.idUsuario }

        await db.collection("transacoes").insertOne(newobj);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.get("/nova-transacao/:tipo", async (req, res) => {
    const { tipo } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");


    if (!token) return res.sendStatus(401);


    try {

        const usuario = await db.collection("login").findOne({ token });
        if (!usuario) return res.sendStatus(401);

        const transacoes = await db.collection("transacoes").find({ tipo: tipo, idUsuario: usuario.idUsuario }).toArray();
        res.send(transacoes);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.get("/nova-transacao", async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) res.sendStatus(401);

    try {
        const usuario = await db.collection("login").findOne({ token });
        if (!usuario) return res.sendStatus(401);

        const transacoes = await db.collection("transacoes").find({idUsuario: usuario.idUsuario}).toArray();
        res.send(transacoes);
    } catch (err) {
        res.status(500).send(err.message);

    }
})











app.listen(PORT, () => {console.log(`Servidor rodando na porta ${PORT}`)});