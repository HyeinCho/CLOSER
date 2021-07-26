package com.ssafy.closer.controller;

import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gboard")
@Api("Gboard Controller API V1")
@CrossOrigin("*")
public class GBoardController {
    private static final Logger logger = LoggerFactory.getLogger(GBoardController.class);
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";


}
