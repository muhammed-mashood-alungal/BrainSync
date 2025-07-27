
import { validateSession } from "@/services/server/session.server";
import SessionProvidersWrapper from "../Components/SessionProvidersWrapper";

type PageProps = {
  params: Promise<{ sessionCode: string }>;
};

export default async function Page({ params }: PageProps) {
  const { sessionCode } = await params;
  const { result, sessionDetails } = await validateSession(sessionCode);
  return (
    <SessionProvidersWrapper
      sessionCode={sessionCode}
      validationRes={result}
      session={sessionDetails}
    />
  );
}
