import Container from "@/components/general/Container";
import { DB } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage: React.FC = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const syncedUser = await DB.user.findFirst({ where: { id: user.id } });

  if (!syncedUser) redirect("/auth-callback?origin=dashboard");

  return <Container className="mb-12 mt-28 flex flex-col items-center justify-center text-center sm:mt-40">
    <h1>Welcome to the dashboard</h1>
  </Container>;
};

export default DashboardPage;
