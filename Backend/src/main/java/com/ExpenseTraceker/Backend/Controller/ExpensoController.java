package com.ExpenseTraceker.Backend.Controller;

import com.ExpenseTraceker.Backend.DTO.ExpensoRequest;
import com.ExpenseTraceker.Backend.DTO.ExpensoResponse;
import com.ExpenseTraceker.Backend.DTO.MonthlyResponse;
import com.ExpenseTraceker.Backend.Service.ExpensoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/expenso")
public class ExpensoController {

    @Autowired
    private ExpensoService service;

    @PostMapping
    public ResponseEntity<ExpensoResponse> createNewExpense(@RequestBody ExpensoRequest request){
        ExpensoResponse expenso = service.createExpenso(request);
        return new ResponseEntity<>(expenso , HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExpensoResponse>> getAllExpense(){
        List<ExpensoResponse> allExpenso = service.getAllExpenso();
        return new ResponseEntity<>(allExpenso, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpensoResponse> updateExpenses(@RequestBody ExpensoRequest request, @PathVariable Long id){
        ExpensoResponse expensoResponse = service.updateExpenso(request, id);
        return new ResponseEntity<>(expensoResponse,HttpStatus.OK);
    }

    @GetMapping("/byCategory")
    public ResponseEntity<List<ExpensoResponse>> listByCategory(@RequestParam String category){
        List<ExpensoResponse> expenseByCategory = service.getExpenseByCategory(category);
        return new ResponseEntity<>(expenseByCategory,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpensoResponse> listById(@PathVariable Long id){
        ExpensoResponse expenseById = service.getExpenseById(id);
        return new ResponseEntity<>(expenseById,HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id){
        service.deleteExpense(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ExpensoResponse>> filterByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end){
        List<ExpensoResponse> expenseByDate = service.getExpenseByDate(start, end);
        return new ResponseEntity<>(expenseByDate,HttpStatus.OK);
    }

    @GetMapping("/summary")
    public ResponseEntity<MonthlyResponse> getMonthlySummary(
            @RequestParam int month,
            @RequestParam int year) {
        MonthlyResponse monthlyExpense = service.getMonthlyExpense(month, year);
        return new ResponseEntity<>(monthlyExpense, HttpStatus.OK);
    }
}
