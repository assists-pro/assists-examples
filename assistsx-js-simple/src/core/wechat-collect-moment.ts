import { NodeClassValue, Step } from "assistsx-js";
import { log, clearLogs } from "../logging/app-log";
import { wechatEnter } from "./wechat-enter";

class WechatCollectMoment {
    /** 点击「朋友圈」后的步骤，可由点赞流程替换 */
    private afterEnterMoment: (step: Step) => Promise<Step | undefined>;

    constructor() {
        this.afterEnterMoment = this.collectMoment.bind(this)
    }

    setAfterEnterMoment(fn: (step: Step) => Promise<Step | undefined>): void {
        this.afterEnterMoment = fn
    }

    start = (): void => {
        clearLogs()
        this.afterEnterMoment = this.collectMoment.bind(this)
        Step.run(wechatEnter.launchWechat, {
            data: { COLLECT_MOMENT: true },
            delayMs: 1000,
        }).then(() => {
            log('执行结束')
        }).catch((error) => {
            log('执行失败：' + error)
        })
    };

    /** 发现 → 朋友圈入口；由 wechatEnter.checkMain 根据 COLLECT_MOMENT 分发 */
    switchDiscover = async (step: Step): Promise<Step | undefined> => {
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

        const meNode = bottomBarNode.findByTags(NodeClassValue.TextView, { filterText: "发现", filterViewId: "com.tencent.mm:id/icon_tv", })[0];
        const result = meNode.findFirstParentClickable().click();
        if (result) {
            log('点击"发现"')
        } else {
            log('点击"发现"失败')
        }
        return step.next(this.enterMoment.bind(this))
    };

    private enterMoment = async (step: Step): Promise<Step | undefined> => {

        const result = step.findById("com.tencent.mm:id/m7k")[0].click();
        if (result) {
            log('点击"朋友圈"')
        } else {
            log('点击"朋友圈"失败')
        }

        return step.next((s) => this.afterEnterMoment(s))
    };

    private collectMoment = async (step: Step): Promise<Step | undefined> => {
        const listNode = step.findById("com.tencent.mm:id/hbs")[0]

        const children = listNode.getChildren()

        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            if (child.className === NodeClassValue.LinearLayout) {
                const nicknameNode = child.findById("com.tencent.mm:id/kbq")[0]

                const nickname = nicknameNode.text
                log("昵称：" + nickname)

                const nodes = child.getNodes()
                let text: string = ""
                for (let j = 0; j < nodes.length; j++) {
                    const node = nodes[j]
                    if (node.className == NodeClassValue.TextView) {
                        text = text + "\n" + node.text
                    }
                }

                log(text.trim() || "(no text)")

                await step.delay(1000)
            }
        }

        if (step.repeatCount < 3) {
            listNode.scrollForward()
            log('翻页')
            return step.repeat()
        }
        return undefined
    };
}

export const wechatCollectMoment = new WechatCollectMoment()
