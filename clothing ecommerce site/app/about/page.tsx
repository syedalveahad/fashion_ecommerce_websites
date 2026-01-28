import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">About RastaLife</h1>
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              RastaLife is a premium Bangladeshi fashion clothing brand dedicated to providing high-quality, stylish apparel to fashion-conscious individuals across Bangladesh.
            </p>
            <p className="text-lg mb-4">
              Founded with a vision to make quality fashion accessible to everyone, RastaLife offers a wide range of t-shirts and clothing that combine comfort, style, and affordability.
            </p>
            <p className="text-lg mb-4">
              Our tagline, "The Roads to Finding the Best Product for You!" reflects our commitment to helping every customer discover the perfect product that matches their style and personality.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
            <p className="text-lg">
              To provide premium quality clothing that reflects the vibrant spirit of Bangladesh while making fashion accessible, affordable, and authentic for everyone.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
