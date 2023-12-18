import { FRIENDS_LIST } from "../constants";
import {
    CodeMessageHandler,
    attachCodeMessageHandler,
    detachCodeMessageHandler,
} from "../eventHandlers";

const friendMessageLogger: CodeMessageHandler = (m) => {
    if (FRIENDS_LIST.includes(m.name)) {
        safe_log(m);
    }
};

function startFriendMessageLogger() {
    attachCodeMessageHandler(friendMessageLogger);
}

function stopFriendMessageLogger() {
    detachCodeMessageHandler(friendMessageLogger);
}

export { startFriendMessageLogger, stopFriendMessageLogger };
