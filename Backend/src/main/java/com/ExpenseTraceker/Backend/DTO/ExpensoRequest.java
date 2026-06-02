package com.ExpenseTraceker.Backend.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be under 100 characters")
    private String title;

    @Size(max = 255, message = "Note must be under 255 characters")
    private String note;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotBlank(message = "Category is required")
    private String category;

    private LocalDateTime date;
}
