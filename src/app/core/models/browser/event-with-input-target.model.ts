export interface EventWithInputTarget extends Event {
  target: HTMLInputElement & EventTarget;
}
