
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, UserPlus, DollarSign, BarChart, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center bg-gradient-to-b from-primary/10 to-background">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Truck driving on highway"
            fill
            className="absolute inset-0 z-0 opacity-30 object-cover"
            data-ai-hint="truck highway logistics"
            priority
          />
          <div className="relative z-10 container max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
              Connecting Shipments, Delivering Trust
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8">
              The easiest way to book trucks and manage your logistics. Reliable, efficient, and transparent.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/customer-booking">Book a Truck</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/driver-registration">Register Your Truck</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section (Customer/Driver Boxes) */}
        <section id="features" className="py-16 bg-background">
          <div className="container max-w-screen-lg px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Get Started</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                   <Image
                     src="https://placehold.co/600x400.png"
                     alt="Customer booking a truck"
                     width={600}
                     height={400}
                     className="w-full h-48 object-cover"
                     data-ai-hint="customer booking online"
                   />
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <CardTitle className="text-2xl mb-4 text-primary">For Customers</CardTitle>
                  <p className="text-muted-foreground mb-6">
                    Need to transport your goods? Post your shipment details and get competitive bids from reliable drivers.
                  </p>
                  <Button asChild>
                    <Link href="/customer-booking">Book Your Shipment</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                 <CardHeader className="p-0">
                  <Image
                    src="https://placehold.co/600x400.png"
                    alt="Truck driver registering"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                     data-ai-hint="truck driver registration online"
                  />
                 </CardHeader>
                <CardContent className="p-6 text-center">
                  <CardTitle className="text-2xl mb-4 text-primary">For Truck Drivers</CardTitle>
                  <p className="text-muted-foreground mb-6">
                    Find loads easily. Register your truck, get notified about new shipments, and bid competitively.
                  </p>
                  <Button variant="secondary" asChild>
                    <Link href="/driver-registration">Register Your Truck</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-16 bg-secondary/50">
          <div className="container max-w-screen-lg px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-primary">About TruckConnect</h2>
            <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto">
              TruckConnect was founded with a mission to simplify the logistics industry. We leverage technology to create a transparent and efficient marketplace connecting customers needing shipments with reliable truck drivers and owners. Our platform streamlines booking, bidding, and tracking, making transportation hassle-free for everyone involved.
            </p>
          </div>
        </section>

         {/* Our Services Section */}
        <section id="services" className="py-16 bg-background">
          <div className="container max-w-screen-lg px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
              <Card className="pt-6">
                <CardContent>
                  <Package size={48} className="mx-auto mb-4 text-accent" />
                  <h3 className="text-xl font-semibold mb-2 text-primary">Easy Booking</h3>
                  <p className="text-muted-foreground">Simple form to post your shipment details quickly.</p>
                </CardContent>
              </Card>
               <Card className="pt-6">
                <CardContent>
                  <UserPlus size={48} className="mx-auto mb-4 text-accent" />
                  <h3 className="text-xl font-semibold mb-2 text-primary">Driver Network</h3>
                  <p className="text-muted-foreground">Access a wide network of verified truck drivers.</p>
                </CardContent>
              </Card>
              <Card className="pt-6">
                <CardContent>
                  <DollarSign size={48} className="mx-auto mb-4 text-accent" />
                  <h3 className="text-xl font-semibold mb-2 text-primary">Competitive Bidding</h3>
                  <p className="text-muted-foreground">Drivers bid on your shipment, ensuring fair prices.</p>
                </CardContent>
              </Card>
                 <Card className="pt-6">
                <CardContent>
                  <BarChart size={48} className="mx-auto mb-4 text-accent" />
                   <h3 className="text-xl font-semibold mb-2 text-primary">AI Bid Assist</h3>
                  <p className="text-muted-foreground">AI-powered bid suggestions for drivers.</p>
                </CardContent>
              </Card>
                 <Card className="pt-6">
                <CardContent>
                  <CheckCircle size={48} className="mx-auto mb-4 text-accent" />
                  <h3 className="text-xl font-semibold mb-2 text-primary">Real-time Tracking</h3>
                  <p className="text-muted-foreground">Track your shipment's progress from start to finish. (Coming Soon)</p>
                </CardContent>
              </Card>
                <Card className="pt-6">
                <CardContent>
                  <ShieldCheck size={48} className="mx-auto mb-4 text-accent" />
                  <h3 className="text-xl font-semibold mb-2 text-primary">Secure Platform</h3>
                  <p className="text-muted-foreground">Safe registration and booking processes.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Customer Benefits Section */}
        <section id="benefits" className="py-16 bg-secondary/50">
          <div className="container max-w-screen-lg px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Why Choose TruckConnect?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-primary">Save Time & Money</h3>
                  <p className="text-foreground/80">Our efficient bidding system helps you find the best rates quickly, saving you valuable time and resources.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-primary">Reliable Carriers</h3>
                  <p className="text-foreground/80">We verify our drivers and truck owners, ensuring your goods are transported by trusted professionals.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-primary">Transparency</h3>
                  <p className="text-foreground/80">Clear communication and tracking provide full visibility into your shipment's journey.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-primary">Wide Range of Trucks</h3>
                  <p className="text-foreground/80">Access various truck types to meet your specific cargo requirements, from standard to specialized.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-background">
          <div className="container max-w-screen-lg px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-primary">Transparent Pricing</h2>
            <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto mb-12">
              TruckConnect operates on a competitive bidding model. Customers post shipments for free. Drivers bid based on market rates, distance, and shipment specifics. Our platform ensures fair pricing through transparency and competition. Drivers may be subject to a small commission fee upon successful booking completion.
            </p>
             <div className="grid md:grid-cols-2 gap-8">
               <Card className="text-left shadow-lg">
                 <CardHeader>
                    <CardTitle className="text-2xl text-primary">For Customers</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-2">
                   <p><CheckCircle className="inline h-5 w-5 mr-2 text-accent" /> Post Shipments: <span className="font-semibold">Free</span></p>
                   <p><CheckCircle className="inline h-5 w-5 mr-2 text-accent" /> Receive Bids: <span className="font-semibold">Free</span></p>
                   <p><CheckCircle className="inline h-5 w-5 mr-2 text-accent" /> Select Best Bid</p>
                   <p><CheckCircle className="inline h-5 w-5 mr-2 text-accent" /> Pay Agreed Price Directly to Driver/Company</p>
                 </CardContent>
               </Card>
                <Card className="text-left shadow-lg">
                 <CardHeader>
                    <CardTitle className="text-2xl text-primary">For Drivers/Carriers</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-2">
                   <p><CheckCircle className="inline h-5 w-5 mr-2 text-accent" /> Register Truck: <span className="font-semibold">Free</span></p>
                    <p><CheckCircle className="inline h-5 w-5 mr-2 text-accent" /> Receive Shipment Notifications: <span className="font-semibold">Free</span></p>
                   <p><CheckCircle className="inline h-5 w-5 mr-2 text-accent" /> Place Bids: <span className="font-semibold">Free</span></p>
                   <p><CheckCircle className="inline h-5 w-5 mr-2 text-accent" /> Small Success Fee on Completed Loads (e.g., 5-10%)</p>
                 </CardContent>
               </Card>
             </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
