enum EnvVersion {
    DEV = "develop", // 开发版
    TRIAL = "trial", // 体验版
    RELEASE = "release", // 正式版
}

interface AccountInfo {
    miniProgram: { appId: string; envVersion: EnvVersion; version: string };
}

export class WxAccountInfo {
    private static readonly DEFAULT_VERSION = "1.0.0";
    private static privateVersion: string;

    static get version() {
        return this.privateVersion || this.getVersion();
    }

    private static getVersion(): string {
        try {
            if (uni.getAccountInfoSync) {
                const accontInfo: AccountInfo = (uni.getAccountInfoSync() as unknown) as AccountInfo;
                this.privateVersion =
                    accontInfo.miniProgram.version ||
                    WxAccountInfo.DEFAULT_VERSION;
            } else {
                this.privateVersion = WxAccountInfo.DEFAULT_VERSION;
            }
            return this.privateVersion;
        } catch (e) {
            return this.DEFAULT_VERSION;
        }
    }
}
