package com.ExpenseTraceker.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpensoResponse {
    private Long id;
    private String title;
    private String note;

    private String category;
    private BigDecimal amount;
    private LocalDateTime date;

    private List<ExpensoResponse> expenses;
}
