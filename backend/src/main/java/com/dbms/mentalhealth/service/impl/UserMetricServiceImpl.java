package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.model.UserMetrics;
import com.dbms.mentalhealth.repository.UserMetricsRepository;
import com.dbms.mentalhealth.service.UserMetricService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserMetricServiceImpl implements UserMetricService {

    private final UserMetricsRepository userMetricsRepository;

    public UserMetricServiceImpl(UserMetricsRepository userMetricsRepository) {
        this.userMetricsRepository = userMetricsRepository;
    }

    @Override
    public void incrementMessageCount(String username, Integer count) {
        userMetricsRepository.incrementMessageCount(username, count);
    }

    @Override
    @Transactional
    public void setLastSessionDate(User user, LocalDateTime lastSessionDate) {
        UserMetrics userMetrics = userMetricsRepository.findByUser_AnonymousName(user.getAnonymousName())
                .orElseThrow(() -> new IllegalArgumentException("UserMetrics not found for user: " + user.getAnonymousName()));
        userMetrics.setLastSessionDate(lastSessionDate);
        userMetricsRepository.save(userMetrics);
    }

    @Override
    public void incrementSessionCount(User user) {
        UserMetrics userMetrics = userMetricsRepository.findByUser_AnonymousName(user.getAnonymousName())
                .orElseThrow(() -> new IllegalArgumentException("UserMetrics not found for user: " + user.getAnonymousName()));
        userMetrics.setTotalSessionsAttended(userMetrics.getTotalSessionsAttended() + 1);
        userMetricsRepository.save(userMetrics);
    }

    @Override
    public void updateAppointmentCount(User user,int count) {
        UserMetrics userMetrics = userMetricsRepository.findByUser_AnonymousName(user.getAnonymousName())
                .orElseThrow(() -> new IllegalArgumentException("UserMetrics not found for user: " + user.getAnonymousName()));
        userMetrics.setTotalAppointments(userMetrics.getTotalAppointments() + 1);
        userMetricsRepository.save(userMetrics);
    }

    @Override
    @Transactional
    public void setLastAppointmentDate(User user, LocalDateTime lastAppointmentDate) {
        UserMetrics userMetrics = userMetricsRepository.findByUser_AnonymousName(user.getAnonymousName())
                .orElseThrow(() -> new IllegalArgumentException("UserMetrics not found for user: " + user.getAnonymousName()));
        userMetrics.setLastAppointmentDate(lastAppointmentDate);
        userMetricsRepository.save(userMetrics);
    }

    @Override
    public void updateBlogCount(User user, int count) {
        UserMetrics userMetrics = userMetricsRepository.findByUser_AnonymousName(user.getAnonymousName())
                .orElseThrow(() -> new IllegalArgumentException("UserMetrics not found for user: " + user.getAnonymousName()));
        userMetrics.setTotalBlogsPublished(userMetrics.getTotalBlogsPublished() + count);
        userMetricsRepository.save(userMetrics);
    }

    @Override
    public void updateLikeCount(User user,int count) {
        UserMetrics userMetrics = userMetricsRepository.findByUser_AnonymousName(user.getAnonymousName())
                .orElseThrow(() -> new IllegalArgumentException("UserMetrics not found for user: " + user.getAnonymousName()));
        userMetrics.setTotalLikesReceived(userMetrics.getTotalLikesReceived() + count);
        userMetricsRepository.save(userMetrics);
    }

    @Override
    public void incrementViewCount(User user) {
        UserMetrics userMetrics = userMetricsRepository.findByUser_AnonymousName(user.getAnonymousName())
                .orElseThrow(() -> new IllegalArgumentException("UserMetrics not found for user: " + user.getAnonymousName()));
        userMetrics.setTotalViewsReceived(userMetrics.getTotalViewsReceived() + 1);
        userMetricsRepository.save(userMetrics);
    }
}
