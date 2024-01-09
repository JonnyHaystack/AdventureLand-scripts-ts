import { runAway } from "./actions";
import { AttackMode, StateKey, getState, setState } from "./state";
import { LOG, amountICanHeal, amountICanMagicRegen, debug_log } from "./util";

async function regenTask() {
    if (is_on_cooldown("use_hp")) {
        return resolving_promise({ success: false, reason: "cooldown" });
    }

    // TODO: Also factor in enemy DPS if possible to determine if we can out-heal the enemy's
    // damage or if we should focus on restoring MP first to end the fight.

    const hpDeficit = character.max_hp - character.hp;
    const mpDeficit = character.max_mp - character.mp;
    const hpFractional = character.hp / character.max_hp;
    const mpFractional = character.mp / character.max_mp;
    const healAmount = amountICanHeal();
    const magicRegenAmount = amountICanMagicRegen();
    const isTargetedByEnemy =
        Object.values(parent.entities).find((entity) => entity.target === character.id) != null;

    // If MP/HP fall to dangerous levels, if in combat mode, temporarily pause combat to regen
    // HP/MP, otherwise run away.
    if (mpFractional < 0.1 || hpFractional < 0.3) {
        const attackMode = getState(StateKey.ATTACK_MODE);
        if (attackMode === AttackMode.FARMING_ACTIVE) {
            setState(StateKey.ATTACK_MODE, AttackMode.FARMING_PAUSE);
            LOG("Pausing combat to recover HP/MP");
        } else if (attackMode === AttackMode.INACTIVE && isTargetedByEnemy) {
            debug_log("runAway()");
            await runAway();
        }
    }

    // If combat is paused but we have now topped up our HP and MP, resume combat.
    if (
        getState(StateKey.ATTACK_MODE) === AttackMode.FARMING_PAUSE &&
        hpFractional > 0.9 &&
        mpFractional > 0.9
    ) {
        LOG("Resuming combat");
        setState(StateKey.ATTACK_MODE, AttackMode.FARMING_ACTIVE);
    }

    // Check which has current lower % of total out of HP and MP and prioritise that one for
    // regen.
    const attackMode = getState(StateKey.ATTACK_MODE);
    const notInCombat = attackMode === AttackMode.INACTIVE && !isTargetedByEnemy;
    if (hpFractional < mpFractional) {
        // Only use health potion if deficit is greater than the amount it would heal, or if combat
        // is inactive and we're not being targeted.
        if (hpDeficit >= 50 && (hpDeficit <= healAmount || notInCombat)) {
            return use_skill("regen_hp");
        } else if (hpDeficit >= healAmount) {
            return use_skill("use_hp");
        }
    } else {
        if (mpDeficit >= 100 && (mpDeficit <= healAmount || notInCombat)) {
            return use_skill("regen_mp");
        } else if (mpDeficit >= magicRegenAmount) {
            return use_skill("use_mp");
        }
    }

    /*
    if (character.max_hp - character.hp >= healAmount) {
        debug_log("use_skill('use_hp')");
        return use_skill("use_hp");
    }
    */
    // if (character.mp / character.max_mp < 0.2) {
    //     debug_log("use_skill('use_mp')");
    //     return use_skill("use_mp");
    // }

    // if (character.max_mp - character.mp >= magicRegenAmount) {
    //     debug_log(`is_on_cooldown('use_mp'): ${is_on_cooldown("use_mp")}`);
    //     debug_log("use_skill('use_mp')");
    //     return use_skill("use_mp");
    // }

    return resolving_promise({
        reason: "full",
        success: false,
        used: false,
    });
}

export { regenTask };
