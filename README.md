# Helfy
> A gamified web app that helps individuals improve their health by completing daily actions and habits, and acquiring small amounts of essential knowledge, while developing a personalised visual companion that reflects their progress.

[Try Helfy](https://helfy.space)
## Features
### Learns
Each Learn contains essential information about a specific health-related topic. Each Learn consists of short paragraphs. Learns can be saved to your account.
### Actions
- There are daily **Tasks** that do not repeat. These are coloured white and are usually relevant to the current Learn. Some Tasks automatically turn into **Habits** (yellow border around the card), which means that on a given day, the Task will become a Habit that the user will need to complete every day.
- However, a Habit can only be removed 7 days after its creation. Also, any Task can be marked as a Habit manually by the user.
- Users receive **Action XP** for completing Tasks and Habits, but double the amount for Habits.
- Users can also *incomplete* Tasks/Habits, and the appropriate amount of Action XP will be subtracted from their accounts.
- Tasks can be delayed (Habits not), but then user will receive less XP.
### Companion
A Companion refers to a 2D character that can be customised by purchasing different accessories for Action XP.
### Stats
- Streak
- Amount of Action XP
- Amount of Learn XP
## Platform & Access
- **Platform:** Web App (server-hosted on Hostinger VPS)
- **Access:** https://helfy.space
- **Sign-Up:** Required. Users must create a free account using their email address.
- **No Installation Required:** Runs directly in the browser with no download needed.
- **Dependencies:** None for the end user, besides internet connection.
## Plus Plan
- Paid plan ('Plus') unlocks unlimited plans and features in the app.
## How to use
Currently there is only two health plans available - no diets, no bullshit (Nutrition) and 02133 Training (Fitness/Training).
1. Sign up using email and password or use Google to continue.
2. Read Learns and receive Learn XP.
3. Complete Tasks or/and Habits.
4. Develop your Companion and buy some accessories for it.

## Tech stuff
- Backend is built in Python using [FastAPI](https://github.com/fastapi/fastapi)
- Frontend is built on [React](https://github.com/facebook/react)
- [NGINX](https://github.com/nginx/nginx) is used as a reverse proxy, rate limiter, and to attach cache control headers to the responses from the Amazon S3 Bucket
- Amazon S3 for storing assets, like Companion and accessories images
- PostgreSQL
- Docker/Docker-Compose

## Development & Contribution
Currently Helfy is being developed and maintained by:
- **Marat Karlin:** [GitHub](https://github.com/orngsoftware) , [LinkedIn](https://www.linkedin.com/in/marat-karlin-219063266/)

Project is not yet open to public contributions. Feedback, suggestions and ideas are more than welcomed.
