import { ranged_attack_basic, regen_stuff } from "./actions";
import { getState } from "./state";

function main() {
    setInterval(() => {
        regen_stuff();
        loot();

        if (!getState().attackMode || character.rip || is_moving(character)) {
            set_message("Attack: off");
            return;
        }

        ranged_attack_basic();
    }, 1000 / 4); // Loops every 1/4 seconds.
}

export { main };
