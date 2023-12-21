import { ItemKey } from "typed-adventureland";
import { CodeMessage, CodeMessageType } from "./codeMessage";
import { attachCodeMessageHandler, detachCodeMessageHandler } from "../eventHandlers";
import { LOG, debug_log, isMyCharacter, sendItem } from "../util";

function requestItem(fromPlayer: string, item: ItemKey, quantity: number = 1) {
    LOG(`Requesting ${quantity} ${item} from ${fromPlayer}`);
    send_cm(fromPlayer, { type: CodeMessageType.GIVE_ITEM, args: { item, quantity } });
}

function handleItemRequest(from: string, message: CodeMessage) {
    if (message?.type !== CodeMessageType.GIVE_ITEM) {
        return;
    }
    if (!isMyCharacter(from)) {
        debug_log(`${from} is not one of my characters - ignoring code message!`);
        return;
    }
    const item = message?.args?.item;
    const quantity = message?.args?.quantity;
    debug_log(`Sending ${quantity} ${item} to ${from}`);
    sendItem(from, item, quantity);
}

function startItemRequestHandler() {
    attachCodeMessageHandler(handleItemRequest);
}

function stopItemRequestHandler() {
    detachCodeMessageHandler(handleItemRequest);
}

export { requestItem, startItemRequestHandler, stopItemRequestHandler };
