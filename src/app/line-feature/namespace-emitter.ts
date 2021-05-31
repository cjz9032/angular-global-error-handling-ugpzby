import mitt, { Emitter } from "mitt";

const rootEmitter = mitt();

export const namespaceEmitter = {
  emit: <T = any>(namespace: string, type: string, event: T) => {
    rootEmitter.emit<T>(namespace + ":" + type, event);
  },
  on: <T = any>(
    type: string,
    handler: (event: T) => void,
    namespace: string
  ) => {
    rootEmitter.on<T>(namespace + ":" + type, handler);
  },
  off: (type: string, handler: (event?: any) => void, namespace: string) => {
    rootEmitter.off(namespace + ":" + type, handler);
  },
};
