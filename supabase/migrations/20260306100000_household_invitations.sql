CREATE TABLE IF NOT EXISTS "public"."household_invitations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "household_id" "uuid" NOT NULL,
    "invited_by" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "status" "text" NOT NULL DEFAULT 'pending'
);

ALTER TABLE "public"."household_invitations" OWNER TO "postgres";

ALTER TABLE ONLY "public"."household_invitations"
    ADD CONSTRAINT "household_invitations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."household_invitations"
    ADD CONSTRAINT "household_invitations_household_id_email_key" UNIQUE ("household_id", "email");

ALTER TABLE ONLY "public"."household_invitations"
    ADD CONSTRAINT "household_invitations_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."household_invitations"
    ADD CONSTRAINT "household_invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE "public"."household_invitations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "public"."household_invitations" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."household_invitations" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable update for users based on email" ON "public"."household_invitations" FOR UPDATE TO "authenticated" USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON "public"."household_invitations" FOR DELETE TO "authenticated" USING (true);

GRANT ALL ON TABLE "public"."household_invitations" TO "anon";
GRANT ALL ON TABLE "public"."household_invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."household_invitations" TO "service_role";
