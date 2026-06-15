# palworld-api

TypeScript/Node.js client for the Palworld dedicated server REST API.

## Installation

```bash
npm install palworld-api
```

## Usage

```typescript
import { PalworldAPI } from "palworld-api";

const api = new PalworldAPI("http://localhost:8212", "admin password");

const info = await api.getServerInfo();
console.log(info);

const players = await api.getPlayerList();
console.log(players);

await api.makeAnnouncement("Server restarting in 5 minutes");
await api.kickPlayer("steam_0:12345", "Cheating");
```

All methods return either the parsed response data or an `{ error: string }`
object on failure — no exceptions are thrown.

```typescript
const result = await api.getServerMetrics();
if ("error" in result) {
  console.error(result.error);
} else {
  console.log(result.serverfps);
}
```

## API

- `getServerInfo()`
- `getPlayerList()`
- `getServerMetrics()`
- `getServerSettings()`
- `kickPlayer(userid, message)`
- `banPlayer(userid, message)`
- `unbanPlayer(userid)`
- `saveServerState()`
- `makeAnnouncement(message)`
- `shutdownServer(waittime, message)`
- `stopServer()`

## Development

```bash
npm install
npm run build
```

## Testing

Live integration tests run against a real Palworld dedicated server. Edit
`test/index.test.ts` and set `SERVER_URL`, `USERNAME`, `PASSWORD`, and
`TEST_USER_ID` to match your server, then run:

```bash
npm test
```

`shutdownServer` and `stopServer` tests are skipped by default since they take
the server offline. Remove `.skip` only when intentionally testing shutdown.

## License

MIT

## Author

[KJAyano](https://github.com/KJAyano)

Repository: [github.com/KJAyano/palworld-api](https://github.com/KJAyano/palworld-api)