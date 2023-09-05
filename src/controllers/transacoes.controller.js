import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function postTransacaoTipo(req, res){

    const tipo = req.params.tipo;
    const { valor, descricao } = req.body;
    const data = dayjs().format('DD/MM');
    const usuario = res.locals.usuario;

    try {
        const newobj = { valor: Number(valor).toFixed(2), descricao, data, tipo, idUsuario: usuario }
        await db.collection("transacoes").insertOne(newobj);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getTransacaoTipo(req, res) {
    const { tipo } = req.params;
    const idUsuario = req.query.idUsuario;
    try {
        const transacoes = await db.collection("transacoes").find({ tipo: tipo, idUsuario: idUsuario }).toArray();
        res.send(transacoes);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getTransacao(req, res){
    const usuario = res.locals.usuario;
    try {
        const transacoes = await db.collection("transacoes").find({idUsuario: usuario}).toArray();
        console.log(transacoes);
        res.send(transacoes);
    } catch (err) {
        res.status(500).send(err.message);

    }

}

