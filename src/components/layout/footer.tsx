import Link from 'next/link';
import { Truck, Facebook, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-16">
      <div className="container max-w-screen-2xl grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and About */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <Truck className="h-8 w-8" />
            <span className="text-2xl font-bold">TruckConnect</span>
          </Link>
          <p className="text-sm text-primary-foreground/80">
            Connecting shippers and carriers seamlessly for efficient logistics solutions. Your reliable partner in transportation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <nav className="flex flex-col space-y-2 text-sm">
            <Link href="/#about" className="hover:text-accent transition-colors">About Us</Link>
            <Link href="/#services" className="hover:text-accent transition-colors">Services</Link>
            <Link href="/customer-booking" className="hover:text-accent transition-colors">Book a Truck</Link>
            <Link href="/driver-registration" className="hover:text-accent transition-colors">Register Your Truck</Link>
            <Link href="/#pricing" className="hover:text-accent transition-colors">Pricing</Link>
            <Link href="/track" className="hover:text-accent transition-colors">Track Load</Link>
          </nav>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <address className="not-italic text-sm space-y-2 text-primary-foreground/80">
            <p>123 Logistics Lane, Transport City, TC 54321</p>
            <p>Email: <a href="mailto:support@truckconnect.com" className="hover:text-accent transition-colors">support@truckconnect.com</a></p>
            <p>Phone: <a href="tel:+1234567890" className="hover:text-accent transition-colors">+1 (234) 567-890</a></p>
          </address>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <Link href="#" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Facebook">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Twitter">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container max-w-screen-2xl text-center mt-8 pt-8 border-t border-primary-foreground/20 text-sm text-primary-foreground/60">
        © {new Date().getFullYear()} TruckConnect. All rights reserved.
      </div>
    </footer>
  );
}
