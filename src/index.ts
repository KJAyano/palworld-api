import axios, { AxiosInstance, AxiosError } from "axios";

export interface ErrorResult {
  error: string;
}

export type ApiResult<T> = T | ErrorResult;

export interface ServerInfo {
  version: string;
  servername: string;
  description: string;
  worldguid: string;
}

export interface PlayerInfo {
  name: string;
  accountName: string;
  playerId: string;
  userId: string;
  ip: string;
  ping: number;
  location_x: number;
  location_y: number;
  level: number;
  building_count: number;
}

export interface PlayerListResponse {
  players: PlayerInfo[];
}

export interface ServerMetrics {
  serverfps: number;
  currentplayernum: number;
  serverframetime: number;
  maxplayernum: number;
  uptime: number;
  basecampnum: number;
  days: number;
}

export interface ServerSettings {
  Difficulty: string;
  DayTimeSpeedRate: number;
  NightTimeSpeedRate: number;
  ExpRate: number;
  PalCaptureRate: number;
  PalSpawnNumRate: number;
  PalDamageRateAttack: number;
  PalDamageRateDefense: number;
  PlayerDamageRateAttack: number;
  PlayerDamageRateDefense: number;
  PlayerStomachDecreaceRate: number;
  PlayerStaminaDecreaceRate: number;
  PlayerAutoHPRegeneRate: number;
  PlayerAutoHpRegeneRateInSleep: number;
  PalStomachDecreaceRate: number;
  PalStaminaDecreaceRate: number;
  PalAutoHPRegeneRate: number;
  PalAutoHpRegeneRateInSleep: number;
  BuildObjectDamageRate: number;
  BuildObjectDeteriorationDamageRate: number;
  CollectionDropRate: number;
  CollectionObjectHpRate: number;
  CollectionObjectRespawnSpeedRate: number;
  EnemyDropItemRate: number;
  DeathPenalty: string;
  bEnablePlayerToPlayerDamage: boolean;
  bEnableFriendlyFire: boolean;
  bEnableInvaderEnemy: boolean;
  bActiveUNKO: boolean;
  bEnableAimAssistPad: boolean;
  bEnableAimAssistKeyboard: boolean;
  DropItemMaxNum: number;
  DropItemMaxNum_UNKO: number;
  BaseCampMaxNum: number;
  BaseCampWorkerMaxNum: number;
  DropItemAliveMaxHours: number;
  bAutoResetGuildNoOnlinePlayers: boolean;
  AutoResetGuildTimeNoOnlinePlayers: number;
  GuildPlayerMaxNum: number;
  PalEggDefaultHatchingTime: number;
  WorkSpeedRate: number;
  bIsMultiplay: boolean;
  bIsPvP: boolean;
  bCanPickupOtherGuildDeathPenaltyDrop: boolean;
  bEnableNonLoginPenalty: boolean;
  bEnableFastTravel: boolean;
  bIsStartLocationSelectByMap: boolean;
  bExistPlayerAfterLogout: boolean;
  bEnableDefenseOtherGuildPlayer: boolean;
  CoopPlayerMaxNum: number;
  ServerPlayerMaxNum: number;
  ServerName: string;
  ServerDescription: string;
  PublicPort: number;
  PublicIP: string;
  RCONEnabled: boolean;
  RCONPort: number;
  Region: string;
  bUseAuth: boolean;
  BanListURL: string;
  RESTAPIEnabled: boolean;
  RESTAPIPort: number;
  bShowPlayerList: boolean;
  AllowConnectPlatform: string;
  bIsUseBackupSaveData: boolean;
  LogFormatType: string;
}

export class PalworldAPI {
  private serverUrl: string;
  private client: AxiosInstance;

  constructor(serverUrl: string, password: string, username: string = "admin", timeoutMs?: number) {
    this.serverUrl = serverUrl;
    const token = Buffer.from(`${username}:${password}`).toString("base64");
    this.client = axios.create({
      baseURL: serverUrl,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: timeoutMs,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
    });
  }

  private toErrorResult(error: unknown): ErrorResult {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT") {
        return { error: "Request timeout" };
      }
      if (axiosError.response) {
        return {
          error: `Client error ${axiosError.response.status}: ${axiosError.response.statusText}`,
        };
      }
      if (axiosError.request) {
        return { error: "Connection error" };
      }
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: String(error) };
  }

  async fetch<T>(endpoint: string): Promise<ApiResult<T>> {
    try {
      const response = await this.client.get<T>(endpoint);
      return response.data as ApiResult<T>;
    } catch (error) {
      return this.toErrorResult(error);
    }
  }

  async post<T>(endpoint: string, payload?: Record<string, unknown>): Promise<ApiResult<T>> {
    try {
      const response = await this.client.post<T>(endpoint, payload ?? {});
      return response.data as ApiResult<T>;
    } catch (error) {
      return this.toErrorResult(error);
    }
  }

  async getServerInfo(): Promise<ApiResult<ServerInfo>> {
    return this.fetch<ServerInfo>("/v1/api/info");
  }

  async getPlayerList(): Promise<ApiResult<PlayerListResponse>> {
    return this.fetch<PlayerListResponse>("/v1/api/players");
  }

  async getServerMetrics(): Promise<ApiResult<ServerMetrics>> {
    return this.fetch<ServerMetrics>("/v1/api/metrics");
  }

  async getServerSettings(): Promise<ApiResult<ServerSettings>> {
    return this.fetch<ServerSettings>("/v1/api/settings");
  }

  async kickPlayer(userid: string, message: string): Promise<ApiResult<unknown>> {
    return this.post("/v1/api/kick", { userid, message });
  }

  async banPlayer(userid: string, message: string): Promise<ApiResult<unknown>> {
    return this.post("/v1/api/ban", { userid, message });
  }

  async unbanPlayer(userid: string): Promise<ApiResult<unknown>> {
    return this.post("/v1/api/unban", { userid });
  }

  async saveServerState(): Promise<ApiResult<unknown>> {
    return this.post("/v1/api/save");
  }

  async makeAnnouncement(message: string): Promise<ApiResult<unknown>> {
    return this.post("/v1/api/announce", { message });
  }

  async shutdownServer(waittime: number, message: string): Promise<ApiResult<unknown>> {
    return this.post("/v1/api/shutdown", { waittime, message });
  }

  async stopServer(): Promise<ApiResult<unknown>> {
    return this.post("/v1/api/stop");
  }
}

export default PalworldAPI;
