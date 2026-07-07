
export interface LastMessage {
    id: number;
    author_id: number;
    value: string;
    sent_at: string;
}

export interface ConversationSummary {
    id: number;
    lastname: string;
    firstname: string;
    id_status: number;
    is_blocked: boolean;
    avatar_link: string;
    conversation_id: number | null;
    last_message: LastMessage | null;
    online_status: boolean;
}

export interface ConversationsResponse {
    conversation_summary: ConversationSummary[];
}