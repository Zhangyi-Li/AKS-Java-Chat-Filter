package com.example.akschatfilter.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.pusher.rest.Pusher;

import jakarta.annotation.PostConstruct;

@Service
public class BroadcastService {

    private Pusher pusher;

    @Value("${soketi.app.id}")
    private String appId;

    @Value("${soketi.app.key}")
    private String appKey;

    @Value("${soketi.app.secret}")
    private String appSecret;

    @Value("${soketi.host}")
    private String host;

    @Value("${soketi.port:443}")
    private int port;

    @Value("${soketi.use-tls:true}")
    private boolean useTls;

    @PostConstruct
    public void init() {
        this.pusher = new Pusher(appId, appKey, appSecret);
        this.pusher.setHost(host);
        this.pusher.setEncrypted(useTls);
    }

    /**
     * Broadcast a message to the global chat channel
     */
    public void broadcastMessage(String username, String content, String status, String rejectionReason) {
        new Thread(() -> {
            try {
                Map<String, Object> data = new HashMap<>();
                data.put("username", username);
                data.put("content", content);
                data.put("status", status);
                data.put("rejectionReason", rejectionReason);
                data.put("timestamp", System.currentTimeMillis());

                pusher.trigger("public-chat", "message-sent", data);
            } catch (Exception e) {
                System.err.println("[BROADCAST] Error: " + e.getMessage());
            }
        }).start();
    }

    /**
     * Broadcast connection status
     */
    public void broadcastConnectionStatus(String username, String status) {
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("username", username);
            data.put("status", status);
            data.put("timestamp", System.currentTimeMillis());

            pusher.trigger("public-chat", "user-status", data);
        } catch (Exception e) {
            System.err.println("Failed to broadcast status: " + e.getMessage());
        }
    }
}

