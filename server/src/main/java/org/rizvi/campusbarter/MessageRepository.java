package org.rizvi.campusbarter;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    
    // Find all messages between two users
    @Query("{ $or: [ { $and: [ { 'sender': ?0 }, { 'receiver': ?1 } ] }, { $and: [ { 'sender': ?1 }, { 'receiver': ?0 } ] } ] }")
    List<Message> findMessagesBetweenUsers(String user1, String user2);
    
    // Find all messages for a specific item between two users
    @Query("{ 'itemId': ?0, $or: [ { $and: [ { 'sender': ?1 }, { 'receiver': ?2 } ] }, { $and: [ { 'sender': ?2 }, { 'receiver': ?1 } ] } ] }")
    List<Message> findMessagesByItemAndUsers(String itemId, String user1, String user2);
    
    // Find all messages involving a user (for listing conversations)
    @Query("{ $or: [ { 'sender': ?0 }, { 'receiver': ?0 } ] }")
    List<Message> findMessagesByUser(String username);
}
