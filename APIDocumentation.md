# API Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Endpoints](#endpoints)
   - [Endpoint 1](#endpoint-1)
   - [Endpoint 2](#endpoint-2)
4. [Authentication](#authentication)
5. [Rate Limits](#rate-limits)
6. [Examples](#examples)
7. [FAQs](#faqs)
8. [Changelog](#changelog)
9. [Contact Information](#contact-information)

### Introduction <a name="introduction"></a>

- A full-stack web application consists of both a React-based front-end and Node.js based back-end.
- Allow admin users to create their own apps with their self defined pages and calculations.
  - Set page and variable numbers elaborately.
  - Auto calculate defined formulas and display results.
- Involves endpoints and CRUD operations as well as validation.

### Getting Started <a name="getting-started"></a>
  - Base Url of front-end: `http://localhost:5173`
  - Base Url of back-end: `http://localhost:5000 (or http://localhost:8000)`
  - server for back-end and client for front-end

#### To run server
```
npm install
npm start
```

#### To run client
```
npm install
npm run dev
```

### Endpoints <a name="endpoints"></a>

#### Login Endpoint - /login <a name="endpoint-1"></a>
- The `/login` endpoint is used for user authentication.


#### Endpoint 2 <a name="endpoint-2"></a>

...

### Authentication <a name="authentication"></a>

...

### Rate Limits <a name="rate-limits"></a>

...

### Examples <a name="examples"></a>

...

### FAQs <a name="faqs"></a>

...

### Changelog <a name="changelog"></a>

...

### Contact Information <a name="contact-information"></a>

...


### 

### Authentication
- First, user must register, (/register), with the following info and selection.
  - Full Name
    - Type: String
    - Required: Yes
      - Error(s): Full name is required!
  - Email
    - Type: String
    - Required: Yes
    - Validation: Email validation with regex
      - Error(s): Email is required || Invalid email address
  - Password
    - Type: String
    - Required: Yes
    - Requirement: At least 8 characters
      -Error(s): Password is required! || Password should be at least 8 characters
  - Role
    - Type: String
    - Default: Customer
    - Required: Yes
- After registeration, user is directed to Login page (/login).
  - User can 