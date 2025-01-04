package com.dbms.mentalhealth.util.Cache.CacheKey;

import com.dbms.mentalhealth.util.Cache.KeyEnum.AdminKeyType;

import java.util.Objects;

public class AdminCacheKey {
    private final Integer id;
    private final AdminKeyType keyType;

    public AdminCacheKey(Integer id, AdminKeyType keyType) {
        this.id = id;
        this.keyType = keyType;
    }

    public Integer getId() {
        return id;
    }

    public AdminKeyType getKeyType() {
        return keyType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AdminCacheKey that = (AdminCacheKey) o;
        return Objects.equals(id, that.id) && keyType == that.keyType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, keyType);
    }

    @Override
    public String toString() {
        return String.format("%s:%d", keyType, id);
    }
}