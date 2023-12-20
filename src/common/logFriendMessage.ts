import {
    CodeMessageHandler,
    attachCodeMessageHandler,
    detachCodeMessageHandler,
} from "../eventHandlers";
import { isFriend } from "../util";

const friendMessageLogger: CodeMessageHandler = (from, message) => {
    if (isFriend(from)) {
        safe_log(message);
    }
};

function startFriendMessageLogger() {
    attachCodeMessageHandler(friendMessageLogger);
}

function stopFriendMessageLogger() {
    detachCodeMessageHandler(friendMessageLogger);
}

export { startFriendMessageLogger, stopFriendMessageLogger };
