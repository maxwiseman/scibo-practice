import { sql } from "@scibo/db";
import { db } from "@scibo/db/client";
import { HomeClient } from "./client";

export default function Page() {
  const data = db.query.question.findFirst({ orderBy: sql`random()` });

  return (
    <main className="flex size-full items-center justify-center py-16">
      <HomeClient data={data} />
    </main>
  );
}
