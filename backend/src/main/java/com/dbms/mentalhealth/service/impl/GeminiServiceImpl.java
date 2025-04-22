package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.model.ModerationResult;
import com.dbms.mentalhealth.service.GeminiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiServiceImpl implements GeminiService {

    @Value("${spring.ai.google.gemini.api-key}")
    private String apiKey;

    @Value("${spring.ai.google.gemini.url}")
    private String geminiUrl;

    @Value("${spring.ai.google.gemini.model:gemini-pro}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String CATEGORY_PREFIX = "CATEGORY:";
    private static final String SUMMARY_PREFIX = "SUMMARY:";
    private static final List<String> VALID_CATEGORIES = List.of(
            "STRESS", "DEPRESSION", "SUICIDAL", "BREAKUP", "ANXIETY",
            "GRIEF", "TRAUMA", "RELATIONSHIP_ISSUES", "SELF_ESTEEM", "OTHER"
    );

    @Override
    public String processPrompt(String promptText) {
        try {
            // Call Gemini API with the prompt
            return callGeminiApi(promptText);
        } catch (Exception e) {
            log.error("Failed to process prompt with Gemini: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process prompt with Gemini: " + e.getMessage(), e);
        }
    }

    @Override
    public String callGeminiApi(String promptText) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build request body
        Map<String, Object> part = new HashMap<>();
        part.put("text", promptText);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", new Object[]{part});

        Map<String, Object> body = new HashMap<>();
        body.put("contents", new Object[]{content});

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        String fullUrl = geminiUrl + "?key=" + apiKey;

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    fullUrl,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            // Parse and extract the response text
            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText();
        } catch (HttpClientErrorException e) {
            log.error("Gemini API client error: Status code {}, Response body: {}",
                    e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new RuntimeException("Client error when calling Gemini API: " + e.getMessage(), e);
        } catch (HttpServerErrorException e) {
            log.error("Gemini API server error: Status code {}, Response body: {}",
                    e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new RuntimeException("Server error when calling Gemini API: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process prompt with Gemini: " + e.getMessage(), e);
        }
    }

    @Override
    public String createSessionAnalysisPrompt(Iterable<String> chatMessages) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are a mental health analysis assistant. ")
                .append("Please analyze the following therapy chat session and:")
                .append("\n\n1. Categorize the session into EXACTLY ONE of these categories: ")
                .append("STRESS, DEPRESSION, SUICIDAL, BREAKUP, ANXIETY, GRIEF, TRAUMA, ")
                .append("RELATIONSHIP_ISSUES, SELF_ESTEEM, or OTHER")
                .append("\n\n2. Provide a brief summary (maximum 300 words) of the key issues discussed ")
                .append("and emotional themes present in the conversation.")
                .append("\n\nOutput format:")
                .append("\n").append(CATEGORY_PREFIX).append(" [single category name]")
                .append("\n").append(SUMMARY_PREFIX).append(" [your summary]")
                .append("\n\nChat session transcript:")
                .append("\n-----------------------------------\n");

        // Add chat messages
        for (String message : chatMessages) {
            promptBuilder.append(message).append("\n");
        }

        promptBuilder.append("-----------------------------------");
        return promptBuilder.toString();
    }

    @Override
    public String createJsonSessionAnalysisPrompt(List<String> formattedMessages) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Please analyze the following mental health conversation between a user and a counselor. ");
        promptBuilder.append("Provide a detailed assessment in a structured JSON format with the following keys: \n");
        promptBuilder.append("1. 'category': EXACTLY ONE of [STRESS, DEPRESSION, SUICIDAL, BREAKUP, ANXIETY, GRIEF, TRAUMA, RELATIONSHIP_ISSUES, SELF_ESTEEM, OTHER] based on the primary issue\n");
        promptBuilder.append("2. 'summary': A concise summary of the conversation (150 words max) highlighting the key concerns and emotional state\n\n");
        promptBuilder.append("Conversation:\n");

        for (String message : formattedMessages) {
            promptBuilder.append(message).append("\n");
        }

        promptBuilder.append("\nRespond ONLY with a valid JSON object containing 'category' and 'summary' keys. No additional text.");

        return promptBuilder.toString();
    }

    @Override
    public Map<String, String> parseAnalysisResponse(String apiResponse) {
        Map<String, String> result = new HashMap<>();

        try {
            // Parse for category
            String category = extractValue(apiResponse, CATEGORY_PREFIX);
            if (category != null && !category.isEmpty()) {
                // Validate that the category is one of our predefined values
                String normalizedCategory = category.toUpperCase().trim();
                if (VALID_CATEGORIES.contains(normalizedCategory)) {
                    result.put("category", normalizedCategory);
                } else {
                    log.warn("Invalid category returned: {}, defaulting to OTHER", category);
                    result.put("category", "OTHER");
                }
            } else {
                log.warn("No category found in response, defaulting to OTHER");
                result.put("category", "OTHER");
            }

            // Parse for summary
            String summary = extractValue(apiResponse, SUMMARY_PREFIX);
            if (summary != null && !summary.isEmpty()) {
                result.put("summary", summary);
            } else {
                log.warn("No summary found in response");
                result.put("summary", "No summary provided.");
            }

            return result;
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage(), e);
            result.put("category", "OTHER");
            result.put("summary", "Error processing analysis.");
            return result;
        }
    }

    @Override
    public Map<String, String> parseJsonAnalysisResponse(String response) {
        try {
            // Try to parse as direct JSON first
            return objectMapper.readValue(response, Map.class);
        } catch (Exception e) {
            log.warn("Failed to parse response as direct JSON, attempting to extract JSON from text: {}", e.getMessage());

            // Fallback: try to extract JSON from the text response
            try {
                // Find JSON by looking for opening brace
                int startIndex = response.indexOf("{");
                int endIndex = response.lastIndexOf("}") + 1;

                if (startIndex >= 0 && endIndex > startIndex) {
                    String jsonPart = response.substring(startIndex, endIndex);
                    return objectMapper.readValue(jsonPart, Map.class);
                }
            } catch (Exception ex) {
                log.error("Failed to extract JSON from response", ex);
            }

            // If all parsing fails, return a default map
            log.error("Unable to parse Gemini response, using default values");
            return Map.of(
                    "category", "OTHER",
                    "summary", "Error analyzing session. Raw response: " + response
            );
        }
    }

    /**
     * Helper method to extract values from the API response
     */
    private String extractValue(String response, String prefix) {
        int startIndex = response.indexOf(prefix);
        if (startIndex == -1) {
            return null;
        }

        startIndex += prefix.length();
        int endIndex = response.indexOf("\n", startIndex);

        if (endIndex != -1) {
            return response.substring(startIndex, endIndex).trim();
        } else {
            return response.substring(startIndex).trim();
        }
    }

    @Override
    public boolean isValidCategory(String category) {
        return VALID_CATEGORIES.contains(category.toUpperCase().trim());
    }

    @Override
    public ModerationResult moderateMessage(String message) {
        try {
            String prompt = createModerationPrompt(message);
            String response = callGeminiApi(prompt);
            return parseModerationResponse(response);
        } catch (Exception e) {
            log.error("Failed to moderate message with Gemini: {}", e.getMessage(), e);
            // On error, allow the message but log the issue
            return ModerationResult.allowed();
        }
    }

    @Override
    public String createModerationPrompt(String message) {
        return "You are a content moderator for a mental health support chat application. "
                + "Please review the following message and determine if it should be blocked based on the following criteria:\n"
                + "- Explicit sexual content\n"
                + "- Severe profanity\n"
                + "- Hate speech or discrimination\n"
                + "- Violent threats or encouraging self-harm\n"
                + "- Spam or promotional content\n\n"
                + "Message to moderate: \"" + message + "\"\n\n"
                + "Respond with JSON in this exact format:\n"
                + "{\n"
                + "  \"allowed\": true/false,\n"
                + "  \"reason\": \"explanation if blocked\"\n"
                + "}\n\n"
                + "Only respond with the JSON.";
    }

    private ModerationResult parseModerationResponse(String response) {
        try {
            // Remove markdown code block formatting if present
            String cleanedResponse = response;
            if (response.startsWith("```json") || response.startsWith("```")) {
                cleanedResponse = response.replaceAll("^```json\\s*|^```\\s*|\\s*```$", "");
            }

            // Try to parse the cleaned response as JSON
            JsonNode root = objectMapper.readTree(cleanedResponse);
            boolean allowed = root.path("allowed").asBoolean(true); // Default to allowing if not found
            String reason = root.path("reason").asText(null);
            return new ModerationResult(allowed, reason);
        } catch (Exception e) {
            log.error("Failed to parse moderation response: {}", e.getMessage(), e);
            // If we can't parse the response, default to allowing the message
            return ModerationResult.allowed();
        }
    }
}