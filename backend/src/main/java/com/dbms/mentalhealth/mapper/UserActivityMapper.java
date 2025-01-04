package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserRoleCountDTO;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.service.impl.SessionServiceImpl;

import java.util.Map;

public class UserActivityMapper {

    public static UserActivityDTO toUserActivityDTO(User user) {
        boolean isInASession = SessionServiceImpl.isUserInSessionStatic(user.getUserId());
        return new UserActivityDTO(user.getUserId(), user.getAnonymousName(), isInASession);
    }

    public static UserActivityDTO toUserActivityDTO(UserActivityDTO dto) {
        boolean isInASession = SessionServiceImpl.isUserInSessionStatic(dto.getUserId());
        return new UserActivityDTO(dto.getUserId(), dto.getAnonymousName(), isInASession);
    }
    public UserRoleCountDTO toUserRoleCountDTO(Map.Entry<String, Long> entry) {
        return new UserRoleCountDTO(entry.getKey(), entry.getValue().intValue());
    }
}