import type { C4DataSource } from "@/lib/data-source";
import { fixtureDataSource } from "@/lib/fixtures";
import { createHttpDataSource } from "@/lib/http-data-source";

/** Punto único de cambio: en C4-006 se sustituye por el cliente HTTP de /api/v1. */
export const dataMode = process.env.C4_DATA_MODE === "demo" ? "demo" : "api";
export const dataSource: C4DataSource = dataMode === "demo" ? fixtureDataSource : createHttpDataSource(process.env.C4_API_URL ?? "http://127.0.0.1:8000");
