

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "household_id" "uuid" NOT NULL,
    "name" "text",
    "month" numeric,
    "year" numeric
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


COMMENT ON TABLE "public"."categories" IS 'budget categories';



CREATE TABLE IF NOT EXISTS "public"."household" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "stripe_customer_id" "text",
    "stripe_subscription_id" "text",
    "subscription_status" "text",
    "plan_name" "text",
    "stripe_product_id" "text"
);


ALTER TABLE "public"."household" OWNER TO "postgres";


COMMENT ON TABLE "public"."household" IS 'house hold can contain family members that have access to the same budget';



COMMENT ON COLUMN "public"."household"."stripe_customer_id" IS 'Stripe customer id (cus_...)';



COMMENT ON COLUMN "public"."household"."stripe_subscription_id" IS 'Stripe subscription id (sub_...)';



COMMENT ON COLUMN "public"."household"."subscription_status" IS 'active | canceled | past_due | unpaid | null';



CREATE TABLE IF NOT EXISTS "public"."income" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "updated_at" timestamp with time zone,
    "month" numeric,
    "year" numeric,
    "amount" numeric NOT NULL,
    "name" "text",
    "household_id" "uuid" NOT NULL
);


ALTER TABLE "public"."income" OWNER TO "postgres";


COMMENT ON TABLE "public"."income" IS 'Income per household';



CREATE TABLE IF NOT EXISTS "public"."line_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "created_by" "uuid",
    "name" "text",
    "month" numeric,
    "year" numeric,
    "planned_amount" numeric,
    "category_id" "uuid" NOT NULL
);


ALTER TABLE "public"."line_items" OWNER TO "postgres";


COMMENT ON TABLE "public"."line_items" IS 'line items for each category';



CREATE TABLE IF NOT EXISTS "public"."transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "created_by" "uuid",
    "household_id" "uuid" NOT NULL,
    "line_item_id" "uuid",
    "month" numeric,
    "year" numeric,
    "description" "text",
    "amount" numeric,
    "type" "text",
    "date" timestamp with time zone
);


ALTER TABLE "public"."transactions" OWNER TO "postgres";


COMMENT ON TABLE "public"."transactions" IS 'monthly transactions';



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "household_id" "uuid",
    "avatar_emoji" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'user data';



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."household"
    ADD CONSTRAINT "household_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."income"
    ADD CONSTRAINT "income_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."line_items"
    ADD CONSTRAINT "line_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."income"
    ADD CONSTRAINT "income_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."income"
    ADD CONSTRAINT "income_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."line_items"
    ADD CONSTRAINT "line_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."line_items"
    ADD CONSTRAINT "line_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_line_item_id_fkey" FOREIGN KEY ("line_item_id") REFERENCES "public"."line_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Enable delete for users based on user_id" ON "public"."categories" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable delete for users based on user_id" ON "public"."household" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable delete for users based on user_id" ON "public"."income" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable delete for users based on user_id" ON "public"."line_items" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable delete for users based on user_id" ON "public"."transactions" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable delete for users based on user_id" ON "public"."users" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."categories" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."household" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."income" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."line_items" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."transactions" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for users based on user_id" ON "public"."users" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Enable read access for all users" ON "public"."categories" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."household" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."income" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."line_items" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."transactions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."categories" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."household" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."income" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."line_items" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."transactions" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."users" FOR UPDATE TO "authenticated" USING (((( SELECT "auth"."jwt"() AS "jwt") ->> 'email'::"text") = "email")) WITH CHECK (((( SELECT "auth"."jwt"() AS "jwt") ->> 'email'::"text") = "email"));



ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."household" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."income" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."line_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."household" TO "anon";
GRANT ALL ON TABLE "public"."household" TO "authenticated";
GRANT ALL ON TABLE "public"."household" TO "service_role";



GRANT ALL ON TABLE "public"."income" TO "anon";
GRANT ALL ON TABLE "public"."income" TO "authenticated";
GRANT ALL ON TABLE "public"."income" TO "service_role";



GRANT ALL ON TABLE "public"."line_items" TO "anon";
GRANT ALL ON TABLE "public"."line_items" TO "authenticated";
GRANT ALL ON TABLE "public"."line_items" TO "service_role";



GRANT ALL ON TABLE "public"."transactions" TO "anon";
GRANT ALL ON TABLE "public"."transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."transactions" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























