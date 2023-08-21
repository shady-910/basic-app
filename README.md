## Table of Contents

- [Requirements](#requirements)
- [Stack](#stack)
- [Setup](#setup)
- [Deployment](#deployment)
- [Installing the app](#installing-the-app)
- [Preview](#preview)

## Purpose

An application that manages apartment rentals

## Stack

Android and iOS app for phones and tablets. Future support for a web app version can be added with some minor changes in the codebase.

- React Native (Expo)
- Firebase (Authentication + Cloud Functions + Firestore)
- Node Express
- TypeScript
- ESLint
- Prettier
- React Native Paper
- React Navigation

## Setup

1. Install Expo CLI
   `$ npm install -g expo-cli`

2. Install Firebase CLI
   `$ npm install -g firebase-tools`

3. Ensure correct Node version is installed
   `$ nvm install && nvm use`

4. Install dependencies
   `$ yarn`

5. Start Expo development server
   `$ yarn start`

## Deployment

Run the command `$ yarn deploy` to deploy both Firebase Security Rules + Indexes and Expo app to the link below. Sign in to both Firebase and Expo will be required.
