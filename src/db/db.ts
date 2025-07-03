import {
    enablePromise,
    openDatabase,
} from "react-native-sqlite-storage"
import { SQLiteDatabase } from 'react-native-sqlite-storage';

type Table = 'users' | 'alarms';


// Enable promise for SQLite
enablePromise(true)

export const connectToDatabase = async () => {
    return openDatabase(
        { name: "AlarmDashboard.db", location: "default" },
        () => { },
        (error: any) => {
            console.error(error)
            throw Error("Could not connect to database")
        }
    )
}

export const createTables = async (db: SQLiteDatabase) => {
    const usersQuery = `
      CREATE TABLE IF NOT EXISTS Users (
          id INTEGER DEFAULT 1,
          name TEXT,
          email TEXT UNIQUE,
          password TEXT,
          PRIMARY KEY(id)
      )
    `
    const alarmsQuery = `
     CREATE TABLE IF NOT EXISTS Alarms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        time TEXT,
        repeat TEXT,
        isActive INTEGER DEFAULT 0
     )
    `
    try {
        await db.executeSql(usersQuery)
        await db.executeSql(alarmsQuery)
    } catch (error) {
        console.error(error)
        throw Error(`Failed to create tables`)
    }
}

export const removeTable = async (db: SQLiteDatabase, tableName: Table) => {
    const query = `DROP TABLE IF EXISTS ${tableName}`
    try {
        await db.executeSql(query)
    } catch (error) {
        console.error(error)
        throw Error(`Failed to drop table ${tableName}`)
    }
}