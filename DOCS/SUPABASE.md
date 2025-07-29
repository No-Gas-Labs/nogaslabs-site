# Supabase Setup (cloud saves + admin)
1) Create project at supabase.com. Copy Project URL and anon public key.
2) In GitHub Pages, the anon key is safe to embed with row-level security (RLS).
3) In the SQL editor, run the SQL from DOCS/SUPABASE_SQL.sql.
4) In Authentication -> Users, sign in with your email once, then mark your user as admin:
   - Set user `app_metadata.role = "admin"` OR `user_metadata.is_admin = true`.
5) In the site, define before /js/db.js:
   ```html
   <script>
     window.NGL_SUPABASE_URL="https://YOUR-PROJECT.supabase.co";
     window.NGL_SUPABASE_ANON_KEY="YOUR-ANON-KEY";
   </script>
```

6. Test: open /game/, click "Sign in", complete the magic link, move player, wait 60s; cloud save should sync.


7. Admin: open /admin/. If you see 403, your account is not marked admin yet.
