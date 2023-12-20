import {
    CodeMessageHandler,
    MagiportHandler,
    attachCodeMessageHandler,
    attachMagiportHandler,
    detachCodeMessageHandler,
    detachMagiportHandler,
} from "../eventHandlers";
import { debug_log, isFriend } from "../util";
import { CodeMessageType } from "./codeMessage";

const autoAcceptMagiport: MagiportHandler = (from: string) => {
    if (!isFriend(from)) {
        debug_log(`Rejecting magiport request from non-friend ${from}`);
        return;
    }
    debug_log(`Auto-accepting magiport request from friend ${from}`);
    accept_magiport(from);
};

function requestMagiport(fromPlayer: string) {
    send_cm(fromPlayer, { type: CodeMessageType.MAGIPORT });
}

const handleMagiportRequest: CodeMessageHandler = (from, message) => {
    if (!isFriend(from)) {
        debug_log("Not in friends list - ignoring code message!");
        return;
    }
    if (message.type !== CodeMessageType.MAGIPORT) {
        return;
    }
    debug_log(`Received magiport request from ${from}`);
    if (character.ctype !== "mage") {
        debug_log("I'm not a mage what do they expect from me :(");
    }
    debug_log(`Magiporting ${from} to me!`);
    use_skill("magiport", from);
};

function startMagiportRequestHandler() {
    attachCodeMessageHandler(handleMagiportRequest);
}

function stopMagiportRequestHandler() {
    detachCodeMessageHandler(handleMagiportRequest);
}

function startMagiportAutoAccepter() {
    attachMagiportHandler(autoAcceptMagiport);
}

function stopMagiportAutoAccepter() {
    detachMagiportHandler(autoAcceptMagiport);
}

export {
    requestMagiport,
    startMagiportAutoAccepter,
    startMagiportRequestHandler,
    stopMagiportAutoAccepter,
    stopMagiportRequestHandler,
};
