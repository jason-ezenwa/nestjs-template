import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventName, EventPayloadMap } from './types';

@Injectable()
export class EventEmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  emitEvent<K extends EventName>(
    eventName: K,
    payload: EventPayloadMap[K],
  ): void {
    this.eventEmitter.emit(eventName, payload);
  }

  onEvent<K extends EventName>(
    eventName: K,
    callback: (payload: EventPayloadMap[K]) => void | Promise<void>,
  ): void {
    this.eventEmitter.on(eventName, callback);
  }
}
