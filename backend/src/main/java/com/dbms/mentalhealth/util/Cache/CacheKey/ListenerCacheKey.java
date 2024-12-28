package com.dbms.mentalhealth.util.Cache.CacheKey;

import com.dbms.mentalhealth.util.Cache.KeyEnum.ListenerRelatedKeyType;

import java.util.Objects;

public class ListenerCacheKey {
    private final Object id;
    private final ListenerRelatedKeyType keyType;
    private final String subType; // For cases where we need additional type info (e.g., "userId" vs "listenerId")

    public ListenerCacheKey(Object id, ListenerRelatedKeyType keyType) {
        this(id, keyType, null);
    }

    public ListenerCacheKey(Object id, ListenerRelatedKeyType keyType, String subType) {
        this.id = id;
        this.keyType = keyType;
        this.subType = subType;
    }

    public Object getId() {
        return id;
    }

    public ListenerRelatedKeyType getKeyType() {
        return keyType;
    }

    public String getSubType() {
        return subType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ListenerCacheKey that = (ListenerCacheKey) o;
        return Objects.equals(id, that.id) &&
                keyType == that.keyType &&
                Objects.equals(subType, that.subType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, keyType, subType);
    }

    @Override
    public String toString() {
        if (subType != null) {
            return String.format("%s:%s:%s", keyType, subType, id);
        }
        return String.format("%s:%s", keyType, id);
    }
}