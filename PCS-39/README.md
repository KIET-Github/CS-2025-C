# 🚀 Nexus Hub

**Nexus Hub** is a role-based academic project management system designed to streamline student project submissions, mentor evaluations, and administrative oversight. The system is structured into five well-defined architectural layers and supports role-specific workflows using **EJS**, **JavaScript**, **Node.js**, and **MongoDB**.

---

## 🛠️ Tech Stack

- **Frontend:** EJS, HTML, CSS, JavaScript
- **Backend:** Node.js with Express.js
- **Database:** MongoDB (NoSQL)
- **Architecture:** MVC pattern with RESTful APIs
- **Authentication:** Role-based access (Student, Manager, Admin)

---

## 🧠 Architectural Overview

### 1. **User Interface (UI) Layer**
- Built using **EJS** and **Vanilla JS**
- Responsive and user-friendly for students, managers, and admins
- Provides login, registration, project submission, and status views
- Dynamic rendering based on user role

### 2. **Project and Application Management Layer**
- **Project Management Module:** Handles creation, editing, and monitoring of student projects with guide assignments.
- **Application Processing Module:** Accepts and processes applications submitted by managers; manages approvals and workflow.

### 3. **Notification and Communication Layer**
- Sends system alerts via:
  - In-app notifications
  - Emails
- Notifies users of application approval/rejection and project updates

### 4. **Access Control and Role Management Layer**
- **Student:** Register, log in, submit/view projects
- **Manager:** Review applications, guide projects
- **Admin:** Manage users, oversee operations
- Role-based access ensures logical separation and data security

### 5. **Database and Storage Layer**
- Central repository using **MongoDB**
- Stores:
  - Project data
  - User records and roles
  - Applications and logs
  - System notifications
- RESTful API used for communication between layers

---

## 🔄 Data Flow Diagram (DFD)

```plaintext
+----------------+        +---------------------+
|     User       | -----> |    Nexus Hub UI     |
+----------------+        +---------------------+
                                |
     +---------------------------------------------------+
     |            Application / Project Management       |
     |    (Processes data and communicates with DB)      |
     +---------------------------------------------------+
                                |
                         +-------------+
                         |  MongoDB DB |
                         +-------------+
                                |
                   +--------------------------+
                   |  Notifications / Emails  |
                   +--------------------------+
                                |
                   +--------------------------+
                   |     Feedback to Users     |
                   +--------------------------+
