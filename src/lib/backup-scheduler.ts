import { ensureBackupConfig, runDueBackups } from "@/lib/backups";

const globalForBackupScheduler = globalThis as unknown as {
  backupSchedulerStarted?: boolean;
  backupSchedulerTimer?: NodeJS.Timeout;
};

async function scheduleNext() {
  const backupConfig = await ensureBackupConfig();
  const minutes = Math.max(1, backupConfig.schedulerIntervalMinutes);
  globalForBackupScheduler.backupSchedulerTimer = setTimeout(
    async () => {
      try {
        await runDueBackups();
      } catch (error) {
        console.error("Backup scheduler tick failed:", error);
      } finally {
        await scheduleNext().catch((error) => {
          console.error("Backup scheduler reschedule failed:", error);
        });
      }
    },
    minutes * 60 * 1000,
  );
  globalForBackupScheduler.backupSchedulerTimer.unref?.();
}

export async function startBackupScheduler() {
  if (globalForBackupScheduler.backupSchedulerStarted) return;
  globalForBackupScheduler.backupSchedulerStarted = true;

  try {
    await runDueBackups();
  } catch (error) {
    console.error("Initial backup scheduler run failed:", error);
  }

  await scheduleNext();
}
