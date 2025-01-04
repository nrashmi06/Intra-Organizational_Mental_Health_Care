package com.dbms.mentalhealth.enums;

public enum CacheKey {
    ALL_USERS("allUsers"),
    ADMIN_DETAILS("adminDetails", Role.ADMIN),
    LISTENER_DETAILS("listenerDetails", Role.LISTENER),
    USER_DETAILS("userDetails", Role.USER);

    private final String eventName;
    private final Role role;

    CacheKey(String eventName) {
        this.eventName = eventName;
        this.role = null;
    }

    CacheKey(String eventName, Role role) {
        this.eventName = eventName;
        this.role = role;
    }

    public String getEventName() {
        return eventName;
    }

    public String getCacheKey() {
        return role != null ? role.name() : name();
    }

    public Role getRole() {
        return role;
    }

    public static CacheKey fromRole(Role role) {
        for (CacheKey key : values()) {
            if (role.equals(key.role)) {
                return key;
            }
        }
        throw new IllegalArgumentException("No cache key mapping for role: " + role);
    }
}