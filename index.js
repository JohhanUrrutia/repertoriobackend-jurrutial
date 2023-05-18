import { readFile, writeFile } from "node:fs/promises";
import express from "express";
import cors from "cors";

import path from "node:path";

const ruta = path.join(process.cwd(), "/public/index.html");

const app = express();
app.use(cors());
app.use(express.static('static'));

app.use(express.json());

// PETICION POST DE CANCIONES
app.post("/canciones", async(req, res) => {

    const cancion = req.body;
    // FUNCIÓN PARA REGISTRAR UNA CANCION
        try {
            // LEE EL ARCHIVO Y TRANSFORMA A UN ARRAY DE OBJETOS QUE ENTIENDE JAVASCRIPT
            const repertorio = JSON.parse(await readFile("repertorio.json"));
            // EMPUJA EL OBJETO AL ARREGLO
            repertorio.push(cancion)
            // SOBREESCRIBE EL ARCHIVO ORIGINAL CON EL ARRAY DE OBJETOS Y ADEMÁS LO TRANSFORMA A STRING
            await writeFile("repertorio.json", JSON.stringify(repertorio, null, 2));
            res.json(repertorio)
        } catch (error) {
            console.log(error)
        }
})

// DEVUELVE UN JSON CON LAS CANCIONES REGISTRADAS EN EL REPERTORIO
// PETICION GET
app.get("/", (req, res) => {
    res.sendFile(ruta)
});

app.get("/canciones", async(req, res) => {
        try {
            // LEE EL ARCHIVO Y TRANSFORMA A UN ARRAY DE OBJETOS QUE ENTIENDE JAVASCRIPT
            const repertorio = JSON.parse(await readFile("repertorio.json"));
            res.json(repertorio)
        } catch (error) {
            console.log(error)
        }
});

// PETICION PUT : RECIBE LOS DATOS DE UNA CANCION QUE SE DESEA EDITAR Y LA ACTUALIZA MANIPULANDO EL JSON LOCAL

app.put("/canciones/:id", async(req, res) => {
    const {id} = req.params;
    const {titulo, artista, tono} = req.body;

    try {
        // LEE EL ARCHIVO Y TRANSFORMA A UN ARRAY DE OBJETOS QUE ENTIENDE JAVASCRIPT
        const repertorio = JSON.parse(await readFile("repertorio.json"));
        const newRepertorio = repertorio.map((item) => {
            if(!titulo || !artista || !tono){
                res.json("Favor ingresa todos los valores para actualizar");
            }else if(item.id === parseInt(id)){
                item.titulo = titulo
                item.artista = artista
                item.tono = tono
            }
            return item
        })
        // SOBREESCRIBE EL ARCHIVO ORIGINAL CON EL ARRAY DE OBJETOS Y ADEMÁS LO TRANSFORMA A STRING
        await writeFile("repertorio.json", JSON.stringify(newRepertorio, null, 2));
        res.json(newRepertorio)
    } catch (error) {
        console.log(error)
    }
    
})

// PETICION DELETE: RECIBE POR QUERYSTRING EL ID DE LA CANCION Y LA ELIMINA DEL REPERTORIO
app.delete("/canciones/:id", async(req, res) => {
    const {id} = req.params;
    try {
        // LEE EL ARCHIVO Y TRANSFORMA A UN ARRAY DE OBJETOS QUE ENTIENDE JAVASCRIPT
        const repertorio = JSON.parse(await readFile("repertorio.json"));
        const newRepertorio = repertorio.filter((item) => item.id !== parseInt(id))
        // SOBREESCRIBE EL ARCHIVO ORIGINAL CON EL ARRAY DE OBJETOS Y ADEMÁS LO TRANSFORMA A STRING
        await writeFile("repertorio.json", JSON.stringify(newRepertorio, null, 2));
        res.json(newRepertorio)
    } catch (error) {
        console.log(error)
    }

})

// Variable de entorno y en el caso contrario usar PORT 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server en puerto: http://localhost:${PORT}`);
});