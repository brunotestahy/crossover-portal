import {
  EventTargetWithStringResult,
} from 'app/core/models/browser/event-target-with-string-result.model';

export interface EventWithStringResult extends Event {
  target: EventTargetWithStringResult;
}
