export class Request{
    value: Array<Object>|Object|undefined;
    constructor(value:Array<Object>|Object|string|undefined){
        this.value = value
    }
}

export class UpdateRequest extends Request{
    type:"raw"|"transelate";
    constructor(type:"raw"|"transelate", value:Array<Object>|Object|string|undefined){
        super(value);
        this.type = type;
    }
}