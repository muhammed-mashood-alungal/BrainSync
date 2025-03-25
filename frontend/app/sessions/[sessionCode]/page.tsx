import { validateSession } from "@/services/server/session.server";
import Session from "./SessionContent";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
    
const page: React.FC<{ params: { sessionCode: string } }>= async({ params }: { params: { sessionCode: string } }) => { 
    const res =await validateSession(params.sessionCode)
   
    // if(!res.status){
    //      redirect('/dashboard/sessions')
    // }
    return (
            <Session sessionCode={params.sessionCode} validationRes={res} />
    );
};
export default page;