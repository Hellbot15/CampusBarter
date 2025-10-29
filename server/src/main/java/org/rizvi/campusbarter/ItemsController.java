package org.rizvi.campusbarter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"})
public class ItemsController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/items")
    public List<Item> list() {
        return itemRepository.findAll();
    }

    @PostMapping("/items")
    public ResponseEntity<Item> create(@RequestBody Item newItem) {
        System.out.println("=== POST ITEM REQUEST ===");
        System.out.println("Received item: " + (newItem != null ? newItem.getTitle() : "null"));
        
        if (newItem == null || newItem.getTitle() == null || newItem.getTitle().isBlank()) {
            System.out.println("Bad request - Invalid item data");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        if (newItem.getTags() == null) newItem.setTags(List.of());
        
        System.out.println("Saving item: " + newItem.getTitle() + " by " + newItem.getOwnerUsername());
        Item saved = itemRepository.save(newItem);
        System.out.println("Item saved with ID: " + saved.getId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/items/{id}/claim")
    public ResponseEntity<Item> claimOwnership(@PathVariable String id, @RequestBody java.util.Map<String, String> body, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            Item item = itemRepository.findById(id).orElse(null);
            if (item == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            String newOwnerUsername = body.get("ownerUsername");
            System.out.println("Claiming item " + id + " for user: " + newOwnerUsername);
            item.setOwnerUsername(newOwnerUsername);
            Item updated = itemRepository.save(item);
            
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error claiming item: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            System.out.println("=== DELETE REQUEST ===");
            System.out.println("Item ID: " + id);
            System.out.println("Auth Header: " + (authHeader != null ? "Present" : "Missing"));
            
            // Find the item
            Item item = itemRepository.findById(id).orElse(null);
            if (item == null) {
                System.out.println("Item not found: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            System.out.println("Item found - Title: " + item.getTitle() + ", Owner: " + item.getOwnerUsername());
            
            // Verify authorization
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("Unauthorized - No valid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(token);
            System.out.println("Token username: '" + username + "' (length: " + username.length() + ")");
            System.out.println("Owner username: '" + item.getOwnerUsername() + "' (length: " + (item.getOwnerUsername() != null ? item.getOwnerUsername().length() : "null") + ")");
            System.out.println("Case-insensitive comparison result: " + (item.getOwnerUsername() != null ? username.equalsIgnoreCase(item.getOwnerUsername()) : "owner is null"));
            
            // TEMPORARY: Allow delete for cleanup - REMOVE THIS LATER
            System.out.println("⚠️ TEMPORARY: Allowing delete without ownership check for cleanup");
            
            /* 
            // Check if the user owns this item (case-insensitive comparison)
            if (item.getOwnerUsername() != null && !username.equalsIgnoreCase(item.getOwnerUsername())) {
                System.out.println("FORBIDDEN - Username mismatch!");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            */
            
            System.out.println("Deleting item...");
            itemRepository.deleteById(id);
            System.out.println("Item deleted successfully!");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            System.err.println("Error deleting item: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/items/all")
    public ResponseEntity<Void> deleteAll(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            System.out.println("⚠️⚠️⚠️ DELETING ALL ITEMS ⚠️⚠️⚠️");
            itemRepository.deleteAll();
            System.out.println("All items deleted from database!");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            System.err.println("Error deleting all items: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
