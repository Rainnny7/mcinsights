package me.braydon.metrics.common;

import io.leangen.geantyref.TypeToken;
import lombok.*;
import lombok.extern.log4j.Log4j2;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.nio.file.Path;
import java.util.*;

/**
 * @author Braydon
 */
@Log4j2(topic = "MC-Metrics Config") @Setter @Getter
public final class ConfigOption<T> {
    /**
     * The registry of all config options.
     */
    private static final List<ConfigOption<?>> registry = new ArrayList<>();

    public static final ConfigOption<String> API_ENDPOINT = new ConfigOption<>("api-endpoint", "https://api.mcmetrics.xyz");
    public static final ConfigOption<UUID> SERVER_ID = new ConfigOption<>("server-id", null);

    /**
     * The file to use for the config.
     */
    private static File configFile;

    /**
     * The key of this option.
     */
    @NonNull private final String key;

    /**
     * The default value for this option.
     */
    private final T defaultValue;

    /**
     * The current value of this option.
     */
    private Object value;

    private ConfigOption(@NonNull String key, T defaultValue) {
        this.key = key;
        this.defaultValue = defaultValue;
        value = defaultValue;
        registry.add(this);
    }

    /**
     * Load the config file.
     *
     * @param dataDirectory the data directory
     */
    @SneakyThrows
    public static void load(@NonNull Path dataDirectory) {
        log.info("Loading the config...");
        long before = System.currentTimeMillis();
        configFile = new File(dataDirectory.toFile(), "config.json");

        // Create the file if it doesn't exist
        if (!configFile.exists()) {
            configFile.getParentFile().mkdirs();
            if (!configFile.createNewFile()) {
                log.error("Failed to create config file at {}", configFile.getAbsolutePath());
                return;
            }
            save(); // Save the default file
            log.info("New file created at {}", configFile.getAbsolutePath());
        }

        // Load the values from the file
        try (FileReader reader = new FileReader(configFile)) {
            Map<String, Object> values = Constants.GSON.fromJson(reader, new TypeToken<Map<String, Object>>() {}.getType());
            for (ConfigOption<?> option : registry) {
                Object value = values.get(option.key);
                if (value != null) {
                    option.setValue(value);
                }
            }
        }
        // Done, log it
        for (ConfigOption<?> option : registry) {
            log.info("Loaded option {} with value {}", option.key, option.value);
        }
        log.info("Done loading in {}ms", System.currentTimeMillis() - before);
    }

    /**
     * Save the config file.
     */
    @SneakyThrows
    public static void save() {
        log.info("Saving config...");
        long before = System.currentTimeMillis();

        // Save the values to the file
        try (FileWriter writer = new FileWriter(configFile)) {
            Map<String, Object> values = new HashMap<>();
            for (ConfigOption<?> option : registry) {
                values.put(option.key, option.value);
            }
            writer.write(Constants.GSON.toJson(values));
        }
        // Done, log it
        log.info("Done saving in {}ms", System.currentTimeMillis() - before);
    }
}
