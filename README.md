# Re-Commend

## Introduction

Re-commender is a recommendation system that recommends movies to users based on their preferences. It uses ChatGPT to generate recommendations based on user input. The system will use a collaborative filtering algorithm to recommend movies based on user ratings.

## Installation

To install the required packages, run the following command:

```bash
pnpm install
```

## Repository Structure

Main directories in the repository:

| Directory | Description |
| --- | --- |
| `services` | Contains the backend service and other related services. |
| `applications` | Contains the frontend web application. |
| `packages` | Contains shared packages. |

Subdirectories:

| Directory | Description |
| --- | --- |
| `services/hermes` | Backend service for the recommendation system. |

## Usage

To start the backend service in **dev** mode, run the following command:

```bash
pnpm run dev:hermes
```
