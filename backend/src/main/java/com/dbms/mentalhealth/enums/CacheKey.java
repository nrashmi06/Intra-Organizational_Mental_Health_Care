package com.dbms.mentalhealth.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CacheKey {
    ALL_USERS("allUsers"),
    ROLE_COUNTS("roleCounts"),
    ADMIN_DETAILS("adminDetails"),
    LISTENER_DETAILS("listenerDetails"),
    USER_DETAILS("userDetails");

    private final String key;
}