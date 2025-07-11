# Gurukul: A Production-Ready Learning Management System

*   **Live Demo:** `[Gurukul Live Demo](https://gurukul-v3.vercel.app/)`
*   **Keywords:** Next.js, App Router, Drizzle ORM, PostgreSQL, Stripe, Cloudinary, Server Actions, shadcn/ui, TypeScript, Production-Ready

## 1. Project Philosophy & Architectural Goals

**What is Gurukul?** Gurukul is a modern, full-stack Learning Management System (LMS) designed for both content creators and learners, providing a seamless and secure experience from course creation to consumption. It serves as a production-grade blueprint for building sophisticated, data-driven web applications.

**Architectural Pillars:** The development of Gurukul was guided by several core principles to ensure it is robust, maintainable, and scalable.

*   **Security First:** The architecture prioritizes security at every layer.
    *   **Server-Side Authorization:** Critical pages, such as the course player (`app/(main)/courses/[slug]/learn/page.tsx`), perform authorization checks on the server *before* rendering any UI. This prevents unauthorized data exposure by verifying user enrollment via `checkUserEnrollment` before passing data to the client.
    *   **Secure Media Uploads:** File uploads use a **Direct Signed Upload** pattern. The server generates a short-lived, unique signature for Cloudinary (`lib/cloudinary.action.ts`), which the client then uses to upload the file directly. This ensures the application server is never a bottleneck and doesn't process potentially malicious file data.
    *   **Environment Segregation:** Environment variables are strictly validated and separated between server and client contexts using `@t3-oss/env-nextjs` (`utils/env.ts`), preventing accidental exposure of server secrets to the browser.

*   **Separation of Concerns (SoC):** The codebase is deliberately structured to isolate different logic domains.
    *   **Data Access Layer (DAL):** The project implements a clean DAL pattern (`lib/dal.ts` and `lib/data/queries.ts`). This abstracts the database logic, so application-level code (like Server Actions) interacts with business-oriented functions, not raw database queries.
    *   **UI and State Management:** Interactive UI logic is encapsulated in Client Components, which receive their data from parent Server Components, cleanly separating server-side data fetching from client-side state management.

*   **Performance & Scalability:** The application is built for high performance and designed to scale.
    *   **Hybrid Rendering:** The Next.js App Router is used to its full potential. Public-facing pages (`/courses`, `/instructors`) are statically generated for fast loads and SEO, while dynamic, user-specific pages are rendered on-demand.
    *   **Caching:** React's `cache` function is used for memoizing data requests (`lib/dal.ts`), preventing redundant database queries within a single render pass.
    *   **Offloading Heavy Tasks:** Computationally expensive tasks are delegated to specialized services. Stripe handles complex payment logic, and Cloudinary manages all media processing, transformation, and delivery.

*   **Developer Experience:** A key goal was to create a codebase that is a pleasure to work in.
    *   **End-to-End Type Safety:** TypeScript is used throughout the project. Drizzle ORM provides type-safe database queries, and Zod ensures type-safe validation from form inputs to API boundaries.
    *   **Component System:** `shadcn/ui` provides a foundation for a consistent, accessible, and easily customizable component library, located in `components/ui`.

## 2. Core Feature Deep Dive

### User Authentication System
*   **Provider:** `better-auth`
*   **Methods:** Email/Password authentication is fully implemented, alongside OAuth for GitHub. The system is designed to easily accommodate additional providers.
*   **Session Management:** A dual strategy ensures both security and a reactive UI.
    *   **Server-Side:** `lib/auth/session.ts` provides a cached `getAuth` function for server-side components and actions to securely access the current user's session from the request headers.
    *   **Client-Side:** The `useAuth` hook (`lib/auth/use-session.ts`) provides a client-safe way to access session data, enabling dynamic UI rendering based on authentication state.

### Course & Instructor Discovery
*   **Implementation:** The paginated routes for courses (`/courses/page/[page]`) and instructors (`/instructors/page/[page]`) are statically generated at build time using Next.js's `generateStaticParams`.
*   **Rationale:** This approach ensures that public-facing, high-traffic pages are delivered instantly from a CDN, providing an excellent user experience and maximizing SEO value.

### E-commerce & Payments
*   **Provider:** Stripe
*   **Flow:** The payment flow is robust and secure, designed to handle transactions without compromising user data or application integrity.
    1.  The client-side `PurchaseButton` requests a checkout session from the `/api/stripe/checkout-session` API route.
    2.  This server-side route validates the user's session and the course, then securely creates a Stripe Checkout session with the `userId` and `courseId` embedded in the metadata.
    3.  The client is redirected to the Stripe-hosted checkout page.
    4.  Upon successful payment, Stripe sends a `checkout.session.completed` event to the `/api/webhooks/stripe` endpoint.
    5.  This webhook handler verifies the request's authenticity using a signing secret, then calls the `fulfillCoursePurchase` function in the DAL. This function atomically creates the `enrollment` and `purchase` records in the database and increments the course's `enrollmentCount`.

### Secure Media Management
*   **Provider:** Cloudinary
*   **Pattern:** **Direct Signed Uploads**. This advanced pattern is used for all video uploads to ensure scalability and security.
    1.  The client (e.g., `AddLectureDialog`) calls the `generateUploadSignature` server action, requesting permission to upload a file to a specific folder.
    2.  The server action, using the Cloudinary API secret, generates a unique, time-limited signature and returns it to the client. The server *never* processes the file itself.
    3.  The client uses this signature to make a direct API call to Cloudinary, uploading the file. Cloudinary validates the signature and accepts the file.
    4.  This isolates the Next.js server from the resource-intensive task of file uploading, making the application more scalable and resilient.

### Course Content Management (Instructor Flow)
*   **Course Creation/Editing:** The `CourseForm` component provides a comprehensive interface for managing all course metadata. All inputs are validated client-side and server-side using a shared Zod schema.
*   **Section & Lecture Management:** A highly interactive UI (`app/(main)/courses/create/section/page.tsx`) allows instructors to structure their courses. It features drag-and-drop reordering for both sections and lectures within sections, powered by `@dnd-kit/sortable`. All changes are sent in a single batch to the `upsertSectionsAndLecturesAction`, which processes the entire course structure in a single database transaction.
*   **Rich Text Editing:** The `RichTextEditor` is powered by **Tiptap**, providing a modern, extensible writing experience for detailed course descriptions.

### Course Consumption (Student Flow)
*   **Authorization:** The course player page (`app/(main)/courses/[slug]/learn/page.tsx`) is a Server Component that acts as a security gatekeeper. It fetches the user's session and checks for a valid enrollment *before* rendering any part of the page, redirecting if access is denied.
*   **UI:** The player uses a two-column layout managed by the `CoursePlayerClient` component. This client component holds the state for the `activeLecture` and passes it down to the `VideoDisplay` (for video playback with Video.js) and `CourseSidebar` (for navigation) components.

## 3. Technical Architecture Deep Dive

### Data Flow: The Data Access Layer (DAL)
The application's data flow is meticulously structured to ensure maintainability and a clear separation of concerns.

`Component` → `Server Action` → `DAL (dal.ts)` → `Query (queries.ts)` → `Database`

*   **`queries.ts` (The Private API):** This is the lowest-level data access file. Its sole responsibility is to contain the raw Drizzle ORM queries and interact directly with the database schema. It is considered the "private API" of the data layer and should not be called directly from anywhere except `dal.ts`.

*   **`dal.ts` (The Public API):** This file acts as the application's public data interface. Server Actions and API Routes call functions from this file to fetch or mutate data. It orchestrates calls to `queries.ts` and is responsible for any necessary data transformation (e.g., `parseFloat` for numeric types, `toISOString` for dates) to ensure the rest of the application receives data in a consistent and predictable format. This abstraction decouples the application from the specific database implementation, making future refactors or migrations significantly easier.

### Caching & Revalidation Strategy
The application employs a sophisticated caching and revalidation strategy to balance performance with data freshness.

*   **Caching:** By default, Next.js aggressively caches data fetched in Server Components, including database queries made via the DAL. This means that navigating between statically generated pages or re-visiting dynamic pages is extremely fast.

*   **The Problem of Stale Data:** After a mutation (e.g., updating a course title), the cached data becomes stale, and users would not see the change.

*   **The Solution (A Two-Part Invalidation):**
    1.  **`revalidatePath` (Server-Side):** When a Server Action successfully completes a mutation, it calls `revalidatePath('/')`. This purges the *server's data cache* for all routes, ensuring that the next request for any page will re-fetch fresh data from the database. A more granular `revalidateTag` could be used for further optimization.
    2.  **`router.refresh()` (Client-Side):** After the server action completes, the client-side component that invoked it calls `router.refresh()`. This tells the Next.js router to invalidate its *client-side cache* and re-fetch the current page's Server Component payload from the server, seamlessly updating the UI without a full page reload.

### Environment Management
*   **Type-Safe Variables:** The project uses `t3-oss/env-nextjs` to validate and provide type-safe access to all environment variables. This prevents runtime errors caused by missing or malformed variables.
*   **Server/Client Separation:** The `utils/env.ts` file strictly separates variables into `server` and `client` objects. This is a critical security measure that makes it impossible to accidentally expose server-side secrets to the client bundle.
*   **Dynamic Base URL:** The `NEXT_PUBLIC_APP_URL` variable in `utils/env.ts` is configured to dynamically use `process.env.VERCEL_URL` when deployed on Vercel. This is essential for features like OAuth redirects and webhook URLs to function correctly in Vercel's preview deployments, which have unique, dynamically generated URLs.

## 4. Local Development Guide

### 1. Prerequisites
*   Node.js (v18.0 or later)
*   pnpm (or npm/yarn)
*   Docker & Docker Compose

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/jain-arihant-2002/gurukul-v3.git
cd gurukul-v3

# Install dependencies
pnpm install

# Set up environment variables by copying the example file
cp .env.example .env
```

### 3. Environment Variables
Fill in the `.env` file with your credentials. See the table in the previous response for a detailed explanation of each variable.

### 4. Database
```bash
# Start the local PostgreSQL container in the background
pnpm run dev:db

# Apply the database schema from db/schema.ts
pnpm drizzle-kit push

# (Optional) Open Drizzle Studio to view and manage your local database
pnpm run studio
```

### 5. Run Development Server
```bash
pnpm run dev
```
The application will be running at `http://localhost:3000`.

## 5. Deployment

*   **Platform:** The project is optimized for deployment on **Vercel**.
*   **Environment Variables:** All variables defined in `.env` must be added to the project's Environment Variables settings in the Vercel dashboard.
*   **Build & Deployment:** The standard Vercel workflow applies. A `git push` to the `main` branch (or a configured production branch) will automatically trigger a new build and deployment. No additional configuration is required.