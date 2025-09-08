import chalk from "chalk";
import { drizzle } from "drizzle-orm/node-postgres";
import { env, isProd } from "../lib/env";
import Logger from "../lib/logger";

export const db = drizzle(env.DRIZZLE_DATABASE_URL, {
    logger: isProd
        ? undefined
        : {
              logQuery(query: string, params: unknown[]) {
                  Logger.debug(
                      `${chalk.gray(
                          "[Drizzle Query]"
                      )} Query: ${query} | Params: ${JSON.stringify(
                          params,
                          null,
                          2
                      )}`
                  );
              },
          },
});
