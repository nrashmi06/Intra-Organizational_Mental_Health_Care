// SessionKeyType.java
package com.dbms.mentalhealth.util.Cache.KeyEnum;

public enum SessionKeyType {
    SESSION,          // For individual session details
    SESSIONS_FILTER,  // For filtered session lists (includes user, listener, status filters)
    SESSION_MESSAGES, // For session messages
    SESSION_METRICS   // For session statistics
}