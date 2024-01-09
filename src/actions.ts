import { startFollowing, stopFollowing } from "./common/follow";
import { AttackMode, StateKey, getState, setState } from "./state";
import { LOG } from "./util";
import { startWaypointEditor, stopWaypointEditor } from "./waypoints";

const safeties = true;
// let last_potion = new Date(0);

async function runAway() {
    // TODO: Improve this a lot
    setState(StateKey.ATTACK_MODE, AttackMode.INACTIVE);
    log(`Attack mode disabled - running away!`);
    await smart_move("bank");
}

function toggleAttack() {
    const attackMode = getState(StateKey.ATTACK_MODE);
    if (attackMode == null || attackMode == false || attackMode === AttackMode.INACTIVE) {
        setState(StateKey.ATTACK_MODE, AttackMode.FARMING_ACTIVE);
        LOG("Combat mode enabled!");
    } else {
        // } else if ([AttackMode.FARMING_ACTIVE, AttackMode.FARMING_PAUSE].includes(attackMode)) {
        setState(StateKey.ATTACK_MODE, AttackMode.INACTIVE);
        LOG("Combat mode disabled!");
    }
}

function toggleFollow() {
    const following = getState(StateKey.FOLLOWING);
    if (following == null && character.focus != null) {
        startFollowing(parent.entities[character.focus]);
        // startFollowing(get_target());
    } else {
        stopFollowing();
    }
}

function toggleWaypointEditor() {
    if (!getState(StateKey.WAYPOINT_MODE)) {
        startWaypointEditor();
        log("Waypoint editor started!");
        return;
    }

    // Save new waypoints if any were created.
    const newWaypoints = stopWaypointEditor();
    if (newWaypoints.length > 0) {
        setState(StateKey.WAYPOINTS, newWaypoints);
        log(`Saved ${newWaypoints.length} new waypoints!`);
        return;
    }
    log("No new waypoints to save.");
}

export { runAway, toggleAttack, toggleFollow, toggleWaypointEditor };
