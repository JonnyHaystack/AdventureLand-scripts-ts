import { toggleAttack, toggleFollow, toggleWaypointEditor } from "./actions";
import { undoLastWaypoint } from "./waypoints";
import { startUpgradeItem, stopUpgradeItem } from "./workflows/upgradeItem";

function setupDefaultKeybinds() {
    reset_mappings();
    (parent as any).commands = {
        toggleAttack,
        toggleFollow,
        toggleWaypointEditor,
        undoLastWaypoint,
        startUpgradeItem,
        stopUpgradeItem,
    };
    map_key("A", "snippet", "parent.commands.toggleAttack()");
    map_key("W", "snippet", "parent.commands.toggleWaypointEditor()");
    map_key("X", "snippet", "parent.commands.undoLastWaypoint()");
    map_key("F", "snippet", "parent.commands.toggleFollow()");
    // map_key("'", "toggle_run_code");
}

export { setupDefaultKeybinds };
