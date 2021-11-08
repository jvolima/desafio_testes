# Desafio testes unitários

## Testes desenvolvidos

### Create user
- [x] should be able to create a new user
- [x] should not be able to create a user with an existent email

### Authenticate user
- [x] should be able to authenticate an user
- [x] should not be able to authenticate an user if email is wrong
- [x] should not be able to authenticate an user if password is wrong

### Show user profile
- [x] should be able to show user profile
- [x] should not be able to show user profile if the user does not exists

### Create statement
- [x] should be able to create a new statement
- [x] should not be able to create a new statement if user does not exists
- [x] should not be able to create a withdraw statement if the amount is greater than the balance

### Get balance
- [x] should be able to get user balance
- [x] should not be able to get balance if user does not exists

### Get statement operation
- [x] should be able to get an statement operation
- [x] should not be able to get an statement operation if user does not exists
- [x] should not be able to get an statement operation if statement does not exists
