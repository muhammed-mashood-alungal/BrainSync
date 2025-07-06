import { notificationInstance } from "@/axios/instance.axios";
import { INotificationTypes } from "@/types/notificationTypes";

export const notificationServices = {
  readAllNotifications: async (): Promise<void> => {
    try {
      const response = await notificationInstance.put("/read-all");
    } catch (error) {
      console.log(error);
    }
  },
  readANotifications: async (notificationId: string): Promise<void> => {
    try {
      const response = await notificationInstance.put(
        `/read-notification/${notificationId}`
      );
    } catch (error) {
      console.log(error);
    }
  },
  getMyNotifications: async (): Promise<INotificationTypes[]> => {
    try {
      const response = await notificationInstance.get("/my-notifications");
      return response.data?.notifications;
    } catch (error) {
      console.log(error);
      throw Error("Something Went Wrong");
    }
  },
};
