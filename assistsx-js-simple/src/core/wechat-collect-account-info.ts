import { NodeClassValue, Step } from "assistsx-js";
import { log, clearLogs } from "../logging/app-log";
import { wechatEnter } from "./wechat-enter";

class WechatCollectAccountInfo {
    start = async (): Promise<void> => {
        clearLogs()
        try {
            await Step.run(wechatEnter.launchWechat, { data: { COLLECT_ACCOUNT_INFO: true } })
            log('执行结束')
        } catch (error) {
            log('执行失败：' + error)
        }
    };

    switchMe = async (step: Step): Promise<Step | undefined> => {
        const packageName = step.getPackageName();
        if (packageName !== wechatEnter.wechatPackageName) {
            log('WX打开失败')
            return undefined
        }

        const bottomBarNode = step.findByTags(NodeClassValue.RelativeLayout, { filterViewId: "com.tencent.mm:id/huj" })[0];
        if (!bottomBarNode) {
            log('WX底部栏未找到，尝试返回重试')
            step.back();
            return step.repeat()
        }

        const meNode = bottomBarNode.findByTags(NodeClassValue.TextView, { filterText: "我", filterViewId: "com.tencent.mm:id/icon_tv", })[0];
        const result = meNode.findFirstParentClickable().click();
        if (result) {
            log('点击"我"')
        } else {
            log('点击"我"失败')
        }
        return step.next(this.collectAccountInfo)
    };

    private collectAccountInfo = async (step: Step): Promise<Step | undefined> => {
        const accountNode = step.findById("com.tencent.mm:id/gxv")[0]

        const nickName = accountNode.findById("com.tencent.mm:id/kbb")[0].text
        log("昵称：" + nickName)

        const wechatNo = accountNode.findById("com.tencent.mm:id/ouv")[0].text;
        log(wechatNo)

        // await accountNode.findById("com.tencent.mm:id/a_4")[0].takeScreenshot()
        // log("Avatar screenshot captured")

        return undefined
    };
}

export const wechatCollectAccountInfo = new WechatCollectAccountInfo()
