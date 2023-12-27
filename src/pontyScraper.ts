import { ItemKey } from "typed-adventureland";
import { LOG, debug_log } from "./util";

type WishlistType = {
    [key: string]: { maxLevel?: number };
};

const wishlist: WishlistType = {
    ornamentstaff: {},
    stramulet: {},
    strring: {},
    strbelt: {},
    intamulet: {},
    intring: {},
    intbelt: {},
    dexamulet: {},
    dexring: {},
    dexbelt: {},
    wattire: {},
    wbreeches: {},
    wbook0: {},
    // xmace: {},
    shield: {},
    cape: {},
};

let pontyScraperTimer: NodeJS.Timeout | null;

function startPontyScraper() {
    if (pontyScraperTimer != null) {
        LOG("Ponty scraper already running");
        return;
    }
    pontyScraperTimer = setInterval(() => parent.socket.emit("secondhands"), 1000);

    parent.socket.on("secondhands", async (items) => {
        const desiredItems = items.filter((item) => {
            // debug_log(JSON.stringify(item));
            return (
                Object.keys(wishlist).includes(item.name) &&
                (item?.level ?? 0) <= (wishlist[item.name].maxLevel ?? 0)
            );
        });

        debug_log(`Items to buy from wishlist: ${desiredItems.length}`);

        desiredItems.forEach((item) => {
            LOG(`Attempting to buy: ${item.name} +${item?.level ?? 0}`);
            parent.socket.emit("sbuy", { rid: item.rid });
        });
    });
}

function stopPontyScraper() {
    if (pontyScraperTimer != null) {
        clearInterval(pontyScraperTimer);
        pontyScraperTimer = null;
    }
}

export { startPontyScraper, stopPontyScraper };
