import { Plus_Jakarta_Sans } from "next/font/google"; // Import Plus Jakarta Sans font
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Using the Plus Jakarta Sans font from Google Fonts
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });  // Metropolis Sans Saf

export const metadata = {
  title: "EMS Admin Panel",
  description: "Employee Management System Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}> {/* Apply the font to the body */}
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
