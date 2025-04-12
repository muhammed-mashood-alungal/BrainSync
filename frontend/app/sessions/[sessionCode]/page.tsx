
import Session from "../Components/SessionContent";

import { getMySessions, validateSession } from "@/services/server/session.server"
    
const page: React.FC<{ params: { sessionCode: string } }>= async({ params }: { params: { sessionCode: string } }) => { 
    const res = await validateSession(params.sessionCode)
 
    const session = await getMySessions()
    return (
            <Session sessionCode={params?.sessionCode} validationRes={res}  session={session}/>
    )
};
export default page;
