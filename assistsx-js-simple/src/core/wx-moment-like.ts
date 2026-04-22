import { Step } from "assistsx-js";
import { log, clearLogs } from "../logging/app-log";
import { wechatEnter } from "./wechat-enter";
import { wechatCollectMoment } from "./wechat-collect-moment";

class WxMomentLike {
    start = (): void => {
        clearLogs()
        wechatCollectMoment.setAfterEnterMoment(this.likeMomentPosts.bind(this))
        Step.run(wechatEnter.launchWechat, {
            data: { COLLECT_MOMENT: true },
            delayMs: 1000,
        })
            .then(() => {
                log("Finished")
            })
            .catch((error) => {
                log("Failed: " + error)
            })
    };

    private likeMomentPosts = async (
        step: Step,
    ): Promise<Step | undefined> => {
        await step.delay(1200)
        log("Like moments: loading feed")

        const listNode = step.findById("com.tencent.mm:id/hbs")[0]
        if (!listNode) {
            log("Moment list node not found")
            return undefined
        }

        const directLike = step.findByTextAllMatch("赞")[0]
        if (directLike) {
            const clicked = directLike.findFirstParentClickable()?.click()
            if (clicked) {
                log("Tapped Like")
                return undefined
            }
        }

        log(
            "No visible Like button; scroll feed or adjust selectors for your WeChat build",
        )
        return undefined
    };
}

export const wxMomentLike = new WxMomentLike()
