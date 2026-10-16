import type { C4DataSource } from "@/lib/data-source";
import { fixtureDataSource } from "@/lib/fixtures";

/** Punto único de cambio: en C4-006 se sustituye por el cliente HTTP de /api/v1. */
export const dataSource: C4DataSource = fixtureDataSource;
