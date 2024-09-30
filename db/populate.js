require('dotenv').config();

const { Client } = require('pg');

const SQL = `
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,username TEXT,email TEXT,firstname TEXT,lastname TEXT,password TEXT);
CREATE TABLE IF NOT EXISTS posts (post_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,created_at bigInt,author_name TEXT,content TEXT , author_id INTEGER,FOREIGN KEY (author_id) REFERENCES users(id));
INSERT INTO posts (created_at,author_name,content, author_id) VALUES (1727713696798,'DragonBo1','Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, magnam rem. Dicta placeat earum optio dignissimos quaerat, quasi magni rem illo, consectetur eos nostrum? Dolor cumque eius veritatis cum possimus?',1)
`

const start = async () => {
    const client = new Client({
        connectionString: 'postgresql://escanor:roger123@localhost:5432/members_only'
    });

    await client.connect();
    await client.query(SQL);
    await client.end();
}

start();