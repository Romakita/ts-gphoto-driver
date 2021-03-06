import {Closeable, getGPhoto2Driver, PointerContext} from "@tsed/gphoto2-core";
import {addInstance, removeInstance} from "./Garbage";

export class Context implements Closeable {
  /**
   *
   */
  private static instance: Context;
  /**
   *
   * @type {PointerContext}
   */
  readonly pointer: PointerContext = getGPhoto2Driver().gp_context_new();

  constructor() {
    addInstance(this);
  }

  static get() {
    if (!Context.instance) {
      Context.instance = new Context();
    }

    return Context.instance;
  }

  public close(): this {
    getGPhoto2Driver().gp_context_unref(this.pointer);
    removeInstance(this);

    return this;
  }
}
