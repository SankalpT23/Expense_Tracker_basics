package com.ExpenseTraceker.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyResponse {

    private BigDecimal totalAmount;

    private Map<String,Double> categoryWise;
}
