import { config } from "../../package.json";
import { getString } from "./locale";

export class ReaderTabPenelFactory {
  static async registerReaderTabPanel() {
    const tabId = await ztoolkit.ReaderTabPanel.register(
      getString("tabpanel.reader.tab.label"),
      (
        panel: XUL.TabPanel | undefined,
        deck: XUL.Deck,
        win: Window,
        reader: _ZoteroTypes.ReaderInstance
      ) => {
        if (!panel) {
          ztoolkit.log(
            "This reader do not have right-side bar. Adding reader tab skipped."
          );
          return;
        }
        const elem = ztoolkit.UI.createElement(win.document, "vbox", {
          id: `${config.addonRef}-${reader._instanceID}-extra-reader-tab-div`,
          // This is important! Don't create content for multiple times
          // ignoreIfExists: true,
          removeIfExists: true,
          children: [
            {
              tag: "h2",
              properties: {
                innerText: "A Translator Tab Test",
              },
            },
            {
              tag: "textbox",
              properties: {
                placeholder: "输入文本",
              },
              attributes: {
                rows: 3,
              },
            },
            {
              tag: "div",
              id: `${config.addonRef}-${reader._instanceID}-extra-reader-tab-div-translate`,
              children: [
                {
                  tag: "div",
                  properties: {
                    innerText: "芝士翻译",
                  },
                },
                {
                  tag: "div",
                  properties: {
                    innerText: "芝士翻译结果",
                  },
                },
              ],
            },
            {
              tag: "div",
              properties: {
                innerText: `itemID: ${reader.itemID}.`,
              },
            },
            {
              tag: "button",
              namespace: "html",
              properties: {
                innerText: "Unregister",
              },
              listeners: [
                {
                  type: "click",
                  listener: () => {
                    ztoolkit.ReaderTabPanel.unregister(tabId);
                  },
                },
              ],
            },
          ],
        });
        panel.append(elem);
      },
      {
        targetIndex: 1,
      }
    );
  }
}
