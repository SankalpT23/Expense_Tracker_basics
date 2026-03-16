package com.ExpenseTraceker.Backend.Repository;

import com.ExpenseTraceker.Backend.Model.Expenso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ExpensoRepository extends JpaRepository<Expenso, Long> {
    List<Expenso> findByCategory(String category);
    List<Expenso> findByDateBetween(LocalDateTime start, LocalDateTime end);
    Optional<Expenso> findById(Long id);

}
