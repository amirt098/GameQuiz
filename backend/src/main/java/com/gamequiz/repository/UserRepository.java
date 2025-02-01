package com.gamequiz.repository;

import com.gamequiz.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    List<User> findAllByOrderByTotalPointsDesc(Pageable pageable);
    List<User> findAllByOrderByTotalPointsDesc();
}
