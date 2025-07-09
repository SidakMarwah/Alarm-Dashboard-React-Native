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

export const createTables = async () => {
    const db = await connectToDatabase();

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
            repeat INTEGER DEFAULT 0,
            isActive INTEGER DEFAULT 0,
            u_id INTEGER,
            FOREIGN KEY(u_id) REFERENCES Users(id) ON DELETE CASCADE
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

export const removeTable = async (tableName: Table) => {
    const db = await connectToDatabase();
    const query = `DROP TABLE IF EXISTS ${tableName}`
    try {
        await db.executeSql(query)
    } catch (error) {
        console.error(error)
        throw Error(`Failed to drop table ${tableName}`)
    }
}

export const logAllTablesAndSchema = async (): Promise<void> => {
    try {
        const db = await connectToDatabase();

        // Get all user-defined tables
        const tableQuery = `
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `;
        const tableResult = await db.executeSql(tableQuery);
        const tables: string[] = [];

        const rows = tableResult[0].rows;
        for (let i = 0; i < rows.length; i++) {
            tables.push(rows.item(i).name);
        }

        // Loop through each table
        for (const tableName of tables) {
            console.log(`\n📋 TABLE: ${tableName}`);
            console.log('📑 STRUCTURE:');

            // Fetch column definitions
            const schemaResult = await db.executeSql(`PRAGMA table_info(${tableName})`);
            const schemaRows = schemaResult[0].rows;

            for (let i = 0; i < schemaRows.length; i++) {
                const col = schemaRows.item(i);
                console.log(
                    `   • ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`
                );
            }

            // Fetch and log table data
            console.log('📦 DATA:');
            const dataResult = await db.executeSql(`SELECT * FROM ${tableName}`);
            const dataRows = dataResult[0].rows;

            if (dataRows.length === 0) {
                console.log('   (empty)');
            } else {
                for (let i = 0; i < dataRows.length; i++) {
                    console.log(`   Row ${i + 1}:`, dataRows.item(i));
                }
            }
            console.log('--------------------------------');
        }
    } catch (error) {
        console.error('❌ Error logging table schemas and data:', error);
    }
};
