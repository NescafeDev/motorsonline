import PageContainer from "@/components/PageContainer";
import UserForm from "./UserForm";

export default function UserPage() {
  return (
    <PageContainer>
      <main className="flex-1 px-6 lg:px-[100px] py-8">
        <UserForm />
      </main>
    </PageContainer>
  );
}
