import {
    attachPartyInviteHandler,
    attachPartyRequestHandler,
    detachPartyInviteHandler,
    detachPartyRequestHandler,
} from "../eventHandlers";
import { FRIENDS_LIST } from "../constants";

function autoAcceptPartyHandler(name: string) {
    if (FRIENDS_LIST.includes(name)) {
        accept_party_invite(name);
    }
    log(`Received party invite/request from ${name}, and accepted it!`);
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
