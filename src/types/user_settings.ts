import {Timestamp} from 'firebase/firestore';
import {NotificationSettings} from "./notification_settings.ts";
import {ThemeSettings} from "./theme_settings.ts";

/**
 * UserSettings entity - personal preferences per user
 */
export interface UserSettings {
    userId: string; // Document ID
    updatedAt: Timestamp;
    notifications?: NotificationSettings;
    theme?: ThemeSettings;
    language?: string;
    defaultView?: 'list' | 'calendar' | 'kanban';
    sortPreference?: 'dueDate' | 'priority' | 'createdAt' | 'category' | 'group';
    showCompletedTodos?: boolean;
}
