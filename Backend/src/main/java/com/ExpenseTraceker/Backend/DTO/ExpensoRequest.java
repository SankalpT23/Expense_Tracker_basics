package com.ExpenseTraceker.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpensoRequest {

    private String title;

    private String note;

    private BigDecimal amount;
    private String category;

    private LocalDateTime date;

}
