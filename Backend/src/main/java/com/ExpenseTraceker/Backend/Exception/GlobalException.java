package com.ExpenseTraceker.Backend.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalException {

    @ExceptionHandler(ExpensoNotFoundException.class)
    public ResponseEntity<String> handleExpenseNotFoundException(ExpensoNotFoundException e){
        return new ResponseEntity<>("Expense Not Found with Id", HttpStatus.NOT_FOUND);
    }
}
