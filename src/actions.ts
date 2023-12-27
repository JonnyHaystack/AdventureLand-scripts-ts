import { startFollowing, stopFollowing } from "./common/follow";
import { TARGET_ENEMY_MAX_ATK, TARGET_ENEMY_MIN_XP } from "./constants";
import { StateKey, getState, setState } from "./state";
import { amountICanHeal, amountICanMagicRegen, debug_log } from "./util";
import { startWaypointEditor, stopWaypointEditor } from "./waypoints";

const safeties = true;
// let last_potion = new Date(0);

function runAway() {
    // TODO: Improve this a lot
    setState(StateKey.ATTACK_MODE, false);
    log(`Attack mode disabled - running away!`);
    smart_move("bean");
}

function toggleAttack() {
    setState(StateKey.ATTACK_MODE, !getState(StateKey.ATTACK_MODE));
    log(`Attack mode ${getState(StateKey.ATTACK_MODE) ? "en" : "dis"}abled!`);
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

function regenStuff() {
    // if (safeties && mssince(last_potion) < Math.min(200, character.ping * 3)) {
    //     return resolving_promise({
    //         reason: "safeties",
    //         success: false,
    //         used: false,
    //     });
    // }

    // const cooldownAbilities = ["use_hp", "regen_hp", "use_mp", "regen_mp"];
    // for (const ability of cooldownAbilities) {
    //     if (is_on_cooldown(ability)) {
    //         return resolving_promise({ success: false, reason: "cooldown" });
    //     }
    // }
    if (is_on_cooldown("use_hp")) {
        return resolving_promise({ success: false, reason: "cooldown" });
    }

    const healAmount = amountICanHeal();
    if (character.max_hp - character.hp >= healAmount) {
        debug_log("use_skill('use_hp')");
        return use_skill("use_hp");
    }
    if (character.hp / character.max_hp < 0.3) {
        debug_log("runAway()");
        return runAway();
        // return use_skill("use_hp");
    }
    // if (character.mp / character.max_mp < 0.2) {
    //     debug_log("use_skill('use_mp')");
    //     return use_skill("use_mp");
    // }

    const magicRegenAmount = amountICanMagicRegen();
    if (character.max_mp - character.mp >= magicRegenAmount) {
        debug_log(`is_on_cooldown('use_mp'): ${is_on_cooldown("use_mp")}`);
        debug_log("use_skill('use_mp')");
        return use_skill("use_mp");
    }

    return resolving_promise({
        reason: "full",
        success: false,
        used: false,
    });
}

export { runAway, toggleAttack, toggleFollow, toggleWaypointEditor, regenStuff };
