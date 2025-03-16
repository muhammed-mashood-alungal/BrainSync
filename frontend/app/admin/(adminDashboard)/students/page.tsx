import { AdminServices } from "@/services/client/admin.client";
import StudentList, { User } from "./StudentList";
import { IUserType } from "@/types/userTypes";
import { getAllstudents } from "@/services/server/user.server";



const StudentListing: React.FC = async () => {
    const students: unknown = await getAllstudents()
    console.log(students)
    return (
        <div className="p-6 md:p-8">
            <StudentList initialStudents={students as User[]} />
        </div>
    );
};

export default StudentListing;