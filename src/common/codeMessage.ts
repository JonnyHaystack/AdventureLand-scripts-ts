enum CodeMessageType {
    MAGIPORT = "MAGIPORT",
}

interface CodeMessage {
    type: CodeMessageType;
    args: any[];
}

export { CodeMessageType, CodeMessage };
