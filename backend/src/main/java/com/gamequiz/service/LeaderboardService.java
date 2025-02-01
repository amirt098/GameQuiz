package com.gamequiz.service;

import com.gamequiz.model.User;
import com.gamequiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class LeaderboardService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getTopPlayers(int limit) {
        return userRepository.findAllByOrderByTotalPointsDesc(PageRequest.of(0, limit));
    }

    public List<User> getLeaderboard() {
        return userRepository.findAllByOrderByTotalPointsDesc();
    }
}
