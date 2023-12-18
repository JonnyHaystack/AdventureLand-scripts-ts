import * as eventHandlers from "./eventHandlers";
import * as keybinds from "./keybinds";
import * as mage from "./mage";

keybinds.setupDefaults();
eventHandlers.setupDefaults();
mage.main();
