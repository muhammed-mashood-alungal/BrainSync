// // utils/googleCalendar.ts
// import { google } from "googleapis";
// import { GoogleAuth } from "google-auth-library";
// import { env } from "../configs/env.config";

// //const SERVICE_ACCOUNT_KEY_PATH = "src/configs/service-account-key.json"
// const SHARED_CALENDAR_ID = env.SHARED_CALENDAR_ID

// const auth = new GoogleAuth({
//     keyFile: SERVICE_ACCOUNT_KEY_PATH,
//     scopes: ["https://www.googleapis.com/auth/calendar"],
    
// });


// const calendar = google.calendar({ version: "v3", auth });


// export async function createGroupSessionServiceAccount(
//     sessionDetails: {
//         sessionName: string;
//         startTime: Date;
//         endTime: Date;
//     },
//     attendeeEmails: string[]
// ) {
//     const event = {
//         summary: sessionDetails.sessionName,
//         start: { dateTime: sessionDetails.startTime.toISOString() },
//         end: { dateTime: sessionDetails.endTime.toISOString() },
//         attendees: attendeeEmails.map(email => ({ email })),
//         reminders: {
//             useDefault: true,
//         },
//     };

//     try {
//         const response = await calendar.events.insert({
//             calendarId: SHARED_CALENDAR_ID,
//             requestBody: event,
//             sendUpdates: "all",
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error(`Failed to create session: ${error}`);
//     }
// }