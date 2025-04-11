import { Unsubscribe } from 'firebase/database';
import { CanvasData } from '../../types/whiteboard.types';

export interface IWhiteboardRepository {
  saveWhiteboard(roomId: string, whiteboardData: CanvasData): Promise<void>;
  getWhiteboard(roomId: string): Promise<CanvasData | null>;
  listenToBoardChanges(
    roomId: string,
    callback: (data: CanvasData | null) => void
  ): Unsubscribe;
}
