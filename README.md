
# Decidе Backend (Portfolio Version)

**Node.js + NestJS + TypeScript Backend for Decidе App**

This repository contains the backend of **Decidе**, a web and mobile application designed to deliver fast, personalized recommendations.
This version highlights the **technology, architecture, and development skills**, without exposing proprietary business logic or algorithms.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Database](#database)
6. [Authentication & Authorization](#authentication--authorization)
7. [Search & Recommendations](#search--recommendations)
8. [Payments & Integrations](#payments--integrations)
9. [Deployment & Infrastructure](#deployment--infrastructure)
10. [Monitoring & Logging](#monitoring--logging)
11. [Getting Started](#getting-started)
12. [Contributing](#contributing)
13. [License](#license)

---

## Project Overview

Decidе is a **web and mobile app** that helps users make decisions quickly.
This portfolio version focuses on **backend development, system architecture, and integrations** rather than proprietary recommendation logic.

**Target Audience:**

* Users: general audience interested in food, entertainment, tourism
* Businesses: restaurants, cafes, bars, entertainment venues

**Core Skills Demonstrated:**

* Backend architecture and modular design
* API development (REST/GraphQL)
* Database management and caching
* Integration with third-party services (maps, payments, OAuth)

---

## Features

* **User management:** registration, login, role-based access control
* **Content management:** businesses can manage venues, promotions, and analytics
* **Search & filtering:** fast, scalable search via Elasticsearch/OpenSearch
* **Geolocation support:** map integration and geo-queries
* **Payments:** integration with Stripe, PayPal, Paddle
* **Personalization framework:** backend structure ready for future recommendation logic

> Note: Proprietary recommendation algorithms are not included in this public version.

---

## Tech Stack

**Backend:**

* Node.js + NestJS + TypeScript
* MongoDB (user profiles, venues, reviews)
* Redis (cache, sessions, counters)
* PostgreSQL (transactions, subscriptions)
* Elasticsearch / OpenSearch (search & filtering)

**Frontend / Mobile (integrated):**

* Next.js + React + TypeScript + Tailwind CSS
* React Native + TypeScript

**Infrastructure:**

* Docker
* CI/CD: GitHub Actions
* Hosting: Vercel (frontend), Railway / AWS / GCP (backend)

**Other Integrations:**

* OAuth (Google, Apple)
* Google Maps API / Mapbox
* Stripe / PayPal / Paddle

---

## Architecture

* Modular backend with NestJS
* Ready for microservices and horizontal scaling
* REST APIs (GraphQL optional)
* JSON data format
* Scalable caching and task queues

---

## Database

* **MongoDB:** flexible schemas for user profiles, venues, reviews
* **PostgreSQL:** structured, reliable storage for transactions and subscriptions
* **Redis:** caching, session management, real-time counters

---

## Authentication & Authorization

* JWT + Refresh token system
* OAuth login (Google, Apple)
* Role-based access control (User / Business / Admin)

---

## Search & Recommendations

* Elasticsearch/OpenSearch for fast venue search
* Filtered queries and scoring framework ready for future algorithms

> Algorithm logic is proprietary and **not included** in this portfolio version.

---

## Payments & Integrations

* Stripe, PayPal, Paddle integration
* Subscription management
* Third-party API integration for maps and payments

---

## Deployment & Infrastructure

* Containerized with Docker
* Backend hosted on Railway / AWS / GCP
* Frontend on Vercel
* CI/CD via GitHub Actions
* Designed for scalability and performance

---

## Monitoring & Logging

* Sentry for error tracking
* Prometheus + Grafana for metrics
* Optional tools for user behavior analytics (LogRocket / PostHog)

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/decide-backend.git
cd decide-backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`

4. Run in development mode:

```bash
npm run start:dev
```

---

## Contributing

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Open a Pull Request

---


## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---


