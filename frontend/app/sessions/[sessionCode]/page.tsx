
// import Session from "../Components/SessionContent";

// import { validateSession } from "@/services/server/session.server"
    
// const page: React.FC<{ params: { sessionCode: string } }>= async({ params }: { params: { sessionCode: string } }) => { 
//     const {result , sessionDetails} = await validateSession(params.sessionCode)
//     console.log(result , sessionDetails)
//     return (
//             <Session sessionCode={params?.sessionCode} validationRes={result}  session={sessionDetails}/>
//     )
// };
// export default page;
import Session from "../Components/SessionContent";
import { validateSession } from "@/services/server/session.server";

type PageProps = {
  params: Promise<{ sessionCode: string }>;
};

export default async function Page({ params }: PageProps) {
  const { sessionCode } = await params;
  const { result, sessionDetails } = await validateSession(sessionCode);
  console.log(result, sessionDetails);
  return (
    <Session
      sessionCode={sessionCode}
      validationRes={result}
      session={sessionDetails}
    />
  );
}

