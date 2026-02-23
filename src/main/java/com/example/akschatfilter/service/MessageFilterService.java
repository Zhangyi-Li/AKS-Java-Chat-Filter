package com.example.akschatfilter.service;

import org.springframework.stereotype.Service;

@Service
public class MessageFilterService {

    // Profanity and offensive words
    private static final String[] PROFANITY_WORDS = {
        "toxic", "spam", "abuse", "hate", "violence", "kill", "bomb", "terrorist",
        "racist", "sexist", "inappropriate", "explicit", "curse", "fuck", "bitch", "asshole"
    };

    // Spam indicators
    private static final String[] SPAM_PATTERNS = {
        "http", "https", "www", ".com", ".net", ".org", "bit.ly", "tinyurl"
    };

    /**
     * Analyzes message content and returns filter result with status and reason
     */
    public FilterResult filterMessage(String content) {
        if (content == null || content.trim().isEmpty()) {
            return new FilterResult("BLOCKED", "Message cannot be empty");
        }

        String contentLower = content.toLowerCase();

        // Check for all caps (spam indicator)
        if (isAllCaps(content) && content.length() > 10) {
            return new FilterResult("BLOCKED", "Message is in ALL CAPS (spam detected)");
        }

        // Check for repeated characters (e.g., "hellooooo")
        if (hasExcessiveRepetition(content)) {
            return new FilterResult("BLOCKED", "Excessive character repetition detected");
        }

        // Check for profanity and offensive content
        for (String word : PROFANITY_WORDS) {
            if (contentLower.contains(word)) {
                return new FilterResult("BLOCKED", "Message contains inappropriate content: '" + word + "'");
            }
        }

        // Check for spam links
        for (String pattern : SPAM_PATTERNS) {
            if (contentLower.contains(pattern)) {
                return new FilterResult("BLOCKED", "Message contains spam or external links");
            }
        }

        // Check for multiple consecutive punctuation
        if (hasExcessivePunctuation(content)) {
            return new FilterResult("BLOCKED", "Excessive or aggressive punctuation detected");
        }

        // Check for message length (very long messages might be spam)
        if (content.length() > 5000) {
            return new FilterResult("BLOCKED", "Message exceeds maximum length (5000 characters)");
        }

        // Message passed all filters
        return new FilterResult("APPROVED", null);
    }

    private boolean isAllCaps(String content) {
        // Count letters
        int letterCount = 0;
        int upperCount = 0;

        for (char c : content.toCharArray()) {
            if (Character.isLetter(c)) {
                letterCount++;
                if (Character.isUpperCase(c)) {
                    upperCount++;
                }
            }
        }

        // If more than 80% of letters are uppercase, it's all caps
        return letterCount > 0 && (double) upperCount / letterCount > 0.8;
    }

    private boolean hasExcessiveRepetition(String content) {
        // Look for 4+ consecutive same characters
        for (int i = 0; i < content.length() - 3; i++) {
            if (content.charAt(i) == content.charAt(i + 1)
                    && content.charAt(i) == content.charAt(i + 2)
                    && content.charAt(i) == content.charAt(i + 3)) {
                return true;
            }
        }
        return false;
    }

    private boolean hasExcessivePunctuation(String content) {
        // Count consecutive punctuation marks
        int consecutiveCount = 0;
        int maxConsecutive = 0;

        for (char c : content.toCharArray()) {
            if (c == '!' || c == '?' || c == '.' || c == '*') {
                consecutiveCount++;
                maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
            } else {
                consecutiveCount = 0;
            }
        }

        // More than 4 consecutive punctuation marks is excessive
        return maxConsecutive > 4;
    }

    /**
     * Result class for filter check
     */
    public static class FilterResult {
        private final String status;
        private final String rejectionReason;

        public FilterResult(String status, String rejectionReason) {
            this.status = status;
            this.rejectionReason = rejectionReason;
        }

        public String getStatus() {
            return status;
        }

        public String getRejectionReason() {
            return rejectionReason;
        }

        public boolean isApproved() {
            return "APPROVED".equals(status);
        }
    }
}
