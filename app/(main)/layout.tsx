import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "./component/Header";
import AddSchedule from "./component/AddSchedule";
import DateShowLeft from "./component/DateShowLeft";
import { ScheduleProvider } from "./ScheduleContext";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <ScheduleProvider>
      <Header />
      <div className="flex h-auto">
        <div className="flex flex-col shrink-0 w-80 relative z-20">
          <AddSchedule />
          <DateShowLeft />
        </div>
        <div className="flex-1 min-w-0 relative z-10">{children}</div>
      </div>
    </ScheduleProvider>
  );
}