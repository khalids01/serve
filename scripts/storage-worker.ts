import "dotenv/config";
import { startStorageWorker } from "../src/lib/storage/jobs";

startStorageWorker();
// The app starts the same worker automatically; this command also supports a dedicated process.
setInterval(() => {}, 60000);
