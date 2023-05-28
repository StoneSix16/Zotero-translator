import { stringify } from "querystring";
import { TranslateRequest } from "../../utils/request";
import { OpenAIApi, Configuration } from "openai";

export async function gpt(req: TranslateRequest) {
  let result = await _gpt(req);
  Zotero.debug("ERROR1 " + JSON.stringify(result).toString());
  Zotero.log("ERROR2 " + JSON.stringify(result).toString(),"error");
  return result;
}
async function _gpt(req: TranslateRequest) {
  let openai_key = Zotero.Prefs.get("translator.key") as any;
  let question = req.value;
  const model = "gpt-3.5-turbo";
  const temperature = 0;
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const xhr = await Zotero.HTTP.request("POST", apiUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openai_key}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0,
      stream: true,
    }),
    responseType: "text",
    debug:true,
    // requestObserver: (xmlhttp: XMLHttpRequest) => {
    //   let preLength = 0;
    //   let result = "";
    //   xmlhttp.onprogress = (e: any) => {
    //     // Only concatenate the new strings
    //     let newResponse = e.target.response.slice(preLength);
    //     Zotero.debug("RES "+newResponse);
    //     let dataArray = newResponse.split("data: ");
        
    //     for (let data of dataArray) {
    //       try {
    //         let obj = JSON.parse(data);
    //         let choice = obj.choices[0];
    //         if (choice.finish_reason) {
    //           break;
    //         }
    //         result += choice.delta.content || "";
    //       } catch {
    //         continue;
    //       }
    //     }

    //     // Clear timeouts caused by stream transfers
    //     if (e.target.timeout) {
    //       e.target.timeout = 0;
    //     }

    //     // Remove \n\n from the beginning of the data
    //     //   data.result = result.replace(/^\n\n/, "");
    //     //   preLength = e.target.response.length;
    //     ret = result;
    //   };
    // },
  });
  let result = "";
  if (xhr?.status !== 200) {
    result = "false";
  }
  else{
    let response = xhr.responseText
    let dataArray = response.split("data: ");
        
    for (let data of dataArray) {
      try {
        let obj = JSON.parse(data);
        let choice = obj.choices[0];
        if (choice.finish_reason) {
          break;
        }
        result += choice.delta.content || "";
      } catch {
        continue;
      }
    }
  }
  return result;
}
