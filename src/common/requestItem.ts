import { ItemKey } from "typed-adventureland";
import { CodeMessage, CodeMessageType } from "./codeMessage";
import { attachCodeMessageHandler, detachCodeMessageHandler } from "../eventHandlers";
import { LOG, debug_log, isMyCharacter, myNearbyCharacters, sendAllItems, sendItem } from "../util";

function requestItem(fromPlayer: string, item: ItemKey, quantity: number = 1) {
    LOG(`Requesting ${quantity}x ${item} from ${fromPlayer}`);
    send_cm(fromPlayer, { type: CodeMessageType.GIVE_ITEM, args: { item, quantity } });
}

function requestFromNearby(item: ItemKey, quantity: number = 1) {
    LOG(`Requesting ${quantity}x ${item} from all nearby characters`);
    const nearbyCharNames = myNearbyCharacters().map((character) => character.name);
    nearbyCharNames.forEach((name) => {
        send_cm(name, { type: CodeMessageType.GIVE_ITEM, args: { item, quantity } });
    });
}

function requestAll(fromPlayer: string) {
    LOG(`Requesting all items from ${fromPlayer}`);
    send_cm(fromPlayer, { type: CodeMessageType.GIVE_ALL_ITEMS });
}

function requestAllFromNearby() {
    LOG(`Requesting all items from all nearby characters`);
    const nearbyCharNames = myNearbyCharacters().map((character) => character.name);
    nearbyCharNames.forEach((name) => send_cm(name, { type: CodeMessageType.GIVE_ALL_ITEMS }));
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

function requestAllItemsHandler(from: string, message: CodeMessage) {
    if (message?.type !== CodeMessageType.GIVE_ALL_ITEMS) {
        return;
    }
    if (!isMyCharacter(from)) {
        debug_log(`${from} is not one of my characters - ignoring code message!`);
        return;
    }
    debug_log(`Sending all items to ${from}`);
    sendAllItems(from);
}

function startItemRequestHandler() {
    attachCodeMessageHandler(handleItemRequest);
    attachCodeMessageHandler(requestAllItemsHandler);
}

function stopItemRequestHandler() {
    detachCodeMessageHandler(handleItemRequest);
    detachCodeMessageHandler(requestAllItemsHandler);
}

export {
    requestItem,
    requestFromNearby,
    requestAll,
    requestAllFromNearby,
    startItemRequestHandler,
    stopItemRequestHandler,
};
