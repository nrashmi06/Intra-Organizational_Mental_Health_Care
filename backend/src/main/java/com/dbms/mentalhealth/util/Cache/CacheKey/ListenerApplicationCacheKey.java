package com.dbms.mentalhealth.util.Cache.CacheKey;

import com.dbms.mentalhealth.util.Cache.KeyEnum.ListenerRelatedKeyType;

import java.util.Objects;

public class ListenerApplicationCacheKey {
    private final Object id;
    private final ListenerRelatedKeyType keyType;

    public ListenerApplicationCacheKey(Object id, ListenerRelatedKeyType keyType) {
        this.id = id;
        this.keyType = keyType;
    }

    public Object getId() {
        return id;
    }

    public ListenerRelatedKeyType getKeyType() {
        return keyType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ListenerApplicationCacheKey that = (ListenerApplicationCacheKey) o;
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