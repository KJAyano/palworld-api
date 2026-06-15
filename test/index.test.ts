import { PalworldAPI, ErrorResult, PlayerInfo } from "../src/index";

const SERVER_URL = "http://localhost:8212";
const USERNAME = "admin";
const PASSWORD = "test-password"; 

const TEST_USER_ID = "test_user_id_here"; // Put userid here
const TEST_KICK_MESSAGE = "Integration test kick";
const TEST_BAN_MESSAGE = "Integration test ban";
const TEST_ANNOUNCEMENT_MESSAGE = "Integration test announcement";

const api = new PalworldAPI(SERVER_URL, PASSWORD, USERNAME, 10000);

function isErrorResult(value: unknown): value is ErrorResult {
  return typeof value === "object" && value !== null && "error" in value;
}

describe("PalworldAPI live integration tests", () => {
  describe("getServerInfo", () => {
    test("returns real server info", async () => {
      const result = await api.getServerInfo();

      console.log("getServerInfo result:", result);

      expect(isErrorResult(result)).toBe(false);
      if (!isErrorResult(result)) {
        expect(typeof result.version).toBe("string");
        expect(typeof result.servername).toBe("string");
      }
    });
  });

  describe("getPlayerList", () => {
    test("returns real player list", async () => {
      const result = await api.getPlayerList();

      console.log("getPlayerList result:", result);

      expect(isErrorResult(result)).toBe(false);
      if (!isErrorResult(result)) {
        expect(Array.isArray(result.players)).toBe(true);
        if (result.players.length > 0) {
          const player: PlayerInfo = result.players[0];
          expect(typeof player.userId).toBe("string");
          expect(typeof player.name).toBe("string");
        }
      }
    });
  });

  describe("getServerMetrics", () => {
    test("returns real server metrics", async () => {
      const result = await api.getServerMetrics();

      console.log("getServerMetrics result:", result);

      expect(isErrorResult(result)).toBe(false);
      if (!isErrorResult(result)) {
        expect(typeof result.serverfps).toBe("number");
        expect(typeof result.currentplayernum).toBe("number");
        expect(typeof result.maxplayernum).toBe("number");
      }
    });
  });

  describe("getServerSettings", () => {
    test("returns real server settings", async () => {
      const result = await api.getServerSettings();

      console.log("getServerSettings result:", result);

      expect(isErrorResult(result)).toBe(false);
      if (!isErrorResult(result)) {
        expect(typeof result.ServerName).toBe("string");
        expect(typeof result.ServerPlayerMaxNum).toBe("number");
      }
    });
  });

  describe("makeAnnouncement", () => {
    test("sends a real announcement to the server", async () => {
      const result = await api.makeAnnouncement(TEST_ANNOUNCEMENT_MESSAGE);

      console.log("makeAnnouncement result:", result);

      expect(isErrorResult(result)).toBe(false);
    });
  });

  describe("kickPlayer", () => {
    test("kicks a connected player by userid", async () => {
      const result = await api.kickPlayer(TEST_USER_ID, TEST_KICK_MESSAGE);

      console.log("kickPlayer result:", result);

      expect(isErrorResult(result)).toBe(false);
    });

    test("returns error result when kicking a non-existent userid", async () => {
      const result = await api.kickPlayer("steam_99999999999999999", TEST_KICK_MESSAGE);

      console.log("kickPlayer (non-existent) result:", result);

      expect(isErrorResult(result)).toBe(true);
    });
  });

  describe("banPlayer", () => {
    test("bans a player by userid", async () => {
      const result = await api.banPlayer(TEST_USER_ID, TEST_BAN_MESSAGE);

      console.log("banPlayer result:", result);

      expect(isErrorResult(result)).toBe(false);
    });
  });

  describe("unbanPlayer", () => {
    test("unbans a previously banned player by userid", async () => {
      const result = await api.unbanPlayer(TEST_USER_ID);

      console.log("unbanPlayer result:", result);

      expect(isErrorResult(result)).toBe(false);
    });

    test("returns success even when unbanning a userid that was never banned", async () => {
      const result = await api.unbanPlayer("steam_99999999999999999");

      console.log("unbanPlayer (never banned) result:", result);

      expect(isErrorResult(result)).toBe(false);
    });
  });

  describe("saveServerState", () => {
    test("triggers a real server save", async () => {
      const result = await api.saveServerState();

      console.log("saveServerState result:", result);

      expect(isErrorResult(result)).toBe(false);
    });
  });

  describe("authentication failure", () => {
    test("returns error result when password is wrong", async () => {
      const badApi = new PalworldAPI(SERVER_URL, "definitely-wrong-password", USERNAME, 10000);
      const result = await badApi.getServerInfo();

      console.log("auth failure result:", result);

      expect(isErrorResult(result)).toBe(true);
      if (isErrorResult(result)) {
        expect(result.error).toContain("401");
      }
    });
  });

  describe("connection failure", () => {
    test("returns error result when server is unreachable", async () => {
      const unreachableApi = new PalworldAPI("http://localhost:9999", PASSWORD, USERNAME, 3000);
      const result = await unreachableApi.getServerInfo();

      console.log("connection failure result:", result);

      expect(isErrorResult(result)).toBe(true);
    });
  });

  // Run shutdownServer and stopServer LAST and only when intentionally testing
  // server lifecycle, since these will take your server offline.
  describe.skip("shutdownServer", () => {
    test("shuts down the server with a delay and message", async () => {
      const result = await api.shutdownServer(30, "Integration test shutdown");

      console.log("shutdownServer result:", result);

      expect(isErrorResult(result)).toBe(false);
    });
  });

  describe.skip("stopServer", () => {
    test("stops the server immediately", async () => {
      const result = await api.stopServer();

      console.log("stopServer result:", result);

      expect(isErrorResult(result)).toBe(false);
    });
  });
});
