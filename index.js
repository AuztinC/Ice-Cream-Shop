const pg = require('pg')
const cors = require('cors')
const client = new pg.Client('postgres://localhost/ice-cream-shop-db')
const express = require('express')
const app = express()

app.use(cors())

app.get('/api/flavors', async(req,res,next)=>{
    try {
        const SQL = `SELECT * FROM flavors;`
        const response = await client.query(SQL)

        if(!response.rows.length) {
            next({
                name: "MissingIDError",
                message: `Flavor with id ${req.params.id} not found`
            })
        }

        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/api/flavors/:id', async(req,res,next)=>{
    try {
        const SQL = `SELECT * FROM flavors WHERE id=$1;`
        const response = await client.query(SQL, [req.params.id])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/flavors/add', async(req, res, next)=>{
    try {
        // console.log("get", req)
        const name = req.query.flavor
        const SQL = `
        RETURNING ('name') INTO flavors;
        `;
        const response = await client.query(SQL)
        // console.log(response)
        res.send(response)
    } catch (error) {
        next(error)
    }
})

app.delete('/api/flavors/:id', async(req,res,next)=>{
    const SQL = `DELETE FROM flavors WHERE id=$1;`
    const response = await client.query(SQL, [req.params.id])
    res.sendStatus(204)
})

const start = async()=>{
    await client.connect()
        const SQL = `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors(
            name VARCHAR(20),
            id SERIAL PRIMARY KEY
        );
        INSERT INTO flavors (name) VALUES ('Chocolate');
        INSERT INTO flavors (name) VALUES ('Strawberry');
        INSERT INTO flavors (name) VALUES ('Vanilla');
        `;
        await client.query(SQL)
        // console.log(response)

    const port = process.env.PORT || 3000;
    app.listen(port, ()=>{
        console.log(`listening on ${port}`)
    })
}
start()