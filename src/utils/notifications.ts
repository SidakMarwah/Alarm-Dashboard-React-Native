import notifee, { AndroidImportance, RepeatFrequency, TimestampTrigger, TriggerType } from "@notifee/react-native";
import { Alarm } from "../db/alarms";
import { parseTimeString } from "./dateUtils";

export const scheduleAlarmNotification = async (alarm: Alarm, notificationId: number): Promise<string> => {
    const now = new Date();
    const [hours, minutes] = parseTimeString(alarm.time);

    const alarmDate = new Date(now);
    alarmDate.setHours(hours);
    alarmDate.setMinutes(minutes);
    alarmDate.setSeconds(0);
    alarmDate.setMilliseconds(0);

    if (alarmDate.getTime() <= now.getTime()) {
        alarmDate.setDate(alarmDate.getDate() + 1);
    }

    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: alarmDate.getTime(),
        repeatFrequency: alarm.repeat ? RepeatFrequency.DAILY : undefined,
        alarmManager: true,
    };

    await notifee.createTriggerNotification(
        {
            id: notificationId.toString(),
            title: alarm.title,
            body: alarm.time,
            android: {
                channelId: 'alarm',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                pressAction: { id: 'default' },
            },
        },
        trigger
    );

    return notificationId.toString();
};

export const cancelAlarmNotification = async (notificationId: number) => {
    try {
        await notifee.cancelTriggerNotification(notificationId.toString());
    } catch (error) {
        console.warn('Failed to cancel notification', error);
    }
};