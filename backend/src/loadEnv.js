import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the directory where .env files are located (backend root, i.e. parent of src)
const backendRoot = path.resolve(__dirname, "..");

const envPath = process.env.NODE_ENV === "production"
  ? path.resolve(backendRoot, ".env.production")
  : path.resolve(backendRoot, ".env");

dotenv.config({ path: envPath });

// Fallback to default .env if production file doesn't exist or is incomplete
dotenv.config({ path: path.resolve(backendRoot, ".env") });
