package com.dbms.mentalhealth.util.Cache.CacheKey;

import com.dbms.mentalhealth.util.Cache.KeyEnum.SessionReportKeyType;
import java.util.Objects;

public class SessionReportCacheKey {
    private final Object id;
    private final SessionReportKeyType keyType;

    public SessionReportCacheKey(Object id, SessionReportKeyType keyType) {
        this.id = id;
        this.keyType = keyType;
    }

    public Object getId() {
        return id;
    }

    public SessionReportKeyType getKeyType() {
        return keyType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SessionReportCacheKey that = (SessionReportCacheKey) o;
        return Objects.equals(id, that.id) && keyType == that.keyType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, keyType);
    }

    @Override
    public String toString() {
        return String.format("%s:%s", keyType, id);
    }
}