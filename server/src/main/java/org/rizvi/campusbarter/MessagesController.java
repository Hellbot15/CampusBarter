package org.rizvi.campusbarter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"})
public class MessagesController {

    @Autowired
    private MessageRepository messageRepository;

    // Get all messages between two users (optionally filtered by item)
    @GetMapping
    public List<Message> getMessages(
            @RequestParam String user1,
            @RequestParam String user2,
            @RequestParam(required = false) String itemId) {
        
        List<Message> messages;
        
        if (itemId != null && !itemId.isEmpty()) {
            messages = messageRepository.findMessagesByItemAndUsers(itemId, user1, user2);
        } else {
            messages = messageRepository.findMessagesBetweenUsers(user1, user2);
        }
        
        // Sort by timestamp
        messages.sort(Comparator.comparing(Message::getTimestamp));
        
        return messages;
    }

    // Send a new message
    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        try {
            Message saved = messageRepository.save(message);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get list of conversations for a user
    @GetMapping("/conversations")
    public List<Map<String, Object>> getConversations(@RequestParam String username) {
        List<Message> allMessages = messageRepository.findMessagesByUser(username);
        
        // Group messages by conversation partner
        Map<String, List<Message>> groupedByPartner = new HashMap<>();
        
        for (Message msg : allMessages) {
            String partner = msg.getSender().equals(username) ? msg.getReceiver() : msg.getSender();
            groupedByPartner.computeIfAbsent(partner, k -> new ArrayList<>()).add(msg);
        }
        
        // Create conversation summaries
        List<Map<String, Object>> conversations = new ArrayList<>();
        
        for (Map.Entry<String, List<Message>> entry : groupedByPartner.entrySet()) {
            List<Message> messages = entry.getValue();
            messages.sort(Comparator.comparing(Message::getTimestamp).reversed());
            
            Message lastMsg = messages.get(0);
            
            Map<String, Object> conv = new HashMap<>();
            conv.put("otherUser", entry.getKey());
            conv.put("lastMessage", lastMsg.getContent());
            conv.put("timestamp", lastMsg.getTimestamp());
            conv.put("itemId", lastMsg.getItemId());
            conv.put("itemTitle", lastMsg.getItemTitle());
            
            // Count unread messages
            long unreadCount = messages.stream()
                    .filter(m -> m.getReceiver().equals(username) && !m.isRead())
                    .count();
            conv.put("unreadCount", unreadCount);
            
            conversations.add(conv);
        }
        
        // Sort by most recent message
        conversations.sort((a, b) -> {
            java.time.LocalDateTime timeA = (java.time.LocalDateTime) a.get("timestamp");
            java.time.LocalDateTime timeB = (java.time.LocalDateTime) b.get("timestamp");
            return timeB.compareTo(timeA);
        });
        
        return conversations;
    }

    // Mark messages as read
    @PutMapping("/mark-read")
    public ResponseEntity<String> markAsRead(
            @RequestParam String receiver,
            @RequestParam String sender) {
        
        List<Message> messages = messageRepository.findMessagesBetweenUsers(receiver, sender);
        
        for (Message msg : messages) {
            if (msg.getReceiver().equals(receiver) && !msg.isRead()) {
                msg.setRead(true);
                messageRepository.save(msg);
            }
        }
        
        return ResponseEntity.ok("Messages marked as read");
    }
}
