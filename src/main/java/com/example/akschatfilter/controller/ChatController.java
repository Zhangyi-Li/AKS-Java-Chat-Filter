package com.example.akschatfilter.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.akschatfilter.entity.ChatMessage;
import com.example.akschatfilter.repository.ChatMessageRepository;
import com.example.akschatfilter.service.MessageFilterService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private MessageFilterService messageFilterService;

    @GetMapping
    public ResponseEntity<List<ChatMessage>> getAllMessages() {
        List<ChatMessage> messages = chatMessageRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(messages);
    }

    @PostMapping
    public ResponseEntity<ChatMessage> saveMessage(@RequestBody ChatMessage chatMessage) {
        // Apply message filtering
        MessageFilterService.FilterResult filterResult = messageFilterService.filterMessage(chatMessage.getContent());
        
        chatMessage.setStatus(filterResult.getStatus());
        if (!filterResult.isApproved()) {
            chatMessage.setRejectionReason(filterResult.getRejectionReason());
        }
        
        // Save message to database
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
    }
}

