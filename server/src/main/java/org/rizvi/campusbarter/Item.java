package org.rizvi.campusbarter;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "items")
public class Item {
    @Id
    private String id;

    private String title;
    private String owner;
    private String ownerUsername; // username of the person who created the item
    private String contactEmail;
    private String contactPhone;
    private String description;
    private List<String> tags;
    private String category; // Academic, Skills, Hardware, Marketplace, Community, Services, Food, Events
    private String type; // offer, request, lost, found, ride, event

    public Item() {}

    public Item(String id, String title, String owner, String ownerUsername, String contactEmail, String contactPhone, String description, List<String> tags, String category, String type) {
        this.id = id; this.title = title; this.owner = owner; this.ownerUsername = ownerUsername;
        this.contactEmail = contactEmail; this.contactPhone = contactPhone;
        this.description = description; this.tags = tags; this.category = category; this.type = type;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
