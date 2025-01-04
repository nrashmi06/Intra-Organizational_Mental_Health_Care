// File: backend/src/main/java/com/dbms/mentalhealth/util/AppointmentCacheKey.java
package com.dbms.mentalhealth.util.Cache.CacheKey;

import com.dbms.mentalhealth.util.Cache.KeyEnum.AppointmentKeyType;

import java.util.Objects;

public class AppointmentCacheKey {
    private final Object id;
    private final AppointmentKeyType keyType;

    public AppointmentCacheKey(Object id, AppointmentKeyType keyType) {
        this.id = id;
        this.keyType = keyType;
    }

    public Object getId() {
        return id;
    }

    public AppointmentKeyType getKeyType() {
        return keyType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AppointmentCacheKey that = (AppointmentCacheKey) o;
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