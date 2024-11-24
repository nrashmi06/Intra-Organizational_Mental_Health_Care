// backend/src/main/java/com/dbms/mentalhealth/service/RefreshTokenService.java
package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.model.RefreshToken;

import java.util.Map;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(String email);
    boolean verifyRefreshToken(String token);
    void deleteRefreshToken(String token);
    String getEmailFromRefreshToken(String token);
    public Map<String,Object> renewToken(String refreshToken);
}