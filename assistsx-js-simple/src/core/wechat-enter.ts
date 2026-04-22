import { NodeClassValue, Step, StepImpl, StepResult } from "assistsx-js";
import { log } from "../logging/app-log";
import { wechatCollectAccountInfo } from "./wechat-collect-account-info";
import { wechatCollectMoment } from "./wechat-collect-moment";
import { wechatCollectOfficialAccount } from "./wechat-collect-official-account";
import { wechatUnfollowOfficialAccount } from "./wechat-unfollow-official-account";
import { wxMomentLike } from "./wx-moment-like";

/** Step.run data 中与WX自动化入口对应的字段（与各模块 start 传入一致） */
export interface WechatStepData {
    COLLECT_ACCOUNT_INFO?: boolean;
    MOMENT_LIKE?: boolean;
    COLLECT_OFFICIAL_ACCOUNT?: boolean;
    UNFOLLOW_OFFICIAL_ACCOUNT?: boolean;
    unfollowAccounts?: string[];
}

class WechatEnter {
    readonly wechatPackageName = "com.tencent.mm";

    launchWechat = async (step: Step): Promise<Step | undefined> => {
        log('开始执行')
        await step.delay(1000)
        step.launchApp(this.wechatPackageName);
        log('启动WX')
        return step.next(this.checkDoubleWechatOpen)
    };
    private checkDoubleWechatOpen: StepImpl = async (step: Step): Promise<StepResult> => {
        log('检查WX双开')
        const node = step.findById("com.miui.securitycore:id/app1");
        if (node[0]) {
            node[0].click();
            log('WX双开，选择WX1')
            return step.next(async (step) => await this.checkMain(step), {
                delayMs: 1000,
            })
        }
        return step.next(this.checkMain)
    };

    private checkMain = async (step: Step): Promise<Step | undefined> => {
        const packageName = step.getPackageName();
        if (packageName !== this.wechatPackageName) {

            if (step.repeatCount > 3) {
                log('WX打开失败')
                return undefined
            }

            return step.repeat()
        }

        const bottomBarNode = step.findByTags(NodeClassValue.RelativeLayout, {
            filterViewId: "com.tencent.mm:id/huj",
        })[0];
        if (!bottomBarNode) {
            log('WX底部栏未找到，尝试返回重试')
            step.back();
            return step.repeat()
        }

        const data = step.data as WechatStepData | undefined

        if (data?.COLLECT_ACCOUNT_INFO) {
            data.COLLECT_ACCOUNT_INFO = undefined;
            return step.next(wechatCollectAccountInfo.switchMe)
        }

        if (data?.MOMENT_LIKE) {
            data.MOMENT_LIKE = undefined;
            return step.next(wxMomentLike.switchDiscover)
        }

        if (data?.COLLECT_OFFICIAL_ACCOUNT) {
            data.COLLECT_OFFICIAL_ACCOUNT = undefined;
            return step.next(wechatCollectOfficialAccount.switchContacts)
        }

        if (data?.UNFOLLOW_OFFICIAL_ACCOUNT) {
            const accounts = data.unfollowAccounts
            data.UNFOLLOW_OFFICIAL_ACCOUNT = undefined;
            data.unfollowAccounts = undefined;
            wechatUnfollowOfficialAccount.assignAccounts(Array.isArray(accounts) ? accounts : [])
            return step.next(wechatUnfollowOfficialAccount.switchContacts)
        }

        return undefined
    };
}

export const wechatEnter = new WechatEnter()
