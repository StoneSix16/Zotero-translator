import ZoteroToolkit from "zotero-plugin-toolkit";
import { config } from "../../package.json";
import { getString } from "./locale";

export async function registerReaderTabPanel() {
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
          id: `${config.addonRef}-${reader._instanceID}-extra-reader-tab`,
          // This is important! Don't create content for multiple times
          // ignoreIfExists: true,
          styles:{
            padding:"5px 10px 10px 5px",
          },
          attributes: {
            flex: "1",
            align: "stretch",
          },
          removeIfExists: true,
          children: [
            {
              tag: "h2",
              properties: {
                innerText: "A Translator Tab Testttttt",
              },
            },
            {
              tag: "textarea",
              classList:[
                "raw-input"
              ],
              properties: {
                placeholder: "输入文本",
              },
              attributes: {
                height:"fit-content"
              },
            },
            {
              tag: "div",
              id: `${config.addonRef}-${reader._instanceID}-extra-reader-tab-translate`,
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
