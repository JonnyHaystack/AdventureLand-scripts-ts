import { toggle_attack, toggle_waypoint_edit } from "./actions";

function setupDefaults() {
    reset_mappings();
    // const { toggle_attack, toggle_waypoint_edit } = actions;
    parent.codeActions = { toggle_attack, toggle_waypoint_edit };
    map_key("A", "snippet", "parent.codeActions.toggle_attack()");
    map_key("W", "snippet", "parent.codeActions.toggle_waypoint_edit()");
    map_key("'", "toggle_run_code");
}

export { setupDefaults };
