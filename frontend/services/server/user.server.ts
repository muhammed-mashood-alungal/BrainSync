import { cookies } from "next/headers";
import { IGroupType } from "@/types/groupTypes";
import { adminInstance, groupInstance } from "@/axios/instance.axios";
import { IUserType } from "@/types/userTypes";

export const dynamic = "force-dynamic";

export async function getAllstudents(): Promise<{
  students: IUserType[];
  count: number;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const cookieString = [
      accessToken ? `accessToken=${accessToken}` : "",
      refreshToken ? `refreshToken=${refreshToken}` : "",
    ]
      .filter(Boolean)
      .join("; ");

    const response = await adminInstance.get("/all-students", {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        Cookie: cookieString,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw new Error("Loading all groups failed. Please try again.");
  }
}
