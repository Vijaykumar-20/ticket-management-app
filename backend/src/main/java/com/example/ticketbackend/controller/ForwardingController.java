package com.example.ticketbackend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ForwardingController {

    @GetMapping(value = "{path:[^\\.]*}")
    public String redirect() {
        // Forward to index.html so that Angular can handle the routing
        return "forward:/index.html";
    }
}
