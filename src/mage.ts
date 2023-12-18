import { rangedAttackBasic, regenStuff } from "./actions";
import { StateKey, getState } from "./state";
import { upgradeItemTask } from "./workflows/upgradeItem";

let mainLoopTimer: NodeJS.Timeout;

function startMainLoop() {
    mainLoopTimer = setInterval(() => {
        regenStuff();
        loot();

        if (!getState(StateKey.ATTACK_MODE) || character.rip || is_moving(character)) {
            set_message("Attack: off");
        } else {
            rangedAttackBasic();
        }

        upgradeItemTask();
    }, 1000 / 4); // Loops every 1/4 seconds.
}

function stopMainLoop() {
    clearInterval(mainLoopTimer);
}

export { startMainLoop, stopMainLoop };
