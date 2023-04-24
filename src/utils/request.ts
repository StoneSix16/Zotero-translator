import { AnyTxtRecord } from "dns";

export class Request{
    value: any|undefined;
    constructor(value:any|undefined){
        this.value = value
    }
}

export class UpdateRequest extends Request{
    type:"raw"|"translate"|"GPTask"|"GPTanswer";
    constructor(type:"raw"|"translate"|"GPTask"|"GPTanswer", value:Array<Object>|Object|string|undefined){
        super(value);
        this.type = type;
    }
}

export class TranslateRequest extends Request{
    service:string;
    constructor(service:string, value:Array<string>|string|undefined){
        super(value);
        this.service = service;
    }
}