const db = require('./pool');

const getUserById = async (userId) => {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    return rows[0]
}
const getUserByUserName = async (username) => {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0]
}
const createUser = async (userData) => {
    await db.query(`INSERT INTO users (firstname,lastname,username,email,password) VALUES ($1,$2,$3,$4,$5)`, Object.values(userData));
}

const getAllPosts = async () => {
    const { rows } = await db.query('SELECT * FROM posts');
    return rows
}

const createPost = async (postData) => {
    await db.query(`INSERT INTO posts (created_at,content,author_name,author_id) VALUES ($1,$2,$3,$4)`, Object.values(postData));
}

const upgradeUser = async (id, role) => {
    await db.query(`UPDATE users SET role = $2 WHERE id = $1`, [id, role])
}

const deletePostById = async (id) => {
    await db.query(`DELETE FROM posts WHERE post_id = $1`, [id])
}

module.exports = {
    getUserById, getUserByUserName, createUser, getAllPosts, createPost, upgradeUser, deletePostById
}