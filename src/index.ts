import { startPartyAutoAccepter } from "./common/autoAcceptParty";
import { startFriendMessageLogger } from "./common/logFriendMessage";
import { startMagiportAutoAccepter, startMagiportRequestHandler } from "./common/magiport";
import { startPublishers } from "./eventHandlers";
import { setupDefaultKeybinds } from "./keybinds";
import * as mage from "./mage";

setupDefaultKeybinds();
startPublishers();
startPartyAutoAccepter();
startFriendMessageLogger();
startMagiportAutoAccepter();

switch (character.ctype) {
    case "mage":
        startMagiportRequestHandler();
        break;
    default:
        break;
}

mage.startMainLoop();
