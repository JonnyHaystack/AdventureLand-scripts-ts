import {
    attachPartyInviteHandler,
    attachPartyRequestHandler,
    detachPartyInviteHandler,
    detachPartyRequestHandler,
} from "../eventHandlers";
import { isFriend } from "../util";

function autoAcceptPartyHandler(name: string) {
    if (isFriend(name)) {
        accept_party_invite(name);
        log(`Received party invite/request from ${name}, and accepted it!`);
    }
}

function startPartyAutoAccepter() {
    attachPartyInviteHandler(autoAcceptPartyHandler);
    attachPartyRequestHandler(autoAcceptPartyHandler);
}

function stopPartyAutoAccepter() {
    detachPartyInviteHandler(autoAcceptPartyHandler);
    detachPartyRequestHandler(autoAcceptPartyHandler);
}

export { startPartyAutoAccepter, stopPartyAutoAccepter };
