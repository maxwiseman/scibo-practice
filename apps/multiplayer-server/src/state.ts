import { ServerWebSocket } from "bun";

import { storedData } from ".";

export function sendCatchup(
  ws: ServerWebSocket<{
    username: string;
    room: string;
  }>,
) {
  const currentChannelData = storedData[ws.data.room];
  if (!currentChannelData) {
    ws.close(1011, "Couldn't find room!");
    return;
  }

  ws.send(
    `${currentChannelData.users.length > 0 ? currentChannelData?.users.map((i) => i.username).join(", ") : "Nobody"} is here`,
  );
  currentChannelData?.messages.forEach((msg) => {
    ws.send(msg);
  });
}
