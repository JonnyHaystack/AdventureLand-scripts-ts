import { rangedAttackBasic, regenStuff } from "./actions";
import { getState } from "./state";

function main() {
    setInterval(() => {
        regenStuff();
        loot();

        if (!getState().attackMode || character.rip || is_moving(character)) {
            set_message("Attack: off");
            return;
        }

        rangedAttackBasic();
    }, 1000 / 4); // Loops every 1/4 seconds.
}

export { main };
