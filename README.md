# AKS Java Chat Filter - Global Chat Application

A full-stack **global chat application** with **Spring Boot 3.x** backend and **Next.js 14 + Tailwind CSS** frontend. Features real-time message filtering, user nicknames, timestamps, and rejection reasons - all without requiring login or authentication.

## Key Features

### 🌍 Global Chat

- Anonymous nickname-based chat (no login required)
- Real-time message display with timestamps (user's local time)
- Messages visible to all users in the chat room

### 🛡️ Smart Message Filtering

- Automatic content moderation
- Shows **rejection reasons** for blocked messages
- Messages containing "toxic" are automatically filtered
- Approved messages display normally

### 👤 User Management

- Create a custom nickname to enter the chat
- Change nickname anytime during the conversation
- Nickname stored in browser's localStorage

### 💬 Message Details

- **Author**: Each message displays the sender's nickname
- **Timestamp**: Shows when the message was created (in user's local time)
- **Status**: Visual indicators (✅ Approved or 🚫 Blocked)
- **Rejection Reason**: Displays why a message was rejected

## Project Structure

```
aks-java-chat-filter/
├── Backend (Spring Boot 3.x - JDK 17)
│   ├── src/main/java/com/example/akschatfilter/
│   │   ├── Application.java
│   │   ├── controller/ChatController.java
│   │   ├── entity/ChatMessage.java
│   │   └── repository/ChatMessageRepository.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
├── Frontend (Next.js 14 + Tailwind CSS)
│   ├── app/
│   │   ├── layout.jsx
│   │   ├── page.jsx (Main chat interface)
│   │   └── globals.css
│   ├── components/
│   │   ├── ChatMessage.jsx (Message display)
│   │   └── NicknameModal.jsx (Nickname input)
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── jsconfig.json
│
└── Configuration Files
```

## Features Overview

### Backend Enhancements

- **Message Metadata**: Stores username, timestamp, and rejection reasons
- **Smart Filtering**: Detects prohibited words and provides specific rejection reasons
- **Sorted Messages**: Returns messages in chronological order (newest first)
- **No Authentication**: Anonymous access with nickname-based identification

### Frontend Features

- **Nickname System**: Modal dialog for setting/changing user nickname
- **Local Storage**: Persists nickname across browser sessions
- **Timestamp Display**: Shows creation time in user's local timezone
- **Message Details**: Displays author, time, content, and status
- **Rejection Details**: Shows specific reason why a message was blocked
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Message pop-in animations for better UX

## Requirements

- Java 17 or later
- Maven 3.6+
- Node.js 18+ and npm 9+

## Getting Started

### Prerequisites Setup

Ensure you have installed:

- Java 17+
- Maven 3.6+
- Node.js 16+ with npm

### Step 1: Clone or Navigate to the Project

```bash
cd aks-java-chat-filter
```

### Step 2: Build and Run the Spring Boot Backend

In a terminal, navigate to project root and run:

```bash
# Clean and build the project
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

The backend API will be available at: **http://localhost:8080**

Backend will auto-start with these endpoints:

- `GET /api/chat` - Retrieve all messages
- `POST /api/chat` - Create a new message

### Step 3: Setup and Run the Next.js Frontend

In a new terminal window, navigate to the project root:

```bash
# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

The Next.js frontend will be available at: **http://localhost:3000**

The Next.js server will automatically proxy API calls to `http://localhost:8080` using the rewrites configuration.

### Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## How to Use

1. **Start the Application**
   - Backend: `mvn spring-boot:run` (runs on http://localhost:8080)
   - Frontend: `npm run dev` (runs on http://localhost:3000)

2. **Enter the Chat**
   - Open http://localhost:3000
   - A modal will ask you to create a nickname
   - Enter a nickname (2-30 characters) and click "Continue to Chat"

3. **Send Messages**
   - Type your message in the textarea
   - Click "Send Message"
   - Your message appears instantly in the global chat room

4. **Message Status**
   - ✅ **APPROVED**: Messages are displayed normally with your nickname and timestamp
   - 🚫 **BLOCKED**: Messages containing "toxic" show the rejection reason instead of content

5. **Change Nickname**
   - Click "Change Nickname" at the top of the chat
   - Enter a new nickname and proceed
   - Your nickname is saved and used for all future messages

6. **View Message Details**
   - **Author**: See who sent the message
   - **Timestamp**: Shows exact date and time (in your local timezone)
   - **Rejection Reason**: If blocked, explains why the message was filtered

## API Endpoints

### REST API (Spring Boot Backend)

Base URL: `http://localhost:8080/api/chat`

#### GET /api/chat

Retrieve all messages sorted by creation date (newest first)

**Response Example:**

```json
[
  {
    "id": 1,
    "username": "Alice",
    "content": "Hello everyone!",
    "status": "APPROVED",
    "rejectionReason": null,
    "createdAt": "2026-02-23T14:30:45"
  },
  {
    "id": 2,
    "username": "Bob",
    "content": "This message contains toxic behavior!",
    "status": "BLOCKED",
    "rejectionReason": "Message contains prohibited word: 'toxic'",
    "createdAt": "2026-02-23T14:25:30"
  }
]
```

#### POST /api/chat

Create a new message with automatic filtering

**Request Body:**

```json
{
  "username": "YourNickname",
  "content": "Your message here",
  "status": ""
}
```

**Response:** Returns the created message with auto-assigned status and optional rejection reason

**Filtering Rules:**

- Messages containing "toxic" (case-insensitive) → Status: BLOCKED + rejection reason
- All other messages → Status: APPROVED

### Example Requests

**GET all messages:**

```bash
curl http://localhost:8080/api/chat
```

**POST an approved message:**

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "username":"Alice",
    "content":"Hello, this is a great message!",
    "status":""
  }'
```

**POST a blocked message:**

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "username":"Bob",
    "content":"This message contains toxic behavior!",
    "status":""
  }'
```

## Database Console

Access the H2 console at:

```
http://localhost:8080/h2-console
```

Default credentials:

- **URL**: jdbc:h2:mem:testdb
- **User**: sa
- **Password**: (empty)

## Example Scenarios

### Approved Message

```
User: Alice
Message: "Hello everyone! Hope you're having a great day!"
Status: ✅ APPROVED
Timestamp: Feb 23, 2026, 2:30:45 PM
```

### Blocked Message

```
User: Bob
Message: [Blocked]
Status: 🚫 BLOCKED
Timestamp: Feb 23, 2026, 2:25:30 PM
Reason: "Message contains prohibited word: 'toxic'"
```

## Technologies Used

### Backend

- **Spring Boot 3.2.2** - Java web application framework
- **Spring Web** - REST API support with @RestController
- **Spring Data JPA** - Object-relational mapping and database access
- **Jakarta Persistence API** - JPA with LocalDateTime for timestamps
- **H2 Database** - In-memory relational database
- **Apache Maven** - Build automation and dependency management

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI component library with hooks
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **PostCSS & Autoprefixer** - CSS processing

### Key Features Implemented

- **Timestamp Handling**: `LocalDateTime` for server, `Date` formatting for local display
- **Message Filtering**: Content moderation with specific rejection reasons
- **Local Storage**: Browser-based nickname persistence (no database required for users)
- **No Authentication**: Anonymous nickname-based chat system
- **CORS Enabled**: Cross-origin requests for frontend-backend communication

## Author

Created as a demonstration of building a **modern full-stack chat application** with:

- Spring Boot 3.x backend with advanced entity mapping
- Next.js 14 frontend with component-based architecture
- Tailwind CSS for professional styling
- Anonymous user system with nickname persistence
- Real-time message filtering and moderation
- Timezone-aware timestamp display

Perfect for showcasing Java/Spring expertise alongside modern React development practices.
