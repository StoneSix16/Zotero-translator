import { config } from "../../package.json";
import { getString } from "./locale";

function reader(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  descriptor.value = function (...args: any) {
    try {
      ztoolkit.log(`Calling readerTab ${target.name}.${String(propertyKey)}`);
      return original.apply(this, args);
    } catch (e) {
      ztoolkit.log(
        `Error in readerTab ${target.name}.${String(propertyKey)}`,
        e
      );
      throw e;
    }
  };
  return descriptor;
}

export class ReaderFactory {
  static async registerReaderInitializer() {
    ztoolkit.ReaderInstance.register(
      "initialized",
      `${config.addonRef}-selection`,
      initializeReaderSelectionEvent
    );
  }
}

export function unregisterReaderInitializer() {
  Zotero.Reader._readers.forEach((r) => {
    unInitializeReaderSelectionEvent(r);
  });
}

async function initializeReaderSelectionEvent(
  instance: _ZoteroTypes.ReaderInstance
) {
  await instance._initPromise;
  await instance._waitForReader();
  if (instance._pdftranslateInitialized) {
    return;
  }
  instance._pdftranslateInitialized = true;
  function selectionCallback(ev: MouseEvent) {
    // Work around to only allow event from iframe#viewer
    const target = ev.target as Element;
    if (!target?.ownerDocument?.querySelector("#viewer")?.contains(target)) {
      return false;
    }
    // Callback when the selected content is not null
    if (!ztoolkit.Reader.getSelectedText(instance)) {
      return false;
    }
    ztoolkit.log(ev);
    //   addon.data.translate.concatKey = ev.altKey;
    addon.hooks.onReaderTextSelection(instance);
  }
  instance._iframeWindow?.addEventListener("pointerup", selectionCallback);
  // instance._pdftranslateSelectionCallback = selectionCallback;
}

async function unInitializeReaderSelectionEvent(
  instance: _ZoteroTypes.ReaderInstance
): Promise<void> {
  await instance._initPromise;
  await instance._waitForReader();
  if (!instance._pdftranslateInitialized) {
    return;
  }
  instance._iframeWindow?.removeEventListener(
    "pointerup",
    instance._pdftranslateSelectionCallback
  );
  instance._pdftranslateInitialized = false;
}
