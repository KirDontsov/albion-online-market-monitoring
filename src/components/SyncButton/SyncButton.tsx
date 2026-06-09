"use client";
import { FC, useCallback, useEffect } from "react";
import { useEvent, useStore } from "effector-react";
import { Button, Typography } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import {
  $syncStatus,
  $syncLoading,
  syncPricesFx,
  fetchSyncStatusFx,
} from "@/entities/prices";

function formatTimestamp(ts: number | null): string {
  if (!ts) return "Никогда";
  const date = new Date(ts * 1000);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const SyncButton: FC<{ itemIds?: string[] }> = ({ itemIds }) => {
  const syncStatus = useStore($syncStatus);
  const syncLoading = useStore($syncLoading);
  const sync = useEvent(syncPricesFx);
  const fetchStatus = useEvent(fetchSyncStatusFx);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSync = useCallback(() => {
    sync(itemIds);
  }, [sync, itemIds]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap", whiteSpace: "nowrap" }}>
      <Button
        variant="outlined"
        onClick={handleSync}
        disabled={syncLoading || syncStatus.running}
        sx={{ flexShrink: 0 }}
        startIcon={
          <SyncIcon
            sx={{
              animation: syncLoading || syncStatus.running
                ? "spin 1s linear infinite"
                : "none",
              "@keyframes spin": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
              },
            }}
          />
        }
      >
        {syncLoading || syncStatus.running
          ? "Обновление..."
          : "Обновить цены"}
      </Button>
      <Typography variant="body2" sx={{ color: "#8a8ca0", whiteSpace: "nowrap", flexShrink: 0 }}>
        Последнее обновление: {formatTimestamp(syncStatus.last_sync)}
      </Typography>
      {syncStatus.errors > 0 && (
        <Typography variant="body2" sx={{ color: "#f06050", whiteSpace: "nowrap", flexShrink: 0 }}>
          Ошибок: {syncStatus.errors}
        </Typography>
      )}
    </div>
  );
};
