export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Learne. All rights reserved.</p>
      </div>
    </footer>
  );
};
