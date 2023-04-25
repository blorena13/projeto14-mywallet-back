import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function postTransacaoTipo(req, res){

    const tipo = req.params.tipo;
    const { valor, descricao } = req.body;
    const data = dayjs().format('DD/MM');

    try {

        const usuario = res.locals.usuario;
        const newobj = { valor: Number(valor).toFixed(2), descricao, data, tipo, idUsuario: usuario.idUsuario }
        await db.collection("transacoes").insertOne(newobj);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getTransacaoTipo(req, res) {

    const { tipo } = req.params;
   
    try {
        const usuario = res.locals.usuario;
        const transacoes = await db.collection("transacoes").find({ tipo: tipo, idUsuario: usuario.idUsuario }).toArray();
        res.send(transacoes);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getTransacao(req, res){

    try {

        const usuario = res.locals.usuario;

        const transacoes = await db.collection("transacoes").find({idUsuario: usuario.idUsuario}).toArray();
        res.send(transacoes);
    } catch (err) {
        res.status(500).send(err.message);

    }

}

//refatorado