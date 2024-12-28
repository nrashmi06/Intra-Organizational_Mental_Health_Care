package com.dbms.mentalhealth.util.Cache.CacheKey;

import com.dbms.mentalhealth.util.Cache.KeyEnum.SessionFeedbackKeyType;
import java.util.Objects;

public class SessionFeedbackCacheKey {
    private final Object id;
    private final SessionFeedbackKeyType keyType;

    public SessionFeedbackCacheKey(Object id, SessionFeedbackKeyType keyType) {
        this.id = id;
        this.keyType = keyType;
    }

    public Object getId() {
        return id;
    }

    public SessionFeedbackKeyType getKeyType() {
        return keyType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SessionFeedbackCacheKey that = (SessionFeedbackCacheKey) o;
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