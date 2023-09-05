import bcrypt from "bcrypt";
import { db } from "../database/database.connection.js";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
    const { nome, email, senha } = req.body;
    try {
        const usuario = await db.collection("cadastrados").findOne({ email });
        if (usuario) return res.status(409).send("E-mail já cadastrado");

       
        const hash = bcrypt.hashSync(senha, 10);

        await db.collection("cadastrados").insertOne({ nome, email, senha: hash });
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function signIn(req, res){
    const { email, senha } = req.body;
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
        const obj = {token, nome: usuario.nome, idUsuario: usuario._id}
        await db.collection("login").insertOne(obj);
        res.status(200).send(obj);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
