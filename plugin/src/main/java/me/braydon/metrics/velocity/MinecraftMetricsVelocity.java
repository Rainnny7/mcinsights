package me.braydon.metrics.velocity;

import com.google.inject.Inject;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.plugin.annotation.DataDirectory;
import com.velocitypowered.api.proxy.ProxyServer;
import lombok.NonNull;
import me.braydon.metrics.common.ConfigOption;
import org.slf4j.Logger;

import java.nio.file.Path;

/**
 * @author Braydon
 */
@Plugin(id = "minecraft-metrics", name = "Minecraft Metrics", version = "0.0.0",
        authors = {"Braydon (Rainnny)"}, url = "https://mcmetrics.xyz",
        description = "Minecraft Metrics is a tool that allows you to track your Minecraft server metrics."
)
public final class MinecraftMetricsVelocity {
    @NonNull private final ProxyServer server;
    @NonNull private final Logger logger;

    @Inject
    public MinecraftMetricsVelocity(@NonNull ProxyServer server, @NonNull Logger logger, @DataDirectory @NonNull Path dataDirectory) {
        this.server = server;
        this.logger = logger;
        ConfigOption.load(dataDirectory);

        // No server ID found, cant monitor
        if (ConfigOption.SERVER_ID.getValue() == null) {
            logger.error("No server ID found in the config, please visit https://mcmetrics.xyz to get your server ID.");
            return;
        }
    }
}