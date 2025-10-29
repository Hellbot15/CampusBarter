package org.rizvi.campusbarter;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(ItemRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Item item1 = new Item();
                item1.setTitle("Calculus Textbook");
                item1.setOwner("Ayesha");
                item1.setDescription("Good condition, some notes");
                item1.setTags(List.of("books", "education"));

                Item item2 = new Item();
                item2.setTitle("Guitar Lessons");
                item2.setOwner("Bilal");
                item2.setDescription("30-minute session, beginner-friendly");
                item2.setTags(List.of("skills", "music"));

                repository.save(item1);
                repository.save(item2);
            }
        };
    }
}
