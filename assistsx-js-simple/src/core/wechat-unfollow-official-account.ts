import { NodeClassValue, Step } from "assistsx-js";
import { log, clearLogs } from "../logging/app-log";
import { wechatEnter } from "./wechat-enter";

class WechatUnfollowOfficialAccount {
    private accountsToUnfollow: string[] = [];

    /** 由 wechatEnter.checkMain 在分发 switchContacts 前调用 */
    assignAccounts(accounts: string[]): void {
        this.accountsToUnfollow = [...accounts];
    }

    start = (accounts: string[]): void => {
        clearLogs()
        Step.run(wechatEnter.launchWechat, {
            data: {
                UNFOLLOW_OFFICIAL_ACCOUNT: true,
                unfollowAccounts: [...accounts],
            },
            delayMs: 1000,
        }).then(() => {
            log('执行结束')
        }).catch((error) => {
            log('执行失败：' + error)
        })
    };

    /** 通讯录 → 公众号；由 wechatEnter.checkMain 根据 UNFOLLOW_OFFICIAL_ACCOUNT 分发 */
    switchContacts = async (step: Step): Promise<Step | undefined> => {
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

        const targetNode = bottomBarNode.findByTags(NodeClassValue.TextView, { filterText: "通讯录", filterViewId: "com.tencent.mm:id/icon_tv", })[0];
        const result = targetNode.findFirstParentClickable().click();
        if (result) {
            log('点击"通讯录"')
        } else {
            log('点击"通讯录"失败')
        }
        return step.next(this.enterOfficialAccount)
    };


    private enterOfficialAccount = async (step: Step): Promise<Step | undefined> => {

        const titleContactsNodes = step.findById("android:id/text1")
        for (let i = 0; i < titleContactsNodes.length; i++) {
            const titleContactsNode = titleContactsNodes[i]
            if (titleContactsNode.text === "通讯录") {
                await titleContactsNode.doubleClickNodeByGesture({ clickInterval: 150 })
                break
            }
        }
        await step.delay(1000)
        const clickResult = step.findById("com.tencent.mm:id/sct", { filterText: "公众号" })[0].findFirstParentClickable().click();
        if (clickResult) {
            log('点击"公众号"')
        } else {
            log('点击"公众号"失败')
        }

        return step.next(this.enterOfficialAccountConversation)
    };

    private enterOfficialAccountConversation = async (step: Step): Promise<Step | undefined> => {
        const listNode = step.findById("com.tencent.mm:id/i3y", { filterClass: "android.widget.ListView" })[0]
        const nodes = listNode.getChildren()
        for (let i = 0; i < nodes.length; i++) {
            const child = nodes[i]
            if (child.className != NodeClassValue.LinearLayout) {
                continue
            }
            const name = child.findById("com.tencent.mm:id/awx")[0].text
            if (this.accountsToUnfollow.includes(name)) {
                await child.clickNodeByGesture()
                log(`点击公众号:${name}`)
                this.accountsToUnfollow.splice(this.accountsToUnfollow.indexOf(name), 1)
                return step.next(this.enterOfficialAccountProfile)
            }
        }
        return undefined
    };

    private enterOfficialAccountProfile = async (step: Step): Promise<Step | undefined> => {
        step.findById("com.tencent.mm:id/fq")[0].click()
        log('点击"设置"')
        return step.next(this.clickUnfollowOfficialAccount)
    };

    private clickUnfollowOfficialAccount = async (step: Step): Promise<Step | undefined> => {
        step.findById("com.tencent.mm:id/anv")[0].click()
        log('点击"已关注公众号"')
        return step.next(this.clickUnfollowOfficialAccountConfirm)
    };

    private clickUnfollowOfficialAccountConfirm = async (step: Step): Promise<Step | undefined> => {
        step.findById("com.tencent.mm:id/mm_alert_ok_btn")[0].click()
        log('点击"不再关注"')
        return step.next(this.checkUnfollowOfficialAccountSuccess)
    };

    private checkUnfollowOfficialAccountSuccess = async (step: Step): Promise<Step | undefined> => {

        const waitNode = step.findById("com.tencent.mm:id/jma", { filterText: "请稍候..." })[0]
        if (waitNode) {
            log('请稍候...')
            return step.repeat()
        }
        const followNode = step.findById("com.tencent.mm:id/anv")[0]
        if (!followNode) {
            log('已取消关注')
        }
        return step.next(this.backOfficialAccountsList)
    };

    private backOfficialAccountsList = async (step: Step): Promise<Step | undefined> => {

        const listNode = step.findById("com.tencent.mm:id/i3y", { filterClass: "android.widget.ListView" })[0]
        if (listNode) {
            return step.next(this.enterOfficialAccountConversation)
        } else {
            step.back()
            return step.repeat()
        }

    };
}

export const wechatUnfollowOfficialAccount = new WechatUnfollowOfficialAccount()
