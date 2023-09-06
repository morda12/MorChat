# MorChat App

## Overview

This is a private chat application built using Node.js with the following technologies: Express, Passport, MongoDB, and Socket.io. The app allows users to register, log in, and initiate private conversations with their friends. Below are instructions on how to use and set up the app.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Features](#features)
5. [License](#license)
6. [Contributing](#contributing)
7. [Support](#support)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your system.
- MongoDB installed and running.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/morda12/MorChat
   ```

2. Navigate to the project directory:

   ```bash
   cd *PATH*/MorChat
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure your environment variables. You need to set variables `PORT`, `DB_USER`, `DB_PASSWORD`, `DB_URL`, `SECRET_KEY`.

5. Start the server:

   ```bash
   npm start
   ```

Your chat app should now be running on `http://localhost:3000` (or a different port if configured).

## Usage

1. Open your web browser and navigate to `http://localhost:3000` (or the appropriate URL if configured differently).

2. Register for an account on the registration page (from the Login page).

3. Login with your registered credentials on the login page.

4. After logging in, you can start adding friends to your chat list and initiate private conversations with them.

## Features

- User Registration: Users can create accounts by providing their details on the registration page.
- User Authentication: Users can log in securely using their registered credentials.
- Friend Management: Users can add friends to their chat list.
- Private Messaging: Users can initiate private conversations with their friends.
- Real-time Updates: The app utilizes Socket.io for real-time chat functionality.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

I welcome contributions from the community. To contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request to merge your changes into the main repository.

## Support

If you encounter any issues or have questions, please contact [Mor David](mailto:mordavid4@gmail.com) for assistance.

Thank you for using our MorChat App! We hope you find it useful.
