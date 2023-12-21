import { rangedAttackBasic, regenStuff } from "./actions";
import { followTask } from "./common/follow";
import { StateKey, getState } from "./state";
import { upgradeItemTask } from "./workflows/upgradeItem";

let mainLoopTimer: NodeJS.Timeout;
let followLoopTimer: NodeJS.Timeout;

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
    }, 1000 / 4); // Loops every 1/4 seconds.

    followLoopTimer = setInterval(async () => {
        followTask();
    }, 1500);
}

function stopMainLoop() {
    clearInterval(mainLoopTimer);
    clearInterval(followLoopTimer);
}

export { startMainLoop, stopMainLoop };
