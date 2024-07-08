export interface Notification {
    id: number;
    user_id: number;
    message: string;
    read: boolean;
    email_sent: boolean;
    created_at: string;
}