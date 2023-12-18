import { toggleAttack, toggleWaypointEditor } from "./actions";
import { undoLastWaypoint } from "./waypoints";

function setupDefaults() {
    reset_mappings();
    parent.codeActions = { toggleAttack, toggleWaypointEditor, undoLastWaypoint };
    map_key("A", "snippet", "parent.codeActions.toggleAttack()");
    map_key("W", "snippet", "parent.codeActions.toggleWaypointEditor()");
    map_key("X", "snippet", "parent.codeActions.undoLastWaypoint()");
    // map_key("'", "toggle_run_code");
}

export { setupDefaults };
