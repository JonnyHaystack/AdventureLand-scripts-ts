import { startPartyAutoAccepter } from "./common/autoAcceptParty";
import { startFriendMessageLogger } from "./common/logFriendMessage";
import * as eventHandlers from "./eventHandlers";
import * as keybinds from "./keybinds";
import * as mage from "./mage";

keybinds.setupDefaults();
eventHandlers.startPublishers();
startPartyAutoAccepter();
startFriendMessageLogger();
mage.main();
