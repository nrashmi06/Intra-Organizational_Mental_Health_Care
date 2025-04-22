package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.model.ModerationResult;

import java.util.List;
import java.util.Map;

public interface GeminiService {
    /**
     * Processes a prompt through the Gemini API and returns the response text
     * @param promptText The prompt to send to Gemini
     * @return The generated response text
     */
    String processPrompt(String promptText);

    /**
     * Creates a session analysis prompt based on chat messages
     * @param chatMessages The collection of chat messages to analyze
     * @return The formatted prompt for Gemini
     */
    String createSessionAnalysisPrompt(Iterable<String> chatMessages);

    /**
     * Parses the Gemini API response to extract the category and summary
     * @param apiResponse The raw response from Gemini
     * @return A map containing the category and summary
     */
    Map<String, String> parseAnalysisResponse(String apiResponse);

    /**
     * Calls the Gemini API with the provided prompt text
     * @param promptText The prompt text to send to Gemini
     * @return The response from Gemini API
     */
    String callGeminiApi(String promptText);

    /**
     * Creates a JSON structured analysis prompt
     * @param formattedMessages List of formatted messages to analyze
     * @return The formatted JSON prompt for Gemini
     */
    String createJsonSessionAnalysisPrompt(List<String> formattedMessages);

    /**
     * Parses a JSON format response from Gemini API
     * @param response The raw JSON response from Gemini
     * @return A map containing the category and summary
     */
    Map<String, String> parseJsonAnalysisResponse(String response);

    /**
     * Validates if a category is valid
     * @param category The category to validate
     * @return True if the category is valid, false otherwise
     */
    boolean isValidCategory(String category);

    ModerationResult moderateMessage(String message);

    /**
     * Creates a moderation prompt for Gemini API
     * @param message The message to be moderated
     * @return The formatted prompt for moderation
     */
    String createModerationPrompt(String message);
}