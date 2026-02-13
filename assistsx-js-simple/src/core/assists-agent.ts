// DashScope 完成接口请求/响应类型
const DASHSCOPE_BASE = 'https://dashscope.aliyuncs.com/api/v1/apps';

export interface CompletionInput {
    prompt: string;
    session_id: string;
}

export interface CompletionParameters {
    response_format?: {
        type: 'json_object' | 'text';
    };
}

export interface CompletionRequest {
    input: CompletionInput;
    parameters?: CompletionParameters;
    debug?: Record<string, unknown>;
}

export interface CompletionResponse {
    output?: {
        text?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface AssistsAgentConfig {
    /** DashScope 应用 ID，对应 URL 中的 app 路径 */
    appId: string;
    /** API Key，建议通过环境变量 VITE_DASHSCOPE_API_KEY 注入 */
    apiKey: string;
    /** 可选，覆盖默认 base URL */
    baseUrl?: string;
}

function getDefaultConfig(): AssistsAgentConfig {
    const appId = import.meta.env.VITE_DASHSCOPE_APP_ID ?? '';
    const apiKey = import.meta.env.VITE_DASHSCOPE_API_KEY ?? '';
    return { appId, apiKey };
}

class AssistsAgent {
    private config: AssistsAgentConfig;

    constructor(config?: Partial<AssistsAgentConfig>) {
        this.config = { ...getDefaultConfig(), ...config };
    }

    /**
     * 调用 DashScope 应用完成接口
     * @param input - prompt 与 session_id
     * @param parameters - 可选参数，如 response_format
     * @returns 接口响应
     */
    async completion(
        input: CompletionInput,
        parameters?: CompletionParameters
    ): Promise<CompletionResponse> {
        const { appId, apiKey, baseUrl } = this.config;
        if (!appId || !apiKey) {
            throw new Error(
                'AssistsAgent: appId and apiKey are required. Set VITE_DASHSCOPE_APP_ID and VITE_DASHSCOPE_API_KEY or pass config in constructor.'
            );
        }

        const url = `${baseUrl ?? DASHSCOPE_BASE}/${appId}/completion`;
        const body: CompletionRequest = {
            input,
            parameters: parameters ?? {
                response_format: { type: 'json_object' },
            },
            debug: {},
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`AssistsAgent completion failed: ${res.status} ${res.statusText}. ${text}`);
        }

        return (await res.json()) as CompletionResponse;
    }
}

export const assistsAgent = new AssistsAgent();
