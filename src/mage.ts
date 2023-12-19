import { rangedAttackBasic, regenStuff } from "./actions";
import { followTask } from "./common/follow";
import { StateKey, getState } from "./state";
import { upgradeItemTask } from "./workflows/upgradeItem";

let mainLoopTimer: NodeJS.Timeout;

function startMainLoop() {
    mainLoopTimer = setInterval(async () => {
        regenStuff();
        loot();

        if (!getState(StateKey.ATTACK_MODE) || character.rip || is_moving(character)) {
            set_message("Attack: off");
        } else {
            await rangedAttackBasic();
        }

        upgradeItemTask();
        followTask();
    }, 1000 / 4); // Loops every 1/4 seconds.
}

function stopMainLoop() {
    clearInterval(mainLoopTimer);
}

export { startMainLoop, stopMainLoop };
