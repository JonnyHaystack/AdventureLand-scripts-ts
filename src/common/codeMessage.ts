enum CodeMessageType {
    MAGIPORT = "MAGIPORT",
    GIVE_ITEM = "GIVE_ITEM",
    GIVE_ALL_ITEMS = "GIVE_ALL_ITEMS",
    GIVE_GOLD = "GIVE_GOLD",
    GOTO = "GOTO",
}

interface CodeMessage {
    type: CodeMessageType;
    args: any;
}

export { CodeMessageType, CodeMessage };
