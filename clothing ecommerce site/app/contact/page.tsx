import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
          <div className="max-w-2xl">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Address</h2>
                <p>Dhaka, Bangladesh</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Phone</h2>
                <p>+880 1XXX-XXXXXX</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Email</h2>
                <p>info@rastalife.com</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
                <p>Saturday - Thursday: 9:00 AM - 6:00 PM</p>
                <p>Friday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
