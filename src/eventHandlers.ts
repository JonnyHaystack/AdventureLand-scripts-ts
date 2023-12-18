import { debug_log } from "./util";
import { partyAllowList } from "./constants";
import { getState } from "./state";

function setupDefaults() {
    on_party_invite = (name) => {
        if (partyAllowList.includes(name)) {
            accept_party_invite(name);
        }
        log(`Received party invite from ${name}, and accepted it!`);
    };

    on_party_request = (name) => {
        if (partyAllowList.includes(name)) {
            accept_party_request(name);
        }
        log(`Received party request from ${name}, and accepted it!`);
    };

    on_map_click = (x, y) => {
        debug_log(`getState().waypointMode: ${getState().waypointMode}`);
        if (!getState().waypointMode) {
            return false;
        }

        debug_log(`Adding waypoint: ${x}, ${y}`);
        if (getState().waypoints.length > 0) {
            const last_waypoint = getState().waypoints[getState().waypoints.length - 1];
            draw_line(last_waypoint.x, last_waypoint.y, x, y, 1);
        } else {
            draw_line(character.x, character.y, x, y, 1);
        }
        getState().waypoints.push({ x, y });

        return true;
    };

    // On every character, implement a messaging logic like this:
    character.on("cm", (m: any) => {
        // send_cm();
        safe_log(m);
        if (m.name === "Dengar") {
            safe_log(m);
        }
    });
}

export { setupDefaults };
