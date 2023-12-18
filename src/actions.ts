import { getState } from "./state";
import { debug_log } from "./util";

const safeties = true;
let last_potion = new Date(0);

function run_away() {
    // TODO: Improve this a lot
    getState().attackMode = false;
    smart_move("bean");
}

function toggle_attack() {
    getState().attackMode = !getState().attackMode;
    log(`Attack mode ${getState().attackMode ? "en" : "dis"}abled!`);
}

function toggle_waypoint_edit() {
    getState().waypointMode = !getState().waypointMode;
    log(`Waypoint editor ${getState().waypointMode ? "en" : "dis"}abled!`);
    clear_drawings();
}

function regen_stuff() {
    if (safeties && mssince(last_potion) < Math.min(200, character.ping * 3)) {
        return resolving_promise({
            reason: "safeties",
            success: false,
            used: false,
        });
    }
    let used = true;

    const cooldown_abilities = ["use_hp", "regen_hp", "use_mp", "regen_mp"];
    for (const ability of cooldown_abilities) {
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
        return run_away();
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

function ranged_attack_basic() {
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
        const distance_to_target = simple_distance(
            { x: character.x, y: character.y },
            { x: target.x, y: target.y },
        );

        const safe_distance = target.range + 20;
        if (distance_to_target < safe_distance) {
            debug_log(`distance_to_target=${Math.round(distance_to_target)}`);
            debug_log(
                `Vector: ${Math.round(character.x - target.x)}, ${Math.round(
                    character.y - target.y,
                )}`,
            );
            const safe_distance_mult = safe_distance / distance_to_target;
            debug_log(`safe_distance_mult=${safe_distance_mult.toFixed(3)}`);
            move(
                character.x + (character.x - target.x) * safe_distance_mult,
                character.y + (character.y - target.y) * safe_distance_mult,
            );
        }

        set_message("Attacking");
        attack(target);
    }
}

export { run_away, toggle_attack, toggle_waypoint_edit, regen_stuff, ranged_attack_basic };
