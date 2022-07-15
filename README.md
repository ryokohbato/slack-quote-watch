# slack-quote-watch
Receive notifications when your posts are quoted in Slack.

![Sample](https://user-images.githubusercontent.com/67552983/176787198-fd75159f-696b-47c6-a8cb-98a2886a985f.png)

## How to Build / Run
1. Create a Slack App. The `App manifest` is as follows:

```yaml
display_information:
  name: quote-watch
features:
  bot_user:
    display_name: quote-watch
    always_online: true
oauth_config:
  scopes:
    user:
      - channels:history
    bot:
      - chat:write
settings:
  event_subscriptions:
    user_events:
      - message.channels
  interactivity:
    is_enabled: true
  org_deploy_enabled: false
  socket_mode_enabled: true
  token_rotation_enabled: false
```

App-Level Tokens are required, so don't forget to generate it. Required scope is `connections:write`.

2. Install to your workspace and invite it to a public channel.
3. Create `.env` file referring to `.env.sample`.
4. Edit `src/config.ts` according to the following table.

| Item         | Description                                    | Format                  |
| ------------ | ---------------------------------------------- | ----------------------- |
| workspaceURL | The URL of Slack workspace.                    | `https://xxx.slack.com` |
| botChannelID | ID of the channel to which the bot is invited. | `C12345ABCDE`           |
| lang         | Language; English (en) or Japanese (jp)        | `en` (or `jp`)          |
| includeBot   | Whether to detect quotes by bots as well       | `true` or `false`       |

5. `yarn install` and `yarn run build`.
6. Run `node dist/main.js`.

## Feature

Developed using [Bolt (Slack)](https://github.com/slackapi/bolt-js).
Since it works using socket mode, it does not require an HTTPS connection environment and only requires a server.
