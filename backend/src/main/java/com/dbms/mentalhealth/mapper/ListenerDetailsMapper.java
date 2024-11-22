package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.model.Listener;

public class ListenerDetailsMapper {

    public static ListenerDetailsResponseDTO toResponseDTO(Listener listener) {
        ListenerDetailsResponseDTO dto = new ListenerDetailsResponseDTO();
        dto.setListenerId(listener.getListenerId());
        dto.setUserEmail(listener.getUser().getEmail());
        dto.setCanApproveBlogs(listener.isCanApproveBlogs());
        dto.setMaxDailySessions(listener.getMaxDailySessions());
        dto.setTotalSessions(listener.getTotalSessions());
        dto.setAverageRating(listener.getAverageRating());
        dto.setJoinedAt(listener.getJoinedAt());
        dto.setApprovedBy(listener.getApprovedBy());
        return dto;
    }
}