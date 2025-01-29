import clientPromise from "@/lib/mongodb";

export default async function manageUser(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("proyecto_educa");
        const collect = db.collection("authorized_user");

        if (req.method === "GET") {
            try {
                const users = await collect.find().toArray();
                return res.status(200).json({ users });
            } catch (error) {
                return res.status(500).json({ error: "Error al traer los usuarios" });
            }
        }

        if (req.method === "POST") {
            try {
                const { email, role } = req.body;
                if (!email || !role) return res.status(400).json({ error: "Falta información en la petición" });

                const userExist = await collect.findOne({ email });
                if (userExist) return res.status(402).json({ error: "El usuario ya está autorizado" });

                const user = { email, role };
                await collect.insertOne(user);
                return res.status(200).json({ message: "Usuario autorizado" });
            } catch (error) {
                return res.status(500).json({ error: "Error al guardar el usuario" });
            }
        }

        if (req.method === "PUT") {
            try {
                const { email, role } = req.body;
                if (!email || !role) return res.status(400).json({ error: "Falta información en la petición" });

                const edit = await collect.updateOne({ email }, { $set: { role:role } });
                if (edit.matchedCount === 0) return res.status(402).json({ error: "No se encontró al usuario" });

                return res.status(200).json({ message: "Usuario editado" });
            } catch (error) {
                return res.status(500).json({ error: "Error al editar el usuario" });
            }
        }

        if (req.method === "DELETE") {
            try {
                const { email } = req.query;
                if (!email) return res.status(400).json({ error: "Falta información en la petición" });

                const delet = await collect.deleteOne({ email });
                if (delet.deletedCount) return res.status(200).json({ message: "Usuario eliminado" });
                return res.status(402).json({ error: "Usuario no encontrado" });
            } catch (error) {
                return res.status(500).json({ error: "Error al borrar el usuario" });
            }
        }

        return res.status(405).json({ error: "Método no permitido" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
