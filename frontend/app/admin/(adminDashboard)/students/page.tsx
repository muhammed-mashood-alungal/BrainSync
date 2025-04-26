import StudentList from "./StudentList";
import { IUserType } from "@/types/userTypes";
import { getAllstudents } from "@/services/server/user.server";

export const dynamic = 'force-dynamic';

const StudentListing: React.FC = async () => {
    const {students , count} = await getAllstudents()
    return (
        <div className="p-6 md:p-8">
            <StudentList initialStudents={students as IUserType[]}  totalCount={count}/>
        </div>
    );
};

export default StudentListing;