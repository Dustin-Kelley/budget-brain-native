CREATE TABLE "public"."income_transactions" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz,
    "created_by" uuid NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
    "income_id" uuid NOT NULL REFERENCES "public"."income"("id") ON DELETE CASCADE,
    "household_id" uuid NOT NULL REFERENCES "public"."household"("id") ON DELETE CASCADE,
    "amount" numeric NOT NULL,
    "date" timestamptz,
    "description" text,
    "month" numeric,
    "year" numeric,
    PRIMARY KEY ("id")
);

ALTER TABLE "public"."income_transactions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "public"."income_transactions" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."income_transactions" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id" ON "public"."income_transactions" FOR UPDATE TO "authenticated" USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON "public"."income_transactions" FOR DELETE TO "authenticated" USING (true);

GRANT ALL ON TABLE "public"."income_transactions" TO "anon";
GRANT ALL ON TABLE "public"."income_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."income_transactions" TO "service_role";
