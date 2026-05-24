export default function Footer() {
  return (
    <footer
      className="
        border-t
        border-slate-200
        bg-white
        px-4
        md:px-6
        py-4
        mt-auto
      "
    >
      <div
        className="
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-2
        "
      >
        <p className="text-xs text-slate-400 text-center md:text-left">
          © 2026 HMS — Hospital Management System
        </p>

        <p className="text-xs text-slate-400 text-center md:text-right">
          Built with ❤️ for better healthcare
        </p>
      </div>
    </footer>
  );
}