package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.service.ListenerService;
import com.dbms.mentalhealth.urlMapper.ListenerUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ListenerController {

    private final ListenerService listenerService;

    @Autowired
    public ListenerController(ListenerService listenerService) {
        this.listenerService = listenerService;
    }

    @GetMapping(ListenerUrlMapping.LISTENER_BY_ID)
    public ListenerDetailsResponseDTO getListenerDetails(@RequestParam("type") String type, @RequestParam("id") Integer id) {
        return listenerService.getListenerDetails(type, id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(ListenerUrlMapping.ALL_LISTENERS)
    public List<UserActivityDTO> getAllListeners(@RequestParam(value ="type",required = false) String type) {
        return listenerService.getAllListeners(type);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(ListenerUrlMapping.SUSPEND_OR_UN_SUSPEND_LISTENER)
    public String suspendOrUnSuspendListener(@PathVariable("listenerId") Integer listenerId, @RequestParam("action") String action) {
        return listenerService.suspendOrUnsuspendListener(listenerId, action);
    }

}