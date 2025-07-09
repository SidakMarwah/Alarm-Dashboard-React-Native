import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { connectToDatabase } from "./db";

export interface Alarm {
    id?: number;
    title: string;
    time: string;
    repeat: boolean;
    isActive: boolean;
    u_id?: number;
}

export const addAlarm = async ({ alarm, userId }: { alarm: Alarm, userId: string }): Promise<number> => {
    const db = await connectToDatabase();
    const insertQuery = `
        INSERT INTO Alarms (title, time, repeat, isActive, u_id)
        VALUES (?, ?, ?, ?, ?)
    `;
    // console.log("Adding alarm:", alarm);
    const values = [
        alarm.title,
        alarm.time,
        alarm.repeat,
        alarm.isActive,
        userId
    ];
    // console.log("Insert values:", values);

    try {
        const result = await db.executeSql(insertQuery, values);
        return result[0].insertId;
    } catch (error: any) {
        console.error(error);
        throw Error("Failed to create alarm.");
    }
}

export const fetchAlarms = async (userId: string): Promise<Alarm[]> => {
    const db = await connectToDatabase();

    // Fetch alarms for the user
    const alarmQuery = `
        SELECT * FROM Alarms WHERE u_id = ?
    `;
    const alarmResult = await db.executeSql(alarmQuery, [userId]);
    const alarms: Alarm[] = [];
    for (let i = 0; i < alarmResult[0].rows.length; i++) {
        const row = alarmResult[0].rows.item(i);
        alarms.push({
            id: row.id,
            title: row.title,
            time: row.time,
            repeat: !!row.repeat,
            isActive: !!row.isActive,
            u_id: row.u_id
        });
    }
    return alarms;
}

export const updateAlarmActiveStatus = async (id: number, isActive: boolean): Promise<void> => {
    const db = await connectToDatabase();
    const updateQuery = `
        UPDATE Alarms
        SET isActive = ?
        WHERE id = ?
    `;
    const values = [isActive ? 1 : 0, id];
    try {
        await db.executeSql(updateQuery, values);
    } catch (error: any) {
        console.error(error);
        throw Error("Failed to update alarm status.");
    }
}

export const deleteAlarm = async (id: number): Promise<void> => {
    const db = await connectToDatabase();
    const deleteQuery = `
        DELETE FROM Alarms
        WHERE id = ?
    `;
    try {
        await db.executeSql(deleteQuery, [id]);
    } catch (error: any) {
        console.error(error);
        throw Error("Failed to delete alarm.");
    }
}