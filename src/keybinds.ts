import { toggleAttack, toggleFollow, toggleWaypointEditor } from "./actions";
import { requestMagiport } from "./common/magiport";
import { requestGold, takeAllGold } from "./common/requestGold";
import { requestFromNearby, requestItem } from "./common/requestItem";
import { sellAll } from "./common/selling";
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
        requestGold,
        takeAllGold,
        sendItemViaGui,
        sellAll,
        sortInventory,
        sortBankItems,
    };
    map_key("A", "snippet", "parent.cmd.toggleAttack()");
    map_key("W", "snippet", "parent.cmd.toggleWaypointEditor()");
    map_key("H", "use_town");
    map_key("X", "snippet", "parent.cmd.undoLastWaypoint()");
    map_key("F", "snippet", "parent.cmd.toggleFollow()");
    map_key("T", "snippet", "parent.cmd.requestMagiport('RobertTables')");
    map_key("G", "snippet", "parent.cmd.takeAllGold()");
    map_key("B", "snippet", "parent.cmd.sendItemViaGui()");
    map_key("S", "snippet", "stop(); parent.cmd.stopUpgrade(); parent.cmd.stopCompound();");
    map_key("E", "snippet", "parent.cmd.sortInventory(); parent.cmd.sortBankItems();");
}

export { setupDefaultKeybinds };
