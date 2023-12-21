enum CodeMessageType {
    MAGIPORT = "MAGIPORT",
    GIVE_ITEM = "GIVE_ITEM",
    GIVE_GOLD = "GIVE_GOLD",
}

interface CodeMessage {
    type: CodeMessageType;
    args: any;
}

export { CodeMessageType, CodeMessage };
