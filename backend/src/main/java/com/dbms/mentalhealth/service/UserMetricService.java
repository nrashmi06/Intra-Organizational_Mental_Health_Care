package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.model.User;

import java.time.LocalDateTime;

public interface UserMetricService {
    void incrementMessageCount(String username, Integer count);
    void setLastSessionDate(User user, LocalDateTime lastSessionDate);
    void incrementSessionCount(User user);
    void incrementAppointmentCount(User user);
    void setLastAppointmentDate(User user, LocalDateTime lastAppointmentDate);
    void updateBlogCount(User user, int count);
    void incrementLikeCount(User user);
    void incrementViewCount(User user);

}
