import ZoteroToolkit from "zotero-plugin-toolkit";
import { config } from "../../package.json";
import { getString } from "./locale";
import { Request, TranslateRequest, UpdateRequest } from "../utils/request";
import { google } from "./service/google";
import { gpt } from "./service/gpt";

export function updateReaderTabPanel(
  readerInstance: _ZoteroTypes.ReaderInstance,
  req: UpdateRequest
) {
  const con = readerInstance._window?.document.querySelector(
    `#${config.addonRef}-${readerInstance._instanceID}-extra-reader-tab`
  );
  let elem = con?.querySelector(`.${req.type}`);
  switch (req.type) {
    case "raw":
      (elem as HTMLTextAreaElement).value = req.value as string;
      translate(readerInstance, new TranslateRequest("google", req.value));
      break;
    case "translate":
      (elem as HTMLDivElement).innerText = req.value as string;
      break;
    case "GPTask":
      (elem as HTMLTextAreaElement).value = req.value as string;
      translate(readerInstance, new TranslateRequest("GPT", req.value));      
      break;
    case"GPTanswer":
      (elem as HTMLDivElement).innerText = req.value as string;
      break;
  }
}

async function translate(
  readerInstance: _ZoteroTypes.ReaderInstance,
  req: TranslateRequest
) {
  let result ;
  if(req.service == "google")
    result = await google(req);
  else 
    result = await gpt(req);
    updateReaderTabPanel(readerInstance, new UpdateRequest("GPTanswer", result));
}

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
        styles: {
          padding: "5px 10px 10px 5px",
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
            tag: "vbox",
            children: [
              {
                tag: "textarea",
                classList: ["raw"],
                properties: {
                  placeholder: "输入文本",
                },
                attributes: {
                  height: "fit-content",
                },
                listeners: [
                  {
                    type: "change",
                    listener: (e: Event) => {
                      if (e) ztoolkit.log(e as Object);
                      else ztoolkit.log("nothing");
                      
                    },
                  },
                ],
              },
              {
                tag: "select",
                children: [
                  {
                    tag: "option",
                    properties: {
                      value: "谷歌翻译",
                      innerText: "就你是谷歌翻译？",
                    },
                  },
                ],
              },
              {
                tag: "div",
                classList: ["translate"],
                properties: {
                  innerText: "芝士翻译结果",
                },
              },
              {
                tag: "div",
                properties: {
                  innerText: `itemID: ${reader.itemID}.`,
                },
              },
            ],
          },
          {
            tag: "vbox",
            children: [
              {
                tag: "textarea",
                classList: ["GPTask"],
                properties: {
                  placeholder: "询问GPT",
                },
                attributes: {
                  height: "fit-content",
                },
                listeners: [
                  {
                    type: "change",
                    listener: (e: Event) => {
                      if (e) ztoolkit.log(e as Object);
                      else ztoolkit.log("nothing");
                      
                    },
                  },
                ],
              },
              {
                tag: "select",
                children: [
                  {
                    tag: "option",
                    properties: {
                      value: "谷歌翻译",
                      innerText: "就你是GPT？",
                    },
                  },
                ],
              },
              {
                tag: "div",
                classList: ["GPTanswer"],
                properties: {
                  innerText: "芝士回答",
                },
              },
            ],
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
