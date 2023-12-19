import { debug } from "console";
import { startFollowing, stopFollowing } from "./common/follow";
import { StateKey, getState, setState } from "./state";
import { debug_log } from "./util";
import { startWaypointEditor, stopWaypointEditor } from "./waypoints";

const safeties = true;
let last_potion = new Date(0);

function runAway() {
    // TODO: Improve this a lot
    setState(StateKey.ATTACK_MODE, false);
    log(`Attack mode disabled!`);
    smart_move("bean");
}

function toggleAttack() {
    setState(StateKey.ATTACK_MODE, !getState(StateKey.ATTACK_MODE));
    log(`Attack mode ${getState(StateKey.ATTACK_MODE) ? "en" : "dis"}abled!`);
}

function toggleFollow() {
    const following = getState(StateKey.FOLLOWING);
    if (following == null) {
        startFollowing(get_target());
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
    if (safeties && mssince(last_potion) < Math.min(200, character.ping * 3)) {
        return resolving_promise({
            reason: "safeties",
            success: false,
            used: false,
        });
    }
    let used = true;

    const cooldownAbilities = ["use_hp", "regen_hp", "use_mp", "regen_mp"];
    for (const ability of cooldownAbilities) {
        if (is_on_cooldown(ability)) {
            return resolving_promise({ success: false, reason: "cooldown" });
        }
    }

    if (character.max_hp - character.hp >= 50) {
        debug_log("use_skill('regen_hp')");
        return use_skill("regen_hp");
    }
    if (character.hp / character.max_hp < 0.3) {
        debug_log("runAway()");
        return runAway();
        // return use_skill("use_hp");
    }
    if (character.mp / character.max_mp < 0.2) {
        debug_log("use_skill('use_mp')");
        return use_skill("use_mp");
    }
    if (character.max_mp - character.mp >= 100) {
        debug_log(`is_on_cooldown('regen_mp'): ${is_on_cooldown("regen_mp")}`);
        debug_log("use_skill('regen_mp')");
        return use_skill("regen_mp");
    }
    used = false;
    if (used) {
        last_potion = new Date();
    } else {
        return resolving_promise({
            reason: "full",
            success: false,
            used: false,
        });
    }
}

async function rangedAttackBasic() {
    let target = get_targeted_monster();
    if (!target) {
        debug_log("Searching for nearest monster");
        target = get_nearest_monster({ min_xp: 100, max_att: 120 });

        if (target) {
            debug_log(`Target acquired: ${target.name}`);
            change_target(target);
        } else {
            debug_log("No monsters found");
            set_message("No Monsters");
            return;
        }
    }

    if (!is_in_range(target)) {
        // Walk some of the distance.
        const distanceStepFactor = 0.1;
        debug_log(`Out of range, walking ${distanceStepFactor * 100}% of the distance to target`);
        move(
            character.x + (target.x - character.x) * distanceStepFactor,
            character.y + (target.y - character.y) * distanceStepFactor,
        );
        return;
    }
    const distanceToTarget = simple_distance(
        { x: character.x, y: character.y },
        { x: target.x, y: target.y },
    );

    const idealDistance = character.range * 0.9;
    // const idealDistance = target.range + 20;
    if (distanceToTarget < idealDistance) {
        debug_log(`distanceToTarget=${Math.round(distanceToTarget)}`);
        debug_log(
            `Vector: ${Math.round(character.x - target.x)}, ${Math.round(character.y - target.y)}`,
        );
        const idealDistanceMult = idealDistance / distanceToTarget;
        debug_log(`idealDistanceMult=${idealDistanceMult.toFixed(3)}`);
        await move(
            character.x + (character.x - target.x) * idealDistanceMult,
            character.y + (character.y - target.y) * idealDistanceMult,
        );
    }

    if (can_attack(target) && !is_on_cooldown("attack")) {
        set_message("Attacking");
        attack(target);
    }
}

export { runAway, toggleAttack, toggleFollow, toggleWaypointEditor, regenStuff, rangedAttackBasic };
