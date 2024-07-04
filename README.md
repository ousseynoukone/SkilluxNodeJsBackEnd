# Skillux Mobile App

Skillux is a mobile application designed to connect learners and experts in various fields, facilitating knowledge sharing and skill development.

## MVP Features

### 1. User Profiles
- Create basic profiles with names, profile pictures, and areas of expertise/interests

### 2. Content Sharing
- Share text-based content (tutorials, guides)
- Include images or videos with content
- tag content based on subjects or technologies
- Upvote, comment, and provide feedback on shared content

### 3. Search and Discovery
- Recommendation algorythm based on user's tags preferences
- Search functionality for finding relevant content, experts, or learners
- Followed users feed
- Discovery feed


### 4. User Connections
- Follow or connect with users sharing similar interests or expertise levels
- Activity feed/timeline displaying updates from followed users
- Push notifications for new posts

## Technical Stack

- Backend: Node.js with Express
- Database: PostgreSQL with Sequelize ORM
- Frontend: Flutter

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)

### Endpoints (Swagger-autogen)
Swagger autogen used : You might have as well a glimpse of all endpoints and some additional informations , but since it's auto-genarated , you might not have all effective informations. Refer to mostly PostMan collection.

#### SWGGER IS RUNNING AT  {host}/api-docs:{server_port}




### Installation

1. Clone the repository
    https://github.com/ousseynoukone/SkilluxNodeJsBackEnd.git
    https://github.com/ousseynoukone/skilluxfrontendflutter.git

2. Install dependencies
        npm install

3. Install Sequelize CLI 
        npm install -g sequelize-cli

### Database Setup

1. Create the database
        npx sequelize-cli db:create

2. Run migrations
        npx sequelize-cli db:migrate

3. Run the server ( BEFORE SEEDING FOR APPLYING ASSOCIATIONS)
    # For production:
        npm start
    # For development:
        npm run start:dev

4. (Optional) Seed the database
        npx sequelize-cli db:seed:all





## Contact

For any queries regarding this project, please contact:

Your Ousseynou - ousseynou781227@gmail.com