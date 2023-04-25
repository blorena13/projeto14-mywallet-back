import { db } from "../database/database.connection.js";

export async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {

        const usuario = await db.collection("login").findOne({ token })
        if (!usuario) return res.sendStatus(401);

        res.locals.usuario = usuario;
        next();

    } catch(err){
        res.status(500).send(err.message);
    }

}