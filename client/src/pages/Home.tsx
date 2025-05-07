import ApplicationForm from "@/components/ApplicationForm";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Discord Moderator Application</title>
        <meta name="description" content="Apply to join our Discord moderation team. Fill out the application form to be considered for a moderator position." />
        <meta property="og:title" content="Discord Moderator Application" />
        <meta property="og:description" content="Apply to join our Discord moderation team. Fill out the application form to be considered for a moderator position." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col items-center py-10 px-4">
        <div className="max-w-3xl w-full">
          <h1 className="text-4xl font-bold text-primary text-center mb-2">Discord Moderator Application</h1>
          <p className="text-muted-foreground text-center mb-8">Join our moderation team by filling out this form</p>
          
          <ApplicationForm />
          
          <div className="text-center text-muted-foreground text-sm mt-6">
            © 2025 Discord Server. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
