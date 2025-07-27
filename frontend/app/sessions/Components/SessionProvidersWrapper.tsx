import { ChatProvider } from "@/context/chat.context";
import { CodeEditorProvider } from "@/context/codeEditor.context";
import { SocketProvider } from "@/context/socket.context";
import { VideoCallProvider } from "@/context/videoConference.context";
import { WhiteBoardProvider } from "@/context/whiteBoardContex";
import SessionWorkspace from "./SessionWorkspace";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Session } from "@/types/sessionTypes";

interface SessionProvidersWrapperProps {
  sessionCode: string;
  validationRes: { status: true; message: string };
  session: Session;
}

const SessionProvidersWrapper: React.FC<SessionProvidersWrapperProps> = ({
  sessionCode,
  validationRes,
  session,
}: {
  sessionCode: string;
  validationRes: { status: true; message: string };
  session: Session;
}) => {
  const router = useRouter();
  useEffect(() => {
    if (!validationRes?.status) {
      toast.error(validationRes?.message);
      router.push("/dashboard/sessions");
    }
  }, [validationRes]);

  if (!validationRes?.status) return;
  return (
    <SocketProvider>
      <VideoCallProvider roomId={sessionCode as string}>
        <ChatProvider>
          <CodeEditorProvider>
            <WhiteBoardProvider roomId={sessionCode as string}>
              <SessionWorkspace roomId={sessionCode} session={session} />
            </WhiteBoardProvider>
          </CodeEditorProvider>
        </ChatProvider>
      </VideoCallProvider>
    </SocketProvider>
  );
};
export default SessionProvidersWrapper;
