import Container from "@/components/general/Container";
import { DB } from "@/lib/prisma";
import FileGrid from "./components/FileGrid";
import GradientText from "@/components/general/GradientText";
import { Separator } from "@/components/ui/separator";
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
            <div className="col-span-2 w-full space-y-2 mt-4">
                <div>
                    <h3 className="text-2xl font-medium">
                        <GradientText text="Files" />
                    </h3>
                </div>

                <Separator className="bg-primary/10" />
            </div>

            <FileGrid subscriptionPlan={subscriptionPlan} />
        </Container>
    );
};

export default DashboardPage;
