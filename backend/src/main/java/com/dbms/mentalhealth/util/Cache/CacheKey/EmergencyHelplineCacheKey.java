// EmergencyHelplineCacheKey.java
package com.dbms.mentalhealth.util.Cache.CacheKey;

import java.util.Objects;

public class EmergencyHelplineCacheKey {
    private final Integer id;

    public EmergencyHelplineCacheKey(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmergencyHelplineCacheKey that = (EmergencyHelplineCacheKey) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return String.format("ALL_HELPLINES:%d", id);
    }
}