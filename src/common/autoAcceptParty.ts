import {
    attachPartyInviteHandler,
    attachPartyRequestHandler,
    detachPartyInviteHandler,
    detachPartyRequestHandler,
} from "../eventHandlers";
import { isFriend } from "../util";

function autoAcceptPartyRequest(name: string) {
    if (isFriend(name)) {
        accept_party_request(name);
        log(`Received party request from ${name}, and accepted it!`);
    }
}

function autoAcceptPartyInvite(name: string) {
    if (isFriend(name)) {
        accept_party_invite(name);
        log(`Received party invite from ${name}, and accepted it!`);
    }
}

function startPartyAutoAccepter() {
    attachPartyInviteHandler(autoAcceptPartyInvite);
    attachPartyRequestHandler(autoAcceptPartyRequest);
}

function stopPartyAutoAccepter() {
    detachPartyInviteHandler(autoAcceptPartyInvite);
    detachPartyRequestHandler(autoAcceptPartyRequest);
}

export { startPartyAutoAccepter, stopPartyAutoAccepter };
