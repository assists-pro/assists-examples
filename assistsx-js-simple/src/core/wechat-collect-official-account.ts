import { NodeClassValue, Step } from "assistsx-js";
import { log, clearLogs } from "../logging/app-log";
import { wechatEnter } from "./wechat-enter";

class WechatCollectOfficialAccount {
    readonly officialAccountList: string[] = [];

    start = (): void => {
        clearLogs()
        Step.run(wechatEnter.launchWechat, {
            data: { COLLECT_OFFICIAL_ACCOUNT: true },
            delayMs: 1000,
        }).then(() => {
            log('执行结束')
        }).catch((error) => {
            log('执行失败：' + error)
        })
    };

    /** 通讯录 → 公众号；由 wechatEnter.checkMain 根据 COLLECT_OFFICIAL_ACCOUNT 分发 */
    switchContacts = async (step: Step): Promise<Step | undefined> => {
        const packageName = step.getPackageName();
        if (packageName !== wechatEnter.wechatPackageName) {
            log('微信打开失败')
            return undefined
        }

        const bottomBarNode = step.findByTags(NodeClassValue.RelativeLayout, { filterViewId: "com.tencent.mm:id/huj" })[0];
        if (!bottomBarNode) {
            log('微信底部栏未找到，尝试返回重试')
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
        return step.next(this.enterOfficialAccount.bind(this))
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
        const officialAccountNode = step.findById("com.tencent.mm:id/sct", { filterText: "公众号" })[0]
        if (!officialAccountNode) {
            log('未找到公众号入口')
            return undefined
        }
        const clickResult = officialAccountNode.findFirstParentClickable().click();
        if (clickResult) {
            log('点击"公众号"')
        } else {
            log('点击"公众号"失败')
        }
        this.officialAccountList.length = 0
        return step.next(this.collectOfficialAccounts.bind(this))
    };

    private collectOfficialAccounts = async (step: Step): Promise<Step | undefined> => {

        const listNode = step.findById("com.tencent.mm:id/i3y", { filterClass: "android.widget.ListView" })[0]
        const nodes = listNode.getChildren()
        for (let i = 0; i < nodes.length; i++) {
            const child = nodes[i]
            if (child.className != NodeClassValue.LinearLayout) {
                continue
            }
            const name = child.findById("com.tencent.mm:id/awx")[0].text
            log(`公众号:${name}`)
            if (this.officialAccountList.includes(name)) {
                continue
            }
            this.officialAccountList.push(name)
        }
        await step.delay(500)
        const result = listNode.scrollForward()
        if (result) {
            log('滚动列表')
            return step.repeat()
        } else {
            log('列表已滚动到底部')
            window.location.hash = '#/unfollow-official-account'
        }
        return undefined
    };
}

export const wechatCollectOfficialAccount = new WechatCollectOfficialAccount()
