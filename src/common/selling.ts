import { ItemKey } from "typed-adventureland";
import { debug_log } from "../util";

async function sellAll(itemName: ItemKey) {
    character.items.forEach(async (currentItem, index) => {
        if (currentItem?.name === itemName) {
            debug_log(`Selling ${JSON.stringify(currentItem)}`);
            await sell(index, 10000);
        }
    });
}

export { sellAll };
