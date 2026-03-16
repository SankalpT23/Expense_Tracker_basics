package com.ExpenseTraceker.Backend.Exception;



public class ExpensoNotFoundException extends RuntimeException{
    public ExpensoNotFoundException(String message){
        super(message);
    }
}
