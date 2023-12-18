import { getState } from "./state";
import { debug_log } from "./util";
import { startWaypointEditor, stopWaypointEditor } from "./waypoints";

const safeties = true;
let last_potion = new Date(0);

function runAway() {
    // TODO: Improve this a lot
    getState().attackMode = false;
    smart_move("bean");
}

function toggleAttack() {
    getState().attackMode = !getState().attackMode;
    log(`Attack mode ${getState().attackMode ? "en" : "dis"}abled!`);
}

function toggleWaypointEditor() {
    if (!getState().waypointMode) {
        startWaypointEditor();
        log("Waypoint editor started!");
        return;
    }

    // Save new waypoints if any were created.
    const newWaypoints = stopWaypointEditor();
    if (newWaypoints.length > 0) {
        getState().waypoints = newWaypoints;
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

    if (character.mp / character.max_mp < 0.2) {
        debug_log("use_skill('use_mp')");
        return use_skill("use_mp");
    }
    if (character.max_mp - character.mp >= 100) {
        debug_log(`is_on_cooldown('regen_mp'): ${is_on_cooldown("regen_mp")}`);
        debug_log("use_skill('regen_mp')");
        return use_skill("regen_mp");
    }
    if (character.max_hp - character.hp >= 50) {
        debug_log("use_skill('regen_hp')");
        return use_skill("regen_hp");
    }
    if (character.hp / character.max_hp < 0.2) {
        debug_log("use_skill('use_hp')");
        return runAway();
        // return use_skill("use_hp");
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

function rangedAttackBasic() {
    let target = get_targeted_monster();
    if (!target) {
        target = get_nearest_monster({ min_xp: 100, max_att: 120 });

        if (target) {
            change_target(target);
        } else {
            set_message("No Monsters");
            return;
        }
    }

    if (!is_in_range(target)) {
        // Walk half the distance
        move(
            character.x + (target.x - character.x) / 2,
            character.y + (target.y - character.y) / 2,
        );
    } else if (can_attack(target) && !is_on_cooldown("attack")) {
        const distanceToTarget = simple_distance(
            { x: character.x, y: character.y },
            { x: target.x, y: target.y },
        );

        const safeDistance = target.range + 20;
        if (distanceToTarget < safeDistance) {
            debug_log(`distanceToTarget=${Math.round(distanceToTarget)}`);
            debug_log(
                `Vector: ${Math.round(character.x - target.x)}, ${Math.round(
                    character.y - target.y,
                )}`,
            );
            const safeDistanceMult = safeDistance / distanceToTarget;
            debug_log(`safeDistanceMult=${safeDistanceMult.toFixed(3)}`);
            move(
                character.x + (character.x - target.x) * safeDistanceMult,
                character.y + (character.y - target.y) * safeDistanceMult,
            );
        }

        set_message("Attacking");
        attack(target);
    }
}

export { runAway, toggleAttack, toggleWaypointEditor, regenStuff, rangedAttackBasic };
