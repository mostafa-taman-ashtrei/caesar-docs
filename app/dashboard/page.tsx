import Container from "@/components/general/Container";
import { DB } from "@/lib/prisma";
import FileGrid from "./components/FileGrid";
import UploadModal from "./components/UploadModal";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { redirect } from "next/navigation";

const DashboardPage: React.FC = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

    const syncedUser = await DB.user.findFirst({ where: { id: user.id } });

    if (!syncedUser) redirect("/auth-callback?origin=dashboard");

    const subscriptionPlan = await getUserSubscriptionPlan();

    return (
        <Container>
            <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 text-5xl font-bold">Files</h1>

                <UploadModal subscriptionPlan={subscriptionPlan} />
            </div>

            <FileGrid />
        </Container>
    );
};

export default DashboardPage;
