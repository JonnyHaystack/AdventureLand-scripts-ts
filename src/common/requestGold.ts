import { CodeMessage, CodeMessageType } from "./codeMessage";
import { attachCodeMessageHandler, detachCodeMessageHandler } from "../eventHandlers";
import { LOG, debug_log, isMyCharacter, myNearbyCharacters } from "../util";

function requestGold(fromPlayer: string, quantity: number = 1) {
    LOG(`Requesting ${quantity} gold from ${fromPlayer}`);
    send_cm(fromPlayer, { type: CodeMessageType.GIVE_GOLD, args: { quantity } });
}

function takeAllGold() {
    myNearbyCharacters().forEach((chara) => {
        requestGold(chara.name, 10e9);
    });
}

function handleGoldRequest(from: string, message: CodeMessage) {
    if (message?.type !== CodeMessageType.GIVE_GOLD) {
        return;
    }
    if (!isMyCharacter(from)) {
        debug_log(`${from} is not one of my characters - ignoring code message!`);
        return;
    }
    const quantity = message?.args?.quantity;
    debug_log(`Sending ${quantity} gold to ${from}`);
    send_gold(from, quantity);
}

function startGoldRequestHandler() {
    attachCodeMessageHandler(handleGoldRequest);
}

function stopGoldRequestHandler() {
    detachCodeMessageHandler(handleGoldRequest);
}

export { requestGold, takeAllGold, startGoldRequestHandler, stopGoldRequestHandler };
