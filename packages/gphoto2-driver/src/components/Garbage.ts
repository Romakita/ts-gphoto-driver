import type {Closeable} from "@tsed/gphoto2-core";
import {$log} from "@tsed/logger";

const garbage = new Map<Closeable, Closeable>();

export function addInstance(item: Closeable): void {
  garbage.set(item, item);
}

export function removeInstance(item: Closeable): void {
  if (garbage.has(item)) {
    garbage.delete(item);
  }
}

export function closeAll() {
  if (garbage.size) {
    $log.debug("Close", garbage.size, "unclosed references");
    garbage.forEach((item: Closeable) => {
      try {
        item.close();
      } catch (er) {}
    });
  }
}

// do something when app is closing
process.on("exit", closeAll);

// catches ctrl+c event
process.on("SIGINT", closeAll);

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", closeAll);
process.on("SIGUSR2", closeAll);
process.on("SIGSEGV", closeAll);
