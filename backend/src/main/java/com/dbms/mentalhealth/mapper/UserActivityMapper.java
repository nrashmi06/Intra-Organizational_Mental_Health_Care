package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserRoleCountDTO;
import com.dbms.mentalhealth.model.User;

import java.util.Map;

public class UserActivityMapper {

    public static UserActivityDTO toUserActivityDTO(User user) {
        return new UserActivityDTO(user.getUserId(), user.getAnonymousName());
    }

    public static UserRoleCountDTO toUserRoleCountDTO(Map.Entry<String, Long> entry) {
        return new UserRoleCountDTO(entry.getKey(), entry.getValue().intValue());
    }
}