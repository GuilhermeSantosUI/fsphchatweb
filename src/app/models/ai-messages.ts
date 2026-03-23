import type { InferUITools, UIMessage } from "ai";
import type { toolSet } from "@/app/utils/tools";

export type AIUIMessage = UIMessage<never, InferUITools<typeof toolSet>>;
