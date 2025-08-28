FROM oven/bun:1.2.7-debian AS base

# Used for health checks
RUN apt update
RUN apt install -y curl

# Set the environment
ENV NEXT_PUBLIC_APP_ENV=production

ARG SOURCE_COMMIT
ENV SOURCE_COMMIT=${SOURCE_COMMIT}

# -----------------------------------

# Install dependencies
FROM base AS depends
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile --filter 'web' --filter './'

# Build the web app
RUN bun i -g typescript
RUN bun run --filter 'web' build

# Run the app
FROM base AS runner
WORKDIR /app

# -----------------------------------

COPY --from=depends /app/node_modules ./node_modules

# Copy the built files
COPY --from=depends /main-workspace/apps/web/public ./public
COPY --from=depends /main-workspace/apps/web/.next/standalone/apps/web/ ./
COPY --from=depends /main-workspace/apps/web/.next/static ./.next/static

# Verify the build output
RUN ls -la

# Expose the app port
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Use the correct path to server.js
CMD ["bun", "--bun", "--smol", "server.js"]