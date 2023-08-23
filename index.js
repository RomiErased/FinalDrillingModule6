const express = require("express");
const fs = require("fs");

const app = express();

const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
    fs.readFile("anime.json", "utf8", (error, data) => {
        if (error) {
            return res.status(404).send("Animés no encontrados");
        } else {
            return res.json(JSON.parse(data));
        }
    })
});

// Ruta para obtener los datos de un anime por su id (GET)
app.get("/:id", (req, res) => {
    const id = req.params.id;
    fs.readFile("anime.json", "utf8", (error, data) => {
        if (error) {
            return res.status(404).send("animés no encontrados");
        } else {
            const listadoAnimes = JSON.parse(data);
            let anime;
            for (let index = 0; index < listadoAnimes.length; index++) {
                const element = listadoAnimes[index];
                if (element.id == id) {
                    anime = element;
                    break;
                }
            }
            if (anime == undefined) {
                return res.status(404).send("animé no encontrado");
            }
            return res.json(anime);
        }
    });
});

// Ruta para obtener los datos de un anime específico por su nombre (GET)
app.get("/nombre/:name", (req, res) => {
    const nombre = req.params.name;
    fs.readFile("anime.json", "utf8", (error, data) => {
        if (error) {
            return res.status(404).send("Animés no encontrados");
        } else {
            const listadoAnimes = JSON.parse(data);
            const anime = listadoAnimes.find((anime) => {
                return anime.nombre.toLowerCase() === nombre.toLowerCase();
            });

            if (anime) {
                return res.json(anime);
            } else {
                return res.status(404).send("Animés no encontrados");
            }
        }
    });
});

//Ruta para agregar un nuevo anime (POST)
app.post("/", (req, res) => {
    const anime = req.body;
    fs.readFile("anime.json", "utf8", (error, data) => {
        if (error) {
            return res.status(404).send("animés no encontrados");
        } else {
            const listadoAnimes = JSON.parse(data);
            let numeroId = 0;
            listadoAnimes.forEach((anime) => {
                const idActual = parseInt(anime.id);
                if (idActual > numeroId) numeroId = idActual;
            });
            const nuevoId = numeroId + 1;

            anime.id = nuevoId.toString();
            listadoAnimes.push(anime);

            fs.writeFile(
                "anime.json",
                JSON.stringify(listadoAnimes),
                "utf8",
                (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Error en el Servidor");
                    } else {
                        return res.send("Anime Agreagdo Correctamente");
                    }
                }
            );
        }
    });
});

// Ruta para actualizar un anime por su ID (PUT)
app.put("/:id", (req, res) => {
    const id = req.params.id;
    fs.readFile("anime.json", "utf8", (error, data) => {
        if (error) {
            return res.status(404).send("Animés no encontrados");
        } else {
            const listadoAnimes = JSON.parse(data);
            let animeEditado = false;

            for (let index = 0; index < listadoAnimes.length; index++) {
                const element = listadoAnimes[index];
                if (element.id == id) {

                    if (req.body.nombre) {
                        element.nombre = req.body.nombre
                        animeEditado = true
                    }

                    if (req.body['año']) {
                        element['año'] = req.body['año']
                        animeEditado = true
                    }

                    if (req.body.autor) {
                        element.autor = req.body.autor
                        animeEditado = true
                    }

                    if (req.body.genero) {
                        element.genero = req.body.genero
                        animeEditado = true
                    }
                }
            }

            if (animeEditado) {
                fs.writeFile(
                    "anime.json",
                    JSON.stringify(listadoAnimes),
                    "utf8",
                    (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(404).send("Error en el Servidor");
                        } else {
                            return res.send("Anime Editado correctamente");
                        }
                    }
                );
            } else {
                return res.status(404).send("No se ha editado ningun anime");
            }
        }
    });
});

// Ruta para Eliminar un anime (DELETE)
app.delete("/:id", (req, res) => {
    const id = req.params.id;
    fs.readFile("anime.json", "utf8", (error, data) => {
        if (error) {
            return res.status(404).send("Animés no encontrados");
        } else {
            const listadoAnimes = JSON.parse(data);
            const listadoNuevosAnimes = [];
            for (let index = 0; index < listadoAnimes.length; index++) {
                const element = listadoAnimes[index];
                if (element.id != id) {
                    listadoNuevosAnimes.push(element);
                }
            }
            const eliminacionExitosa =
                listadoAnimes.length != listadoNuevosAnimes.length;

            // const eliminacionExitosa = !(listadoAnimes.length == listadoNuevosAnimes.length);
            // const eliminacionFallida = listadoAnimes.length == listadoNuevosAnimes.length;
            if (eliminacionExitosa) {
                fs.writeFile(
                    "anime.json",
                    JSON.stringify(listadoNuevosAnimes),
                    "utf8",
                    (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(404).send("Error en el Servidor");
                        } else {
                            return res.send("Anime Eliminado correctamente");
                        }
                    }
                );
            } else {
                return res.status(404).send("No se ha eliminado ningun anime");
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

module.exports = { app }; 