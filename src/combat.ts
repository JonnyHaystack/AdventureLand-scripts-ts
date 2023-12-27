import { MonsterEntity } from "typed-adventureland";
import {
    TARGET_ENEMY_MAX_ATK,
    TARGET_ENEMY_MAX_DAMAGE_RETURN_PERCENT,
    TARGET_ENEMY_MIN_XP,
} from "./constants";
import { debug_log } from "./util";

function findAllowedTargets() {
    return Object.values(parent.entities).filter(
        (entity) =>
            entity.type === "monster" &&
            entity.visible &&
            !entity.dead &&
            entity.xp >= TARGET_ENEMY_MIN_XP &&
            entity.attack <= TARGET_ENEMY_MAX_ATK &&
            (character.ctype !== "paladin" ||
                entity.dreturn == null ||
                entity.dreturn <= TARGET_ENEMY_MAX_DAMAGE_RETURN_PERCENT) &&
            (entity?.evasion ?? 0) <= 50,
    );
}

function findNearestMonster() {
    const allowedTargetsSorted = findAllowedTargets().sort(
        (entity1, entity2) =>
            simple_distance({ x: character.x, y: character.y }, { x: entity1.x, y: entity1.y }) -
            simple_distance({ x: character.x, y: character.y }, { x: entity2.x, y: entity2.y }),
    );
    if (allowedTargetsSorted.length < 1) {
        return null;
    }
    return parent.entities[allowedTargetsSorted[0].id] as MonsterEntity;
}

function updateTarget() {
    let target = get_targeted_monster();
    if (target != null && (target?.target ?? null) === character.id) {
        return target;
    }

    debug_log("Searching for nearest monster");
    target = findNearestMonster();

    if (target == null) {
        debug_log("No monsters found");
        set_message("No Monsters");
        return;
    }

    debug_log(`Target acquired: ${target.name}`);
    change_target(target);
    return target;
}

async function reposition(target: MonsterEntity) {
    if (!is_in_range(target)) {
        // Walk some of the distance.
        const distanceStepFactor = 0.1;
        debug_log(`Out of range, walking ${distanceStepFactor * 100}% of the distance to target`);
        await xmove(
            character.x + (target.x - character.x) * distanceStepFactor,
            character.y + (target.y - character.y) * distanceStepFactor,
        );
        // return;
    }
    const distanceToTarget = simple_distance(
        { x: character.x, y: character.y },
        { x: target.x, y: target.y },
    );

    const idealDistance = Math.min(character.range * 0.9, target.range + 20);
    if (distanceToTarget < idealDistance) {
        debug_log(`distanceToTarget=${Math.round(distanceToTarget)}`);
        debug_log(
            `Vector: ${Math.round(character.x - target.x)}, ${Math.round(character.y - target.y)}`,
        );
        const idealDistanceMult = idealDistance / distanceToTarget;
        debug_log(`idealDistanceMult=${idealDistanceMult.toFixed(3)}`);
        await xmove(
            character.x + (character.x - target.x) * idealDistanceMult,
            character.y + (character.y - target.y) * idealDistanceMult,
        );
    }
}

async function rangedAttackBasic() {
    const target = updateTarget();
    if (target == null) {
        return;
    }

    if (character.ctype === "paladin") {
        reposition(target);
    }

    if (can_attack(target) && !is_on_cooldown("attack")) {
        set_message("Attacking");
        await attack(target);
    }
}

export { updateTarget, rangedAttackBasic };
