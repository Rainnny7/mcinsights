package me.braydon.metrics.common;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * @author Braydon
 */
public final class Constants {
    public static final Gson GSON = new GsonBuilder()
            .serializeNulls()
            .setPrettyPrinting()
            .create();
}