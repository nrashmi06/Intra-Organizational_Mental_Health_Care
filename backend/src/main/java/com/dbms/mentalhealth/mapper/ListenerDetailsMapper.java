package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.Listener.response.FullListenerDetailsDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.model.UserMetrics;

import java.util.List;

public class ListenerDetailsMapper {

    public static ListenerDetailsResponseDTO toResponseDTO(Listener listener) {
        ListenerDetailsResponseDTO dto = new ListenerDetailsResponseDTO();
        dto.setListenerId(listener.getListenerId());
        dto.setUserEmail(listener.getUser().getEmail());
        dto.setCanApproveBlogs(listener.isCanApproveBlogs());
        dto.setTotalSessions(listener.getTotalSessions());
        dto.setTotalMessagesSent(listener.getTotalMessagesSent());
        dto.setFeedbackCount(listener.getFeedbackCount());
        dto.setAverageRating(listener.getAverageRating());
        dto.setJoinedAt(listener.getJoinedAt());
        dto.setApprovedBy(listener.getApprovedBy());
        return dto;
    }

    public static FullListenerDetailsDTO toFullListenerDetailsDTO(Listener listener, UserMetrics userMetrics) {
        FullListenerDetailsDTO dto = new FullListenerDetailsDTO();
        dto.setListenerId(listener.getListenerId());
        dto.setUserEmail(listener.getUser().getEmail());
        dto.setCanApproveBlogs(listener.isCanApproveBlogs());
        dto.setTotalSessions(listener.getTotalSessions());
        dto.setTotalMessagesSent(listener.getTotalMessagesSent());
        dto.setFeedbackCount(listener.getFeedbackCount());
        dto.setAverageRating(listener.getAverageRating());
        dto.setJoinedAt(listener.getJoinedAt());
        dto.setApprovedBy(listener.getApprovedBy());
        dto.setTotalBlogsPublished(userMetrics.getTotalBlogsPublished());
        dto.setTotalBlogLikesReceived(userMetrics.getTotalLikesReceived());
        dto.setTotalBlogViewsReceived(userMetrics.getTotalViewsReceived());
        return dto;
    }
}