package com.slayer;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/scores")
@CrossOrigin(origins = "*") 
public class ScoreController {
    private List<Score> scores = new ArrayList<>();

    @PostMapping("/slay")
    public String save(@RequestBody Score score) {
        scores.add(score);
        return "Slain!";
    }
}