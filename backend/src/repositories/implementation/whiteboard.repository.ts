import { firebaseDB } from '../../configs/firebase.config';
import { CanvasData } from '../../types/whiteboard.types';
import { IWhiteboardRepository } from '../interface/IWhiteboardRepository';
import { set, ref, get, onValue, Unsubscribe } from 'firebase/database';

export class WhiteboardRepository implements IWhiteboardRepository {
  async saveWhiteboard(
    roomId: string,
    whiteboardData: CanvasData
  ): Promise<void> {
    const whiteboardRef = ref(
      firebaseDB,
      `whiteboards/${roomId}/${whiteboardData.slideIndex}`
    );
    await set(whiteboardRef, whiteboardData.canvasData);
  }
  async getWhiteboard(roomId: string): Promise<CanvasData | null> {
    const whiteboardRef = ref(firebaseDB, `whiteboards/${roomId}`);
    const snapshot = await get(whiteboardRef);
    return snapshot.val();
  }

  listenToBoardChanges(
    roomId: string,
    callback: (data: CanvasData | null) => void
  ): Unsubscribe {
    const whiteboardRef = ref(firebaseDB, `whiteboards/${roomId}`);
    const unsubscribe = onValue(whiteboardRef, (snapshot: any) => {
      callback(snapshot.val());
    });
    return unsubscribe;
  }
}
