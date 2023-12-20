import { CodeMessage } from "./common/codeMessage";

type MapClickHandler = (x: number, y: number) => boolean;
type PartyInviteHandler = (name: string) => void;
type PartyRequestHandler = (name: string) => void;
type CodeMessageHandler = (from: string, message: CodeMessage) => void;
type MagiportHandler = (from: string) => void;
type EventHandler = MapClickHandler | PartyInviteHandler | PartyRequestHandler | CodeMessageHandler;

const mapClickHandlers: MapClickHandler[] = [];
const partyInviteHandlers: PartyInviteHandler[] = [];
const partyRequestHandlers: PartyRequestHandler[] = [];
const codeMessageHandlers: CodeMessageHandler[] = [];
const magiportHandlers: MagiportHandler[] = [];

function attachHandler(handlers: EventHandler[], handler: EventHandler) {
    if (handlers.includes(handler)) {
        return false;
    }
    handlers.push(handler);
    return true;
}

function detachHandler(handlers: EventHandler[], handler: EventHandler) {
    const handlerIndex = handlers.indexOf(handler);
    if (handlerIndex < 0) {
        return false;
    }
    handlers.splice(handlerIndex, 1);
    return true;
}

function attachMapClickHandler(handler: MapClickHandler) {
    return attachHandler(mapClickHandlers, handler);
}

function detachMapClickHandler(handler: MapClickHandler) {
    return detachHandler(mapClickHandlers, handler);
}

function attachPartyInviteHandler(handler: PartyInviteHandler) {
    return attachHandler(partyInviteHandlers, handler);
}

function detachPartyInviteHandler(handler: PartyInviteHandler) {
    return detachHandler(partyInviteHandlers, handler);
}

function attachPartyRequestHandler(handler: PartyRequestHandler) {
    return attachHandler(partyRequestHandlers, handler);
}

function detachPartyRequestHandler(handler: PartyRequestHandler) {
    return detachHandler(partyRequestHandlers, handler);
}

function attachCodeMessageHandler(handler: CodeMessageHandler) {
    return attachHandler(codeMessageHandlers, handler);
}

function detachCodeMessageHandler(handler: CodeMessageHandler) {
    return detachHandler(codeMessageHandlers, handler);
}

function attachMagiportHandler(handler: MagiportHandler) {
    return attachHandler(magiportHandlers, handler);
}

function detachMagiportHandler(handler: MagiportHandler) {
    return detachHandler(magiportHandlers, handler);
}

function startPublishers() {
    on_party_invite = (name) => {
        partyRequestHandlers.forEach((handler) => handler(name));
    };

    on_party_request = (name) => {
        partyRequestHandlers.forEach((handler) => handler(name));
    };

    on_map_click = (x, y) => {
        let overrideDefaultMove = false;
        for (const handler of mapClickHandlers) {
            overrideDefaultMove = overrideDefaultMove || handler(x, y);
        }
        return overrideDefaultMove;
    };

    on_cm = (from, data) => {
        codeMessageHandlers.forEach((handler) => handler(from, data));
    };

    on_magiport = (from) => {
        magiportHandlers.forEach((handler) => handler(from));
    };
}

export {
    MapClickHandler,
    PartyInviteHandler,
    PartyRequestHandler,
    CodeMessageHandler,
    MagiportHandler,
    startPublishers,
    attachMapClickHandler,
    detachMapClickHandler,
    attachPartyInviteHandler,
    detachPartyInviteHandler,
    attachPartyRequestHandler,
    detachPartyRequestHandler,
    attachCodeMessageHandler,
    detachCodeMessageHandler,
    attachMagiportHandler,
    detachMagiportHandler,
};
