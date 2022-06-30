import type { Lang } from "./vocabulary";

interface Config {
  workspaceURL: string;
  botChannelID: string;
  lang: Lang;
  includeBot: boolean;
}

const config: Config = {
  // Remove the trailing slash
  workspaceURL: "https://kmc-jp.slack.com",
  // Channel where the bot posts messages
  botChannelID: "C03MU9UCPRT",
  // "en" or "jp"
  lang: "jp",
  includeBot: false,
};

export default config;
