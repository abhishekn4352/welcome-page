const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-xl font-semibold text-foreground">
            Brand
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved. Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
