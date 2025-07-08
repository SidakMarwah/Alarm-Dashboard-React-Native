import { connectToDatabase } from './db';

interface User {
    id?: number; // Optional for new users
    name?: string; // Optional for users who are trying to log in
    email: string;
    password: string;
}

export const addUser = async (user: User) => {
    const db = await connectToDatabase();

    const insertQuery = `
     INSERT INTO Users (name, email, password)
     VALUES (?, ?, ?)
   `
    const values = [
        user.name,
        user.email,
        user.password,
    ]
    try {
        return db.executeSql(insertQuery, values)
    } catch (error) {
        console.error(error)
        throw Error("Failed to add user")
    }
}

export const findUserByEmailAndPassword = async (userData: User) => {
    const db = await connectToDatabase();

    const query = `
     SELECT * FROM Users
     WHERE email = ? AND password = ?
   `
    const values = [userData.email, userData.password]
    try {
        const results = await db.executeSql(query, values)
        if (results[0].rows.length > 0) {
            return results[0].rows.item(0) // Return the first user found
        }
        return null // No user found
    } catch (error) {
        console.error(error)
        throw Error("Failed to find user")
    }
}