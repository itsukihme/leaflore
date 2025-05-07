import ApplicationForm from "@/components/ApplicationForm";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">Discord Moderator Application</h1>
        <p className="text-muted-foreground">Join our moderation team by filling out this form</p>
      </header>

      {/* Application Form */}
      <ApplicationForm />

      {/* Footer */}
      <footer className="mt-10 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Discord Server. All rights reserved.</p>
      </footer>
    </div>
  );
}
