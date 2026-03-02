# AI Usage Survey 2026

A modern, free-tier web application built with Next.js (App Router), Tailwind CSS, custom components, Recharts, and Supabase Postgres. 
Provides a secure platform for organizational AI usage surveying, complete with a password-protected analytics dashboard.

## 🚀 Quick Setup Guide

### 1. Project Initialization
If you haven't yet, install dependencies:
```bash
npm install
```

### 2. Database Setup (Supabase Free Tier)
1. Go to [Supabase](https://supabase.com) and create a new project (Free Tier is sufficient).
2. Once your database is provisioned, go to the **SQL Editor** in the side menu.
3. Open `db/migrations.sql` from this repository, paste it into the SQL Editor, and click **Run**.
4. Open `db/seed.sql` from this repository, paste it into the SQL Editor, and click **Run**. This will create the 2026 survey and all required questions.
5. (Optional) Check out `db/queries/dashboard_queries.sql` if you want to run analytics via the SQL Editor manually.

### 3. Local Development
1. Rename `.env.example` to `.env.local`
2. Configure the following Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_URL=https://your-project-ref.supabase.co
# We only use the anon key for the public client
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DASHBOARD_PASSWORD=1234
IP_HASH_SALT=your_secure_random_string
```

*(You can find Supabase URL and keys in Supabase Dashboard -> Project Settings -> API)*

3. Run the development server:
```bash
npm run dev
```

### 4. Deployment (Vercel)
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and import your GitHub repository.
3. Add the environment variables specified above in Vercel settings.
4. Click **Deploy**.

### 5. Smoke Test
1. **Submit a Survey:** Navigate to `/survey/ai-usage-2026`. Fill out the form as a user and submit it. You should see a success message with an ID.
2. **Verify DB:** Go back to the Supabase dashboard -> Table Editor -> `submissions` and `answers` tables to confirm the entries were saved safely.
3. **View Analytics:** Navigate to `/dashboard`. You will be redirected to the login page.
4. Enter the password you set in `DASHBOARD_PASSWORD`.
5. You should now see dynamic charts representing your newly submitted data!

---

## Technical Features
- **App Router & Server Components:** Utilizes Next.js optimizations.
- **SSR & RLS Security:** Users write to the database via API routes. Raw Supabase RLS is configured to deny all public writes. The server exclusively uses the `SUPABASE_SERVICE_ROLE_KEY` to read forms and submit answers inside secure endpoints.
- **Edge Analytics:** Dashboard graphs aggregate raw data dynamically server-side without exposing DB schema.
- **Brute Force Protection:** Built-in failed login tracking using an IP-based mechanism, locked behind custom Next.js middleware.
