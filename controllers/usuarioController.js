import Usuario from "../models/usuario.js";

export async function getAllUsers(req, res){
    try {
        let allUsers = await Usuario.findAll()

        res.status(200).json(allUsers)

    } catch (error) {
        res.status(204).json({"message": error})
    }
}