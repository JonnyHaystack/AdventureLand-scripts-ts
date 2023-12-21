import { startPartyAutoAccepter } from "./common/autoAcceptParty";
import { startFriendMessageLogger } from "./common/logFriendMessage";
import { startMagiportAutoAccepter, startMagiportRequestHandler } from "./common/magiport";
import { startPublishers } from "./eventHandlers";
import { setupDefaultKeybinds } from "./keybinds";
import * as mage from "./mage";
import { startItemRequestHandler } from "./common/requestItem";
import { startGoldRequestHandler } from "./common/requestGold";

setupDefaultKeybinds();
startPublishers();
startPartyAutoAccepter();
startFriendMessageLogger();
startMagiportAutoAccepter();
startItemRequestHandler();
startGoldRequestHandler();

switch (character.ctype) {
    case "mage":
        startMagiportRequestHandler();
        break;
    default:
        break;
}

mage.startMainLoop();
