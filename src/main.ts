import "dotenv/config";

import { App } from "@slack/bolt";

import config from "./config";
import vocabulary from "./vocabulary";

const { workspaceURL, botChannelID, lang, includeBot } = config;

// Use socket mode
// Use port 33456, but can be changed by environment variable; SLACK_QUOTE_WATCH_PORT
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  port: Number.parseInt(process.env.SLACK_QUOTE_WATCH_PORT ?? "") || 33456,
});

app.message(async ({ message, client, logger }) => {
  // Only use the `text` property as content
  if (!Object.hasOwn(message, "text")) {
    return;
  }

  // Select message by bot
  // If message.subtype is "bot_message", it is surely a bot message
  // However, some bot messages do not have a subtype property, we also check bot_id property.
  // When both subtype and bot_id property are present, we will accept message only if subtype property does not exist.
  // This is because, messages are sometimes automatically updated by Slack, and in such cases the subtype will be "message_changed" or something.
  // Therefore, only when the subtype property does not exist, the message is processed as a new message.
  if (
    !includeBot &&
    (message.subtype === "bot_message" ||
      (!Object.hasOwn(message, "subtype") && Object.hasOwn(message, "bot_id")))
  ) {
    return;
  }

  const messageText = (message as any).text;

  // Match link text of Slack workspace
  // <link>
  const simpleLinkRegexp = RegExp(
    `<(${workspaceURL.replaceAll(".", "\\.")}/archives/([0-9A-Z]+)/p([0-9]+))>`,
    "g"
  );
  const simpleLinks = messageText.matchAll(simpleLinkRegexp);

  // <link|text>
  const textLinkRegexp = RegExp(
    `<(${workspaceURL.replaceAll(".", "\\.")}/archives/([0-9A-Z]+)/p([0-9]+))\\|.+>`,
    "g"
  );
  const textLinks = messageText.matchAll(textLinkRegexp);

  let matchGroup: {
    link: string;
    channel: string;
    ts: string;
  }[] = [];

  for (const match of [...simpleLinks, ...textLinks]) {
    if (match[1] === undefined || match[2] === undefined || match[3] === undefined) {
      continue;
    }

    // eslint-disable-next-line no-console
    console.log(match);

    matchGroup = [
      ...matchGroup,
      {
        link: match[1],
        channel: match[2],
        ts: `${match[3].substring(0, 10)}.${match[3].substring(10)}`, // 1234567890123456 -> 1234567890.123456
      },
    ];
  }

  // If no matching link is found, nothing will be done
  if (matchGroup.length === 0) {
    return;
  }

  const quotedMessage = await Promise.all(
    matchGroup.map((match) => {
      return client.conversations.replies({
        token: process.env.SLACK_USER_TOKEN,
        channel: match.channel,
        ts: match.ts,
      });
    })
  );

  const postUsers = quotedMessage.map((x) => {
    return x.messages !== undefined ? `<@${x.messages[0]["user"]}>` : "";
  });
  // Remove duplicate IDs and IDs that could not be retrieved
  const postUsersUnique = [...new Set(postUsers.filter((user) => user !== ""))];

  const postMessage =
    postUsersUnique.length !== 0
      ? `${postUsersUnique.join(", ")}${
          vocabulary["'s post was quoted"][lang]
        }\n${workspaceURL}/archives/${message.channel}/p${message.ts.replace(".", "")}`
      : `${vocabulary["The post was cited"][lang]}}\n${workspaceURL}/archives/${
          message.channel
        }/p${message.ts.replace(".", "")}`;

  try {
    await client.chat.postMessage({
      channel: botChannelID,
      text: postMessage,
    });
  } catch (e) {
    logger.error(e);
  }
});

(async () => {
  await app.start();
})();
