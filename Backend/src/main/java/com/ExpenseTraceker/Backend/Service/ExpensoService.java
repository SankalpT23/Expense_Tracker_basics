package com.ExpenseTraceker.Backend.Service;

import com.ExpenseTraceker.Backend.DTO.ExpensoRequest;
import com.ExpenseTraceker.Backend.DTO.ExpensoResponse;
import com.ExpenseTraceker.Backend.DTO.MonthlyResponse;
import com.ExpenseTraceker.Backend.Exception.ExpensoNotFoundException;
import com.ExpenseTraceker.Backend.Model.Expenso;
import com.ExpenseTraceker.Backend.Repository.ExpensoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.*;

@Service
public class ExpensoService {
    @Autowired
    private ExpensoRepository expensoRepository;

    @Autowired
    private Expenso expenso;

    public ExpensoResponse createExpenso(ExpensoRequest expensoRequest) {
        BeanUtils.copyProperties(expensoRequest, expenso);
        expenso.setDate(LocalDateTime.now());
        Expenso save = expensoRepository.save(expenso);

        return ExpensoResponse.builder()
                .id(save.getId())
                .category(save.getCategory())
                .title(save.getTitle())
                .note(save.getNote())
                .amount(save.getAmount())
                .date(save.getDate())
                .build();
    }


    public ExpensoResponse updateExpenso(ExpensoRequest expensoRequest,Long id) {
        Expenso existingExpense = expensoRepository.findById(id).orElseThrow(() -> new ExpensoNotFoundException("Expense Not Found with Id : " + id));
        existingExpense.setTitle(expensoRequest.getTitle());
        existingExpense.setNote(expensoRequest.getNote());
        existingExpense.setAmount(expensoRequest.getAmount());
        existingExpense.setDate(expensoRequest.getDate());
        existingExpense.setCategory(expensoRequest.getCategory());
        Expenso save = expensoRepository.save(existingExpense);

        return ExpensoResponse.builder()
                .id(save.getId())
                .category(save.getCategory())
                .title(save.getTitle())
                .note(save.getNote())
                .amount(save.getAmount())
                .date(save.getDate())
                .build();

    }

    public List<ExpensoResponse> getAllExpenso() {
        List<ExpensoResponse> expenses = new ArrayList<>();
        List<Expenso> expensesList = expensoRepository.findAll();
        for (Expenso expenso : expensesList) {
            ExpensoResponse expensoResponse = new ExpensoResponse();
            BeanUtils.copyProperties(expenso, expensoResponse);
            expenses.add(expensoResponse);
        }
        return expenses;
    }

    public List<ExpensoResponse> getExpenseByCategory(String category) {
        List<ExpensoResponse> expenses = new ArrayList<>();
        List<Expenso> byCategory = expensoRepository.findByCategory(category);
        for (Expenso expenso : byCategory) {
            ExpensoResponse expensoResponse = new ExpensoResponse();
            BeanUtils.copyProperties(expenso, expensoResponse);
            expenses.add(expensoResponse);
        }
        return expenses;
    }

    public ExpensoResponse getExpenseById(Long id){
        Expenso byId = expensoRepository.findById(id).orElseThrow(() -> new ExpensoNotFoundException("Expense Not Found By Id : " + id));
        ExpensoResponse expensoResponse = new ExpensoResponse();
        BeanUtils.copyProperties(byId, expensoResponse);
        return expensoResponse;
    }

    public void deleteExpense(Long id){
        expensoRepository.deleteById(id);
    }

    public List<ExpensoResponse> getExpenseByDate(LocalDateTime start, LocalDateTime end){
        List<ExpensoResponse> expenses = new ArrayList<>();
        List<Expenso> byDateBetween = expensoRepository.findByDateBetween(start, end);
        for (Expenso expenso : byDateBetween){
            ExpensoResponse response = new ExpensoResponse();
            BeanUtils.copyProperties(expenso,response);
            expenses.add(response);
        }
        return expenses;
    }

    public MonthlyResponse getMonthlyExpense(int month, int year){
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0, 0);
        LocalDateTime end = YearMonth.of(year,month).atEndOfMonth().atStartOfDay();
        List<Expenso> range = expensoRepository.findByDateBetween(start, end);
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (Expenso expenso : range) {
            BigDecimal amount = expenso.getAmount();
            totalAmount = totalAmount.add(amount);
        }
        Map<String,Double> categoryWise = new HashMap<>();
        for (Expenso expenso : range) {
            String category = expenso.getCategory();
            BigDecimal amount = expenso.getAmount();


            if(categoryWise.containsKey(category)){
                categoryWise.put(category, categoryWise.get(category)+amount.doubleValue());
            }else {
                categoryWise.put(category, amount.doubleValue());
            }
        }
        return new MonthlyResponse(totalAmount,categoryWise);
    }
}
