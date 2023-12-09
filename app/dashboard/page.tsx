import Container from "@/components/general/Container";
import { DB } from "@/lib/prisma";
import UploadModal from "./components/UploadModal";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage: React.FC = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const syncedUser = await DB.user.findFirst({ where: { id: user.id } });

  if (!syncedUser) redirect("/auth-callback?origin=dashboard");

  return (
    <Container>
      <div className="mt-8 flex flex-col items-start justify-between gap-4  pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl">
          Files
        </h1>

        <UploadModal />
      </div>

    </Container>
  );
};

export default DashboardPage;
