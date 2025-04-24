
import Session from "../Components/SessionContent";

import { getMySessions, validateSession } from "@/services/server/session.server"
    
const page: React.FC<{ params: { sessionCode: string } }>= async({ params }: { params: { sessionCode: string } }) => { 
    const {result , sessionDetails} = await validateSession(params.sessionCode)
    console.log(result , sessionDetails)
    return (
            <Session sessionCode={params?.sessionCode} validationRes={result}  session={sessionDetails}/>
    )
};
export default page;
