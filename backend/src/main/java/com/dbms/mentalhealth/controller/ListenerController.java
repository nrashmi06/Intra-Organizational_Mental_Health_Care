package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.service.ListenerService;
import com.dbms.mentalhealth.urlMapper.ListenerUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}