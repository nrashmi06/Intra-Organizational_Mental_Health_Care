// File: SessionCacheKey.java
package com.dbms.mentalhealth.util.Cache.CacheKey;

import com.dbms.mentalhealth.util.Cache.KeyEnum.SessionKeyType;
import java.util.Objects;

public class SessionCacheKey {
    private final Object id;
    private final SessionKeyType keyType;

    public SessionCacheKey(Object id, SessionKeyType keyType) {
        this.id = id;
        this.keyType = keyType;
    }

    public Object getId() {
        return id;
    }

    public SessionKeyType getKeyType() {
        return keyType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SessionCacheKey that = (SessionCacheKey) o;
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