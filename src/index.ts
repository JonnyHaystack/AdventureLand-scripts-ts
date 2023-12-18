import { startPartyAutoAccepter } from "./common/autoAcceptParty";
import { startFriendMessageLogger } from "./common/logFriendMessage";
import { startPublishers } from "./eventHandlers";
import { setupDefaultKeybinds } from "./keybinds";
import * as mage from "./mage";

setupDefaultKeybinds();
startPublishers();
startPartyAutoAccepter();
startFriendMessageLogger();
mage.startMainLoop();
