// ============================================================================
// Centralized Dashboard Activity Notification Service
// ----------------------------------------------------------------------------
// Tracks real dashboard activities (document creation, exports, AI edits,
// manual saves, duplicates, deletions, Brand Kit updates, Company Profile
// updates) in localStorage and broadcasts live updates via CustomEvent so
// DashboardHeader stays in real-time sync with user actions.
// ============================================================================

const STORAGE_KEY = "ahiia_dashboard_notifications";
const MAX_NOTIFICATIONS = 25;

export const NOTIFICATION_EVENT = "ahiia:notifications-changed";

function safeReadStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteStorage(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage quota errors
  }
}

function broadcast(items) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(NOTIFICATION_EVENT, { detail: items })
  );
}

/**
 * Retrieve all stored activity notifications (newest first).
 */
export function getNotifications() {
  return safeReadStorage();
}

/**
 * Push a new real dashboard activity notification.
 * @param {Object} item
 * @param {string} item.title - Short headline (e.g. "Document Created")
 * @param {string} item.message - Descriptive detail (e.g. '"Hotel Du Milano Proposal" is ready in your workspace.')
 * @param {"document_created"|"document_exported"|"document_saved"|"ai_edit"|"brand_kit"|"profile_updated"|"document_duplicated"|"document_deleted"} [item.type]
 * @param {string} [item.link] - Optional route to navigate when clicked (e.g. "/dashboard/documents/123")
 * @param {string} [item.dedupeKey] - Optional key to coalesce rapid duplicate events within 60s
 */
export function pushNotification({
  title,
  message,
  type = "document_created",
  link = null,
  dedupeKey = null,
}) {
  if (!title && !message) return [];

  const current = safeReadStorage();
  const now = Date.now();

  // Coalesce rapid identical events (e.g. autosaves on the same document within 60 seconds)
  if (dedupeKey) {
    const recentIdx = current.findIndex(
      (n) => n.dedupeKey === dedupeKey && now - (n.createdAt || 0) < 60000
    );
    if (recentIdx !== -1) {
      const updatedItem = {
        ...current[recentIdx],
        title,
        message,
        type,
        link: link ?? current[recentIdx].link,
        createdAt: now,
        read: false,
      };
      const next = [
        updatedItem,
        ...current.filter((_, idx) => idx !== recentIdx),
      ].slice(0, MAX_NOTIFICATIONS);
      safeWriteStorage(next);
      broadcast(next);
      return next;
    }
  }

  const newEntry = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `notif-${now}-${Math.random().toString(36).slice(2, 8)}`,
    title: title || "Dashboard Activity",
    message: message || "",
    type,
    link,
    dedupeKey,
    createdAt: now,
    read: false,
  };

  const next = [newEntry, ...current].slice(0, MAX_NOTIFICATIONS);
  safeWriteStorage(next);
  broadcast(next);
  return next;
}

/**
 * Mark a single notification as read.
 */
export function markNotificationRead(id) {
  const current = safeReadStorage();
  const next = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  safeWriteStorage(next);
  broadcast(next);
  return next;
}

/**
 * Mark all notifications as read.
 */
export function markAllNotificationsRead() {
  const current = safeReadStorage();
  const next = current.map((n) => ({ ...n, read: true }));
  safeWriteStorage(next);
  broadcast(next);
  return next;
}

/**
 * Remove a single notification by ID.
 */
export function removeNotification(id) {
  const current = safeReadStorage();
  const next = current.filter((n) => n.id !== id);
  safeWriteStorage(next);
  broadcast(next);
  return next;
}

/**
 * Clear all notifications.
 */
export function clearAllNotifications() {
  safeWriteStorage([]);
  broadcast([]);
  return [];
}

/**
 * Format a timestamp into a human-friendly relative time ("Just now", "3m ago", "2h ago").
 */
export function formatNotificationTime(timestamp) {
  if (!timestamp) return "Just now";
  const diffSec = Math.max(0, Math.floor((Date.now() - Number(timestamp)) / 1000));
  if (diffSec < 45) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(Number(timestamp)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
