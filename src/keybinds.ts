import { toggleAttack, toggleFollow, toggleWaypointEditor } from "./actions";
import { requestMagiport } from "./common/magiport";
import { requestGold, takeAllGold } from "./common/requestGold";
import { requestItem } from "./common/requestItem";
import { sendItem, sendItemViaGui } from "./util";
import { undoLastWaypoint } from "./waypoints";
import { startUpgradeItem, stopUpgradeItem } from "./workflows/upgradeItem";

function setupDefaultKeybinds() {
    reset_mappings();
    (parent as any).cmd = {
        toggleAttack,
        toggleFollow,
        toggleWaypointEditor,
        undoLastWaypoint,
        startUpgradeItem,
        stopUpgradeItem,
        requestMagiport,
        sendItem,
        requestItem,
        requestGold,
        takeAllGold,
        sendItemViaGui,
    };
    map_key("A", "snippet", "parent.cmd.toggleAttack()");
    map_key("W", "snippet", "parent.cmd.toggleWaypointEditor()");
    map_key("H", "use_town");
    map_key("X", "snippet", "parent.cmd.undoLastWaypoint()");
    map_key("F", "snippet", "parent.cmd.toggleFollow()");
    map_key("T", "snippet", "parent.cmd.requestMagiport('RobertTables')");
    map_key("G", "snippet", "parent.cmd.takeAllGold()");
    map_key("B", "snippet", "parent.cmd.sendItemViaGui()");
}

export { setupDefaultKeybinds };
