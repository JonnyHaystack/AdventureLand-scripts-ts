import { toggleAttack, toggleFollow, toggleWaypointEditor } from "./actions";
import { startAutoServerCycle, stopAutoServerCycle } from "./changeServer";
import { requestMagiport } from "./common/magiport";
import { requestGold, takeAllGold } from "./common/requestGold";
import {
    requestAll,
    requestAllFromNearby,
    requestFromNearby,
    requestItem,
} from "./common/requestItem";
import { sellAll } from "./common/selling";
import { startPontyScraper, stopPontyScraper } from "./pontyScraper";
import { sortBankItems, sortInventory } from "./sortInventory";
import { sendItem, sendItemViaGui } from "./util";
import { undoLastWaypoint } from "./waypoints";
import { startCompound, stopCompound } from "./workflows/compoundItems";
import { startUpgrade, stopUpgrade } from "./workflows/upgradeItem";

function setupDefaultKeybinds() {
    reset_mappings();
    (parent as any).cmd = {
        toggleAttack,
        toggleFollow,
        toggleWaypointEditor,
        undoLastWaypoint,
        startUpgrade,
        stopUpgrade,
        startCompound,
        stopCompound,
        requestMagiport,
        sendItem,
        requestItem,
        requestFromNearby,
        requestAll,
        requestAllFromNearby,
        requestGold,
        takeAllGold,
        sendItemViaGui,
        sellAll,
        sortInventory,
        sortBankItems,
        startPontyScraper,
        stopPontyScraper,
        startAutoServerCycle,
        stopAutoServerCycle,
    };
    map_key("A", "snippet", "parent.cmd.toggleAttack()");
    map_key("W", "snippet", "parent.cmd.toggleWaypointEditor()");
    map_key("H", "use_town");
    map_key("X", "snippet", "parent.cmd.undoLastWaypoint()");
    map_key("F", "snippet", "parent.cmd.toggleFollow()");
    map_key("T", "snippet", "parent.cmd.requestMagiport('RobertTables')");
    map_key("B", "snippet", "parent.cmd.sendItemViaGui()");
    map_key(
        "S",
        "snippet",
        "stop(); parent.cmd.stopUpgrade(); parent.cmd.stopCompound();" +
            "parent.cmd.stopPontyScraper(); parent.cmd.stopAutoServerCycle();",
    );
    map_key("E", "snippet", "parent.cmd.sortInventory(); parent.cmd.sortBankItems();");
    if (character.ctype === "merchant") {
        map_key("G", "snippet", "parent.cmd.takeAllGold()");
        map_key("C", "snippet", "parent.cmd.requestAllFromNearby()");
        map_key(
            "V",
            "snippet",
            "parent.cmd.startPontyScraper(); parent.cmd.startAutoServerCycle();",
        );
        map_key("P", "snippet", "parent.cmd.startPontyScraper()");
    }
}

export { setupDefaultKeybinds };
