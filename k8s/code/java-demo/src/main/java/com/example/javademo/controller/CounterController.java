package com.example.javademo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CounterController {
    @Autowired(required = false)
    StringRedisTemplate redisTemplate;
    @GetMapping
    public String count() {
        Long increment = redisTemplate.opsForValue().increment("count-people");
        return "有 [" + increment + "] 人访问了这个页面";
    }
}
