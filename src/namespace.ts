export class Namespace {
    namespaces: Map<string, Map<string, number>>;

    constructor(){
        this.namespaces = new Map();
    }
}