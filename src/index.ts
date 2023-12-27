import { startServerCycleTimer } from "./changeServer";
import { startPartyAutoAccepter } from "./common/autoAcceptParty";
import { startFriendMessageLogger } from "./common/logFriendMessage";
import { startMagiportAutoAccepter, startMagiportRequestHandler } from "./common/magiport";
import { startGoldRequestHandler } from "./common/requestGold";
import { startItemRequestHandler } from "./common/requestItem";
import { startPublishers } from "./eventHandlers";
import { setupDefaultKeybinds } from "./keybinds";
import * as mage from "./mage";
import { startPontyScraper } from "./pontyScraper";
import { StateKey, getState } from "./state";

setupDefaultKeybinds();
startPublishers();
// startXmoveMapClickHandler();
startPartyAutoAccepter();
startFriendMessageLogger();
startMagiportAutoAccepter();
startItemRequestHandler();
startGoldRequestHandler();

switch (character.ctype) {
    case "mage":
        startMagiportRequestHandler();
        break;
    case "merchant":
        startPontyScraper();
        if (getState(StateKey.AUTO_SERVER_CYCLE)) {
            startServerCycleTimer();
        }
        break;
    default:
        break;
}

mage.startMainLoop();
