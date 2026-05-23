import type { Server as HttpServer } from 'http';
import { Server, type Socket } from 'socket.io';
import { z } from 'zod';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import {
  GENERATION_EVENTS,
  type GenerationEventName,
  type GenerationEventPayload,
  type GenerationStatus,
} from '../../types/websocket.types';
import type { PublishedGenerationEvent } from './generation.publisher';
import {
  cacheGenerationState,
  resolveReplayGenerationState,
  toSubscribeAck,
  type SubscribeAckPayload,
} from './generationState.cache';

const subscribeSchema = z.object({
  assignmentId: z.string().min(1),
});

const CLIENT_EVENTS = {
  SUBSCRIBE: 'subscribe:assignment',
  UNSUBSCRIBE: 'unsubscribe:assignment',
} as const;

export const getAssignmentRoom = (assignmentId: string): string =>
  `assignment:${assignmentId}`;

class SocketService {
  private io: Server | null = null;

  initialize(httpServer: HttpServer): void {
    if (this.io) {
      return;
    }

    this.io = new Server(httpServer, {
      cors: {
        origin: env.CLIENT_URL,
        credentials: true,
      },
    });

    this.io.on('connection', (socket: Socket) => {
      this.registerAssignmentHandlers(socket);
      logger.debug({ socketId: socket.id }, 'WebSocket client connected');
    });

    logger.info('Socket.IO server initialized');
  }

  private registerAssignmentHandlers(socket: Socket): void {
    socket.on(
      CLIENT_EVENTS.SUBSCRIBE,
      async (payload: unknown, callback?: (ack: SubscribeAckPayload) => void) => {
        const parsed = subscribeSchema.safeParse(payload);
        if (!parsed.success) {
          logger.warn(
            { socketId: socket.id, errors: parsed.error.flatten() },
            'Invalid subscribe:assignment payload',
          );
          return;
        }

        const { assignmentId } = parsed.data;
        const room = getAssignmentRoom(assignmentId);
        await socket.join(room);

        const replay = await resolveReplayGenerationState(assignmentId);
        if (replay) {
          socket.emit(replay.event, replay.payload);
          logger.debug(
            {
              socketId: socket.id,
              assignmentId,
              event: replay.event,
              progress: replay.payload.progress,
            },
            'Replayed generation state to subscriber',
          );
        }

        callback?.(
          replay
            ? toSubscribeAck(replay, true)
            : {
                assignmentId,
                status: 'generating',
                progress: 0,
                message: 'Waiting for generation to start…',
                replayed: false,
              },
        );

        logger.debug(
          { socketId: socket.id, assignmentId, room },
          'Client subscribed to assignment room',
        );
      },
    );

    socket.on(CLIENT_EVENTS.UNSUBSCRIBE, (payload: unknown) => {
      const parsed = subscribeSchema.safeParse(payload);
      if (!parsed.success) {
        return;
      }

      const room = getAssignmentRoom(parsed.data.assignmentId);
      void socket.leave(room);
      logger.debug(
        { socketId: socket.id, assignmentId: parsed.data.assignmentId, room },
        'Client unsubscribed from assignment room',
      );
    });

    socket.on('disconnect', () => {
      logger.debug({ socketId: socket.id }, 'WebSocket client disconnected');
    });
  }

  private emitToAssignment(
    assignmentId: string,
    event: GenerationEventName,
    payload: GenerationEventPayload,
  ): void {
    if (!this.io) {
      logger.warn({ event, assignmentId }, 'Socket.IO not initialized');
      return;
    }

    const room = getAssignmentRoom(assignmentId);
    this.io.to(room).emit(event, payload);
    logger.debug({ event, assignmentId, room }, 'WebSocket event emitted');
  }

  emitGenerationStarted(
    assignmentId: string,
    message: string = 'Generation started',
  ): void {
    this.emitGenerationEvent(
      assignmentId,
      GENERATION_EVENTS.STARTED,
      'generating',
      0,
      message,
    );
  }

  emitGenerationProgress(
    assignmentId: string,
    progress: number,
    message: string,
  ): void {
    this.emitGenerationEvent(
      assignmentId,
      GENERATION_EVENTS.PROGRESS,
      'generating',
      progress,
      message,
    );
  }

  emitGenerationCompleted(
    assignmentId: string,
    message: string = 'Generation completed',
  ): void {
    this.emitGenerationEvent(
      assignmentId,
      GENERATION_EVENTS.COMPLETED,
      'completed',
      100,
      message,
    );
  }

  emitGenerationFailed(
    assignmentId: string,
    message: string = 'Generation failed',
  ): void {
    this.emitGenerationEvent(
      assignmentId,
      GENERATION_EVENTS.FAILED,
      'failed',
      0,
      message,
    );
  }

  dispatchGenerationEvent(published: PublishedGenerationEvent): void {
    void cacheGenerationState(published);
    this.emitToAssignment(
      published.payload.assignmentId,
      published.event,
      published.payload,
    );
  }

  private emitGenerationEvent(
    assignmentId: string,
    event: GenerationEventName,
    status: GenerationStatus,
    progress: number,
    message: string,
  ): void {
    const payload: GenerationEventPayload = {
      assignmentId,
      status,
      progress,
      message,
    };

    this.emitToAssignment(assignmentId, event, payload);
  }

  async close(): Promise<void> {
    if (!this.io) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      this.io?.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    this.io = null;
    logger.info('Socket.IO server closed');
  }
}

export const socketService = new SocketService();
